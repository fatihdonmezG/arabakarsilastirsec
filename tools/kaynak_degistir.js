#!/usr/bin/env node
/*
 * Yasaklı kaynakla girilmiş kayıtları resmi kaynağa taşır (karsilastirma.html ve arac-detay.html birlikte).
 * Kullanım:  node tools/kaynak_degistir.js temizlik.jsonl [--kuru]
 *
 * Her satır bir işlem (aynı id için birden çok satır yazılabilir, sırayla uygulanır):
 *  {"id":"...","islem":"ana_kaynak","kaynakAd":"vw.com.tr Tiguan fiyat ve teknik listesi (Ekim 2026)","kaynakUrl":"https://...","kaynakTuru":"birincil","sonDogrulama":"2026-10-21"}
 *      Kaydın ana kaynağını değiştirir. Yalnızca yeni kaynakta doğrulanan alanlar kalmalı: doğrulanamayanları alan_sil ile silin.
 *  {"id":"...","islem":"alan_kaynak","alan":"tork_nm","kaynakAd":"...","kaynakUrl":"https://...","sonDogrulama":"2026-10-21","deger":250}
 *      Bir alanı ana kaynaktan farklı bir resmi kaynakla belgeler. "deger" verilirse eski değer düzeltilir.
 *  {"id":"...","islem":"alan_sil","alan":"agirlik_kg","neden":"resmi kaynakta yok"}
 *      Yalnızca yasaklı kaynağa dayanan, başka kaynakla doğrulanamayan değeri siler (alan "Bilgi yok" olur).
 *  {"id":"...","islem":"detay_sil","yol":"kucukDetaylar.1"}
 *      Detay kaydında bir dizi öğesini siler (kaynağı yasaklı olan artı/eksi, küçük detay vb.).
 *  {"id":"...","islem":"detay_deger","yol":"kucukDetaylar.0.kaynak","deger":"https://..."}
 *      Detay kaydında bir değeri değiştirir. "yol" "durum", "nesil" ya da "donem" ise iki dosyada birlikte değişir.
 *
 * Kurallar: yeni URL https olmalı ve yasaklı site olamaz; fiyat alanları yalnızca 2026 model yılında belgelenebilir;
 * sahibinden yalnızca satıştan kalkmış eski modellerde ve teknik veri için (kaynakTuru "sahibinden").
 * Hata varsa hiçbir dosya yazılmaz. Sonunda puanlar yeniden hesaplanır ve kalan yasaklı kayıt sayısı yazdırılır.
 */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { YASAK } = require('./yasak_kaynak.js');
const ROOT = path.join(__dirname, '..');
const KF = path.join(ROOT, 'karsilastirma.html'), DF = path.join(ROOT, 'arac-detay.html');
const args = process.argv.slice(2), kuru = args.includes('--kuru');
const dosya = args.find(a => !a.startsWith('--'));
if (!dosya) { console.error('Kullanım: node tools/kaynak_degistir.js temizlik.jsonl [--kuru]'); process.exit(1); }
const ops = fs.readFileSync(dosya, 'utf8').split('\n').map(x => x.trim()).filter(Boolean).map((x, i) => { try { return JSON.parse(x); } catch (e) { console.error(`Satır ${i + 1} JSON değil`); process.exit(1); } });

let k = fs.readFileSync(KF, 'utf8'), d = fs.readFileSync(DF, 'utf8');
const ty = fs.readFileSync(path.join(__dirname, 'teknik_yama.js'), 'utf8');
const ALANLAR = new Function('return ' + ty.match(/const ALANLAR = (new Set\(\[[\s\S]*?\]\))/)[1])();
const FIYAT = new Set(['liste_fiyati_tl', 'mtv_yillik_tl']);

