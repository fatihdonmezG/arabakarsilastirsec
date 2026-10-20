#!/usr/bin/env node
/*
 * Karşılaştırma veritabanına (karsilastirma.html → CARS) satıştan kalkmış, 2010–2025 model yılı araç versiyonları ekler.
 * Kullanım:  node tools/arac_ekle.js yeni_araclar.json
 *
 * Girdi: JSON dizi. Her eleman:
 * { "id": "marka-model-yil-versiyon" (küçük harf, rakam, nokta, tire; benzersiz),
 *   "marka": "Renault", "model": "Clio", "yil": 2017,            // yil: kaynağın ait olduğu model yılı (2010–2025)
 *   "versiyon": "1.5 dCi 90 HP Touch",
 *   "donem": "2012–2019",                                         // bu neslin Türkiye'de satıldığı yıllar (biliniyorsa)
 *   "nesil": "Clio IV",                                           // isteğe bağlı
 *   "durum": "Türkiye'de satıştan kalktı; yerini Clio V aldı (2019).",   // zorunlu
 *   "kaynakAd": "renault.com.tr 2017 fiyat ve teknik listesi", "kaynakUrl": "https://...",
 *   "kaynakTuru": "birincil" | "ikincil" | "sahibinden",
 *   "s": { teknik alanlar; alan adları tools/teknik_yama.js'teki ALANLAR listesiyle aynı },
 *   "ekKaynak": { "alan": {"ad":"...","url":"https://...","tarih":"YYYY-MM-DD"} }   // isteğe bağlı, alan bazında ek kaynak
 * }
 * Aynı teknik değerlerle birden çok model yılında satılan versiyon için "yil" yerine "yillar": [2013,2014,2015,2016] yazılabilir;
 * her yıl için ayrı kayıt oluşur (id: "renault-clio-{yil}-1.5-dci-90" → renault-clio-2013-1.5-dci-90 ...). Yalnızca kaynak o motorun
 * o yıllarda Türkiye'de satıldığını gösteriyorsa kullanın.
 * Kurallar: fiyat alanı (liste_fiyati_tl, mtv_yillik_tl) yazılamaz; rakip karşılaştırma ve ilan siteleri kaynak olamaz
 * (sahibinden yalnızca kaynakTuru "sahibinden" ile ve yalnızca teknik veri için); kasa, yakit, guc_hp zorunlu.
 * Hata varsa hiçbir şey yazılmaz. Başarılı olursa sayıları ve sistem puanlarını günceller.
 * Ardından aynı id'ler için `node tools/detay_ekle.js` ile detay kaydı eklenmelidir.
 */
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const KF = path.join(ROOT, 'karsilastirma.html'), IF = path.join(ROOT, 'index.html');
let k = fs.readFileSync(KF, 'utf8');
const s0 = k.indexOf('const CARS = ['), e0 = k.indexOf('\n];', s0);
const CARS = new Function(k.slice(s0, e0 + 3) + ';return CARS;')();
const IDS = new Set(CARS.map(c => c.id));

const ty = fs.readFileSync(path.join(__dirname, 'teknik_yama.js'), 'utf8');
const ALANLAR = new Function('return ' + ty.match(/const ALANLAR = (new Set\(\[[\s\S]*?\]\))/)[1])();
const FIYAT = new Set(['liste_fiyati_tl', 'mtv_yillik_tl']);
const YASAK = /(sifiraracal|arabalar\.com\.tr|epey\.com|araclo|ekiyasla|otobul|arabakarsilastirma\.com\.tr|mukayese\.com|arabam\.com|letgo|otoplus|vavacars)/i;

const raw = process.argv[2] ? JSON.parse(fs.readFileSync(process.argv[2], 'utf8')) : null;
if (!raw || !Array.isArray(raw)) { console.error('Kullanım: node tools/arac_ekle.js yeni_araclar.json'); process.exit(1); }
// "yillar": [2016, 2017, 2018] verilirse kayıt her model yılı için ayrı versiyon olarak çoğaltılır.
// id içinde {yil} varsa yıl oraya yazılır, yoksa id'nin sonuna "-<yıl>" eklenir.
const input = raw.flatMap(a => Array.isArray(a.yillar) ? a.yillar.map(y => {
  const { yillar, ...rest } = a;
  return { ...rest, yil: y, id: a.id.includes('{yil}') ? a.id.replace('{yil}', y) : `${a.id}-${y}` };
}) : [a]);

