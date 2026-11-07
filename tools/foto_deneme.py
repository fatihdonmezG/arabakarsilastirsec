#!/usr/bin/env python3
"""Deneme: bir fotoğrafın arka planını farklı yöntemlerle kaldırıp karşılaştırma görselleri üretir (siteye uygulanmaz)."""
import io, os, sys, time, urllib.request
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
UA = 'arabakarsilastirsec-foto-deneme/1.0 (https://github.com/fatihdonmezG/arabakarsilastirsec)'
OUT = os.path.join(os.path.dirname(__file__), '..', 'deneme')
def indir(u):
    for i in range(4):
        try: return urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': UA}), timeout=90).read()
        except Exception as e: print('indirme', i, e); time.sleep(5)
def ana_parca(a, esik=128):
    m = a > esik
    lab, n = ndimage.label(m)
    if n > 1:
        boy = ndimage.sum(m, lab, range(1, n + 1)); en = int(np.argmax(boy)) + 1
        m = lab == en
    return m
def temizle(alpha):
    """Yumuşak kenarı korur: ana parçayı bulur, ince çıkıntıları (bacak, direk) açma işlemiyle atar, kenarı hafif yumuşatır."""
    a = alpha.astype(np.float32)
    m = ana_parca(alpha)
    # ince uzantıları at: aracın gövdesinden ince bağlarla tutunan parçalar
    k = max(3, int(0.006 * max(m.shape)))
    acik = ndimage.binary_opening(m, structure=np.ones((k, k)))
    acik = ana_parca((acik * 255).astype(np.uint8))
    bolge = ndimage.binary_dilation(acik, iterations=k + 2)
    a = np.where(bolge, a, 0)
    # renk taşmasını azaltmak için kenarda alfa eğrisi: yarı saydamı biraz sıkılaştır
    a = np.clip((a - 20) * 255 / 215, 0, 255)
    return Image.fromarray(a.astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
def kenar_renk(rgb, alpha):
    """Kenardaki arka plan rengini içeriden komşu piksellerle değiştir (decontamination)."""
    r = np.array(rgb).astype(np.float32); a = np.array(alpha).astype(np.float32) / 255
    ic = a > 0.95
    if ic.sum() == 0: return rgb
    idx = ndimage.distance_transform_edt(~ic, return_distances=False, return_indices=True)
    yakin = r[idx[0], idx[1]]
    w = (1 - a)[..., None] * (a > 0.02)[..., None]
    r = r * (1 - w * 0.85) + yakin * (w * 0.85)
    return Image.fromarray(np.clip(r, 0, 255).astype(np.uint8))
def sahne(o, ad):
    w, h = o.size; W = int(w * 1.15); H = int(h * 1.45)
    bg = Image.new('RGB', (W, H))
    y = np.linspace(0, 1, H)[:, None]
    ust = np.array([246, 247, 249]); orta = np.array([233, 236, 241]); zemin = np.array([217, 222, 229]); alt = np.array([210, 216, 224])
    ufuk = 0.62
    col = np.where(y < ufuk, ust + (orta - ust) * (y / ufuk), zemin + (alt - zemin) * ((y - ufuk) / (1 - ufuk)))
    bg = Image.fromarray(np.repeat(col[:, None, :].astype(np.uint8), W, axis=1).reshape(H, W, 3))
    # gölge
    sh = Image.new('L', (W, H), 0); al = np.array(o.getchannel('A'))
    sx = (W - w) // 2; sy = int(H * 0.86) - h
    g = Image.new('L', (w, h), 0); alt_satir = np.where(al.any(axis=1))[0].max()
    g = Image.fromarray(((al > 128) * 255).astype(np.uint8)).resize((w, max(1, int(h * 0.12))))
    sh.paste(g, (sx, sy + alt_satir - int(h * 0.06)))
    sh = sh.filter(ImageFilter.GaussianBlur(int(h * 0.04)))
    bg.paste((60, 68, 80), (0, 0), sh.point(lambda v: int(v * 0.45)))
    bg = bg.convert('RGBA'); bg.alpha_composite(o, (sx, sy)); bg.convert('RGB').save(os.path.join(OUT, ad), quality=92)
def kirp(o):
    a = np.array(o.getchannel('A')); ys, xs = np.where(a > 10)
    return o.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
def main():
    from rembg import remove, new_session
    u = sys.argv[1]; ad = sys.argv[2]
    os.makedirs(OUT, exist_ok=True)
    b = indir(u); im = Image.open(io.BytesIO(b)).convert('RGB')
    if im.width > 2400: im = im.resize((2400, round(im.height * 2400 / im.width)), Image.LANCZOS)
    im.save(os.path.join(OUT, ad + '-orijinal.jpg'), quality=90)
    for model in ['isnet-general-use', 'birefnet-general']:
        t = time.time(); s = new_session(model)
        o = remove(im, session=s, post_process_mask=False)
        alpha = o.getchannel('A')
        if model == 'isnet-general-use':
            # sitedeki mevcut yöntem: sert eşik
            a = np.array(alpha); m = a > 200; a = np.where(ndimage.binary_dilation(m, iterations=2), a, 0).astype('uint8')
            eski = im.copy(); eski.putalpha(Image.fromarray(a)); sahne(kirp(eski), ad + '-1-mevcut-yontem.jpg')
        yeni_a = temizle(np.array(alpha)); rgb = kenar_renk(im, yeni_a)
        yeni = rgb.copy(); yeni.putalpha(yeni_a); yeni = kirp(yeni)
        yeni.save(os.path.join(OUT, f'{ad}-{model}.webp'), 'WEBP', quality=90)
        sahne(yeni, f'{ad}-2-{model}.jpg')
        print(model, round(time.time() - t, 1), 's')
if __name__ == '__main__': main()
