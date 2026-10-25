#!/usr/bin/env python3
"""
assets/fotolar.js içindeki Wikimedia Commons fotoğraflarının arka planını kaldırır.
Çıktı: assets/kesit/<ad>.webp (saydam, araca göre kırpılmış) ve assets/kesit.js (src -> dosya eşlemesi).
GitHub Actions'ta çalışır (.github/workflows/foto-kes.yml); fotolar.js değişince yeni fotoğrafları işler.
Kalite kontrolü: araç fotoğrafın kenarından kesilmişse ya da maske çok küçük/parçalıysa kesit üretilmez,
site orijinal fotoğrafı göstermeye devam eder (assets/kesit.js içinde "red" listesi).
Lisans: CC BY-SA türev esere izin verir; sitede "arka planı kaldırıldı" notu gösterilir.
"""
import hashlib, io, json, os, re, sys, time, urllib.request
import numpy as np
from PIL import Image
from scipy import ndimage

KOK = os.path.join(os.path.dirname(__file__), '..')
FJS = os.path.join(KOK, 'assets', 'fotolar.js')
KJS = os.path.join(KOK, 'assets', 'kesit.js')
KDIR = os.path.join(KOK, 'assets', 'kesit')
ELLE = os.path.join(os.path.dirname(__file__), 'kesit_red.json')  # gözle kontrolde beğenilmeyen kesitler: {"src": "neden"}
UA = 'arabakarsilastirsec-foto-kes/1.0 (https://github.com/fatihdonmezG/arabakarsilastirsec)'

def oku_fotolar():
    t = open(FJS, encoding='utf8').read()
    m = re.search(r'window\.FOTOLAR\s*=\s*(\{.*\});', t)
    return json.loads(m.group(1))

def oku_kesit():
    if not os.path.exists(KJS): return {'dosya': {}, 'red': {}}
    t = open(KJS, encoding='utf8').read()
    m = re.search(r'window\.KESIT\s*=\s*(\{.*\});', t, re.S)
    return json.loads(m.group(1)) if m else {'dosya': {}, 'red': {}}

def indir(u):
    for i in range(4):
        try:
            r = urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': UA}), timeout=60)
            return r.read()
        except Exception as e:
            print('  indirme denemesi', i + 1, e); time.sleep(5 * (i + 1))
    return None

def kes(im, oturum):
    from rembg import remove
    im = im.convert('RGB')
    o = remove(im, session=oturum, post_process_mask=True)
    a = np.array(o.getchannel('A'))
    # yarı saydam kalan arka plan nesneleri (arkadaki araçlar) silinsin: kenar yumuşaklığı korunur, soluk bölgeler atılır
    m = a > 200
    a = np.where(ndimage.binary_dilation(m, iterations=2), a, 0).astype('uint8')
    if m.sum() < 0.10 * m.size: return None, 'uzaktan çekim: araç fotoğrafta çok küçük'
    lab, n = ndimage.label(m)
    if n > 1:
        boy = ndimage.sum(m, lab, range(1, n + 1))
        en = int(np.argmax(boy)) + 1
        # en büyük parça + ona çok yakın küçük parçalar (ayna, anten) kalsın; uzak ikinci araç gitsin
        yakin = ndimage.binary_dilation(lab == en, iterations=max(4, int(0.01 * max(m.shape))))
        tut = np.zeros_like(m)
        for k in range(1, n + 1):
            if k == en or (yakin & (lab == k)).any(): tut |= (lab == k)
        a = np.where(ndimage.binary_dilation(tut, iterations=2), a, 0).astype('uint8')
        m = a > 200
    ys, xs = np.where(m)
    h, w = m.shape
    pay = 3
    kenar = [xs.min() <= pay, xs.max() >= w - 1 - pay, ys.min() <= pay]
    if kenar[0] or kenar[1]: return None, 'araç fotoğrafın yan kenarından kesilmiş'
    if kenar[2]: return None, 'araç fotoğrafın üst kenarından kesilmiş'
    alt_kesik = ys.max() >= h - 1 - pay
    if alt_kesik: return None, 'araç fotoğrafın alt kenarından kesilmiş'
    o.putalpha(Image.fromarray(a.astype('uint8')))
    o = o.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    if o.width > 1200: o = o.resize((1200, round(o.height * 1200 / o.width)), Image.LANCZOS)
    return o, None

def main():
    from rembg import new_session
    zorla = '--hepsi' in sys.argv
    F = oku_fotolar(); K = oku_kesit()
    srcler = sorted({f['src'] for v in F.values() for f in v})
    elle = json.load(open(ELLE, encoding='utf8')) if os.path.exists(ELLE) else {}
    for s, neden in elle.items():
        if s in K['dosya']:
            p = os.path.join(KDIR, K['dosya'].pop(s)['ad'])
            if os.path.exists(p): os.remove(p)
        K['red'][s] = 'elle: ' + neden
    os.makedirs(KDIR, exist_ok=True)
    oturum = None; yeni = 0
    for s in srcler:
        if not zorla and (s in K['dosya'] or s in K['red']): continue
        if oturum is None: oturum = new_session(os.environ.get('KES_MODEL', 'isnet-general-use'))
        print('işleniyor', s)
        b = indir(s)
        if not b: print('  indirilemedi'); continue
        o, neden = kes(Image.open(io.BytesIO(b)), oturum)
        if o is None:
            K['red'][s] = neden; print('  red:', neden); continue
        ad = hashlib.sha1(s.encode()).hexdigest()[:12] + '.webp'
        o.save(os.path.join(KDIR, ad), 'WEBP', quality=86, method=6)
        K['dosya'][s] = {'ad': ad, 'en': o.width, 'boy': o.height}; yeni += 1
        time.sleep(1)
    # fotolar.js'ten çıkmış kayıtları temizle
    for k in ('dosya', 'red'):
        for s in list(K[k]):
            if s not in srcler:
                if k == 'dosya':
                    p = os.path.join(KDIR, K[k][s]['ad'])
                    if os.path.exists(p): os.remove(p)
                del K[k][s]
    with open(KJS, 'w', encoding='utf8') as f:
        f.write('/* Arka planı kaldırılmış araç fotoğrafları (tools/foto_kes.py üretir, elle düzenlemeyin).\n'
                ' * dosya: orijinal Commons adresi -> assets/kesit/ altındaki saydam WebP; red: kesit üretilmeyenler ve nedeni. */\n')
        f.write('window.KESIT = ' + json.dumps(K, ensure_ascii=False, sort_keys=True) + ';\n')
    print(f'yeni kesit: {yeni}, toplam: {len(K["dosya"])}, red: {len(K["red"])}')

if __name__ == '__main__':
    main()