function closeOf(t, i) {
  let dp = 0;
  for (let p = i; p < t.length; p++) {
    const ch = t[p];
    if (ch === '"' || ch === "'" || ch === '`') { const q = ch; p++; while (p < t.length && t[p] !== q) { if (t[p] === '\\') p++; p++; } continue; }
    if (ch === '{' || ch === '[') dp++; else if (ch === '}' || ch === ']') { dp--; if (dp === 0) return p; }
  }
  throw new Error('kapanış yok');
}
// Kaydın metin aralığı: karşılaştırma {id:"x"...} ya da {"id":"x"...}; detay 'x':{...}
function aralik(t, id, tur) {
  if (tur === 'k') {
    for (const pat of [`{id:"${id}"`, `{"id":"${id}"`]) { const p = t.indexOf(pat); if (p >= 0) return [p, closeOf(t, p)]; }
    return null;
  }
  const s = t.indexOf('const CARS = {'), key = `'${id}':`, p = t.indexOf(key, s);
  if (p < 0) return null;
  const o = t.indexOf('{', p + key.length - 1);
  return [o, closeOf(t, o)];
}
// JS nesne yazımı: geçerli tanımlayıcı anahtarlar tırnaksız (diğer araçlar {id:"..."} kalıbını arar)
const lit = v => {
  if (Array.isArray(v)) return '[' + v.map(lit).join(',') + ']';
  if (v && typeof v === 'object') return '{' + Object.entries(v).filter(([, x]) => x !== undefined).map(([a, x]) => (/^[A-Za-z_$][\w$]*$/.test(a) ? a : JSON.stringify(a)) + ':' + lit(x)).join(',') + '}';
  return JSON.stringify(v);
};
const oku = (t, r) => new Function('return ' + t.slice(r[0], r[1] + 1))();
const yaz = (t, r, o) => t.slice(0, r[0]) + lit(o) + t.slice(r[1] + 1);
const urlOk = u => /^https:\/\/[^\s]+$/.test(u || '') && !YASAK.test(u);
const tarihOk = s => /^\d{4}-\d{2}-\d{2}$/.test(s || '');
function yolAl(o, yol) { const p = yol.split('.'); let x = o; for (const a of p.slice(0, -1)) { if (x == null) return [null]; x = x[/^\d+$/.test(a) ? Number(a) : a]; } return [x, /^\d+$/.test(p.at(-1)) ? Number(p.at(-1)) : p.at(-1)]; }