const err = [], seen = new Set();
const url = u => /^https:\/\/[^\s]+$/.test(u || '');
for (const a of input) {
  const t = a.id || '(id yok)';
  if (!/^[a-z0-9][a-z0-9.\-]*$/.test(a.id || '')) err.push(`${t}: id biçimi geçersiz`);
  if (IDS.has(a.id) || seen.has(a.id)) err.push(`${t}: bu id zaten var`);
  seen.add(a.id);
  for (const f of ['marka', 'model', 'versiyon', 'durum', 'kaynakAd']) if (!String(a[f] || '').trim()) err.push(`${t}: ${f} boş`);
  if (!Number.isInteger(a.yil) || a.yil < 2010 || a.yil > 2025) err.push(`${t}: yil 2010–2025 arası tam sayı olmalı`);
  if (!url(a.kaynakUrl)) err.push(`${t}: kaynakUrl https adresi olmalı`);
  if (YASAK.test(a.kaynakAd || '')) err.push(`${t}: kaynakAd yasaklı site adı içeriyor`);
  const tur = a.kaynakTuru || 'ikincil';
  if (!['birincil', 'ikincil', 'sahibinden'].includes(tur)) err.push(`${t}: kaynakTuru geçersiz`);
  const allUrls = [a.kaynakUrl, ...Object.values(a.ekKaynak || {}).map(x => x && x.url)];
  for (const u of allUrls) {
    if (!u) continue;
    if (YASAK.test(u)) err.push(`${t}: yasak kaynak ${u}`);
    if (/sahibinden\.com/i.test(u) && tur !== 'sahibinden') err.push(`${t}: sahibinden kaynağı için kaynakTuru "sahibinden" olmalı`);
  }
  if (!a.s || typeof a.s !== 'object') { err.push(`${t}: s (teknik alanlar) yok`); continue; }
  for (const [f, v] of Object.entries(a.s)) {
    if (FIYAT.has(f)) err.push(`${t}: satıştan kalkmış araçta fiyat alanı yazılamaz (${f})`);
    else if (!ALANLAR.has(f)) err.push(`${t}: bilinmeyen alan ${f}`);
    if (v === '' ) err.push(`${t}: ${f} boş metin`);
  }
  for (const f of ['kasa', 'yakit', 'guc_hp']) if (a.s[f] == null) err.push(`${t}: ${f} zorunlu`);
  for (const [f, x] of Object.entries(a.ekKaynak || {})) {
    if (!ALANLAR.has(f)) err.push(`${t}: ekKaynak bilinmeyen alan ${f}`);
    if (!x || !url(x.url) || !x.ad) err.push(`${t}: ekKaynak.${f} ad ve https url içermeli`);
  }
}
if (err.length) { console.error('HATA, hiçbir şey yazılmadı:\n' + err.join('\n')); process.exit(1); }

const lit = a => {
  const o = { id: a.id, marka: a.marka, model: a.model, yil: a.yil, versiyon: a.versiyon, kaynakAd: a.kaynakAd, kaynakUrl: a.kaynakUrl, durum: a.durum };
  if (a.donem) o.donem = a.donem;
  if (a.nesil) o.nesil = a.nesil;
  if (a.kaynakTuru) o.kaynakTuru = a.kaynakTuru;
  o.s = Object.fromEntries(Object.entries(a.s).filter(([, v]) => v != null));
  if (a.ekKaynak && Object.keys(a.ekKaynak).length) o.ekKaynak = a.ekKaynak;
  return ' ' + JSON.stringify(o) + ',';
};
const before = k.slice(0, e0).replace(/,?\s*$/, ',');
k = before + '\n' + input.map(lit).join('\n').replace(/,$/, '') + k.slice(e0);
// geçerlilik kontrolü
const NEW = new Function(k.slice(k.indexOf('const CARS = ['), k.indexOf('\n];', k.indexOf('const CARS = [')) + 3) + ';return CARS;')();
if (NEW.length !== CARS.length + input.length) { console.error('HATA: ekleme sonrası sayı tutmuyor, yazılmadı'); process.exit(1); }
fs.writeFileSync(KF, k);

// ana sayfadaki sayılar
const nM = new Set(NEW.map(c => c.marka)).size, nV = NEW.length;
let ix = fs.readFileSync(IF, 'utf8');
ix = ix.replace(/<b>\d+<\/b><span>marka, \d+ versiyon veritabanında<\/span>/, `<b>${nM}</b><span>marka, ${nV} versiyon veritabanında</span>`)
       .replace(/<strong>Kapsam:<\/strong> \d+ marka, \d+ versiyon\./, `<strong>Kapsam:</strong> ${nM} marka, ${nV} versiyon.`);
fs.writeFileSync(IF, ix);
execSync('node ' + path.join(__dirname, 'puan_hesapla.js'), { stdio: 'inherit' });
console.log(`Eklendi: ${input.length} versiyon. Veritabanı: ${nM} marka, ${nV} versiyon. Şimdi bu id'ler için detay kaydı ekleyin (tools/detay_ekle.js).`);