const hata = [], yapilan = [];
for (const [i, op] of ops.entries()) {
  const etiket = `Satır ${i + 1} (${op.id || '?'} ${op.islem || '?'})`;
  const rk = aralik(k, op.id, 'k'), rd = aralik(d, op.id, 'd');
  if (!rk) { hata.push(`${etiket}: karsilastirma.html'de yok`); continue; }
  const ck = oku(k, rk), cd = rd ? oku(d, rd) : null;
  const eski = !!ck.durum && ck.yil < 2026;
  try {
    if (op.islem === 'ana_kaynak') {
      if (!op.kaynakAd || YASAK.test(op.kaynakAd)) throw 'kaynakAd boş ya da yasaklı site adı içeriyor';
      if (!urlOk(op.kaynakUrl)) throw 'kaynakUrl https olmalı ve yasaklı site olamaz';
      if (!tarihOk(op.sonDogrulama)) throw 'sonDogrulama YYYY-AA-GG olmalı';
      const tur = op.kaynakTuru || 'birincil';
      if (!['birincil', 'ikincil', 'sahibinden'].includes(tur)) throw 'kaynakTuru geçersiz';
      if (/sahibinden/i.test(op.kaynakUrl) !== (tur === 'sahibinden')) throw 'sahibinden kaynağı için kaynakTuru "sahibinden" olmalı';
      if (tur === 'sahibinden' && !eski) throw 'sahibinden yalnızca satıştan kalkmış eski modellerde';
      for (const c of [ck, cd]) if (c) { c.kaynakAd = op.kaynakAd; c.kaynakUrl = op.kaynakUrl; if (tur !== 'birincil' || c.kaynakTuru) c.kaynakTuru = tur; c.kaynakTarih = op.sonDogrulama; }
    } else if (op.islem === 'alan_kaynak') {
      if (!ALANLAR.has(op.alan) && !FIYAT.has(op.alan)) throw 'bilinmeyen alan ' + op.alan;
      if (FIYAT.has(op.alan) && ck.yil !== 2026) throw 'fiyat yalnızca 2026 model yılında';
      if (!op.kaynakAd || YASAK.test(op.kaynakAd)) throw 'kaynakAd boş ya da yasaklı';
      if (!urlOk(op.kaynakUrl)) throw 'kaynakUrl https olmalı ve yasaklı site olamaz';
      if (!tarihOk(op.sonDogrulama)) throw 'sonDogrulama YYYY-AA-GG olmalı';
      for (const c of [ck, cd]) if (c) {
        if ('deger' in op) { if (op.deger === '' || op.deger == null) throw 'deger boş olamaz (silmek için alan_sil)'; c.s[op.alan] = op.deger; }
        c.ekKaynak = c.ekKaynak || {}; c.ekKaynak[op.alan] = { ad: op.kaynakAd, url: op.kaynakUrl, tarih: op.sonDogrulama };
      }
    } else if (op.islem === 'alan_sil') {
      if (!ALANLAR.has(op.alan) && !FIYAT.has(op.alan)) throw 'bilinmeyen alan ' + op.alan;
      for (const c of [ck, cd]) if (c) { delete c.s[op.alan]; if (c.ekKaynak) { delete c.ekKaynak[op.alan]; if (!Object.keys(c.ekKaynak).length) delete c.ekKaynak; } }
    } else if (op.islem === 'detay_sil' || op.islem === 'detay_deger') {
      if (!op.yol) throw 'yol yok';
      if (['durum', 'nesil', 'donem'].includes(op.yol)) {
        if (op.islem !== 'detay_deger' || !String(op.deger || '').trim() || YASAK.test(op.deger)) throw op.yol + ' için geçerli bir metin verin';
        for (const c of [ck, cd]) if (c) c[op.yol] = op.deger;
      } else {
        if (!cd) throw 'detay kaydı yok';
        if (/^(s|id|marka|model|yil|versiyon)(\.|$)/.test(op.yol)) throw 'bu yol bu işlemle değiştirilemez';
        const [ust, son] = yolAl(cd, op.yol);
        if (ust == null || !(son in ust)) throw 'yol bulunamadı: ' + op.yol;
        if (op.islem === 'detay_sil') { if (Array.isArray(ust)) ust.splice(son, 1); else ust[son] = null; }
        else { if (typeof op.deger === 'string' && YASAK.test(op.deger)) throw 'yeni değer yasaklı site içeriyor'; if (/kaynak$/i.test(String(son)) && !urlOk(op.deger)) throw 'kaynak https olmalı'; ust[son] = op.deger; }
      }
    } else throw 'bilinmeyen işlem';
  } catch (e) { hata.push(`${etiket}: ${e}`); continue; }
  k = yaz(k, rk, ck); if (cd) d = yaz(d, aralik(d, op.id, 'd'), cd);
  yapilan.push(`${op.id}: ${op.islem}${op.alan ? ' ' + op.alan : ''}${op.yol ? ' ' + op.yol : ''}`);
}
if (hata.length) { console.error('HATA, hiçbir şey yazılmadı:\n' + hata.join('\n')); process.exit(1); }
// sözdizimi kontrolü
for (const t of [k, d]) for (const m of t.matchAll(/<script>([\s\S]*?)<\/script>/g)) new Function(m[1]);
console.log(yapilan.join('\n'));
if (kuru) { console.log(`\n${yapilan.length} işlem (kuru çalıştırma, yazılmadı).`); process.exit(0); }
fs.writeFileSync(KF, k); fs.writeFileSync(DF, d);
execFileSync('node', [path.join(__dirname, 'puan_hesapla.js')], { stdio: 'inherit' });
const kalan = require('./yasak_kaynak.js').liste();
const dokunulan = new Set(ops.map(o => o.id));
const hala = kalan.filter(x => dokunulan.has(x.id));
console.log(`\n${yapilan.length} işlem uygulandı. Yasaklı kaynak kalan versiyon: ${kalan.length}.`);
if (hala.length) console.log('Dikkat, bu kayıtlarda hâlâ yasaklı kaynak var:\n' + hala.map(x => `  ${x.id}: ${x.yerler.join(', ')}`).join('\n'));
