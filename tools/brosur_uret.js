#!/usr/bin/env node
/* Broşürler sayfası için belge listesini üretir: assets/brosurler.js
   Kaynak: karsilastirma.html içindeki araçların kaynak olarak kullandığı PDF bağlantıları (marka broşürü, fiyat listesi,
   teknik föy, Euro NCAP raporu) ve tools/brosur_ek.json içindeki elle eklenen belgeler.
   Dosyalar barındırılmaz; ziyaretçi belgenin markanın kendi sitesindeki resmi kopyasına yönlendirilir. */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const k = fs.readFileSync(path.join(ROOT, 'karsilastirma.html'), 'utf8');
const s0 = k.indexOf('const CARS = ['), e0 = k.indexOf('\n];', s0) + 3;
const CARS = new Function(k.slice(s0, e0) + ';return CARS;')();
const YASAK = /sifiraracal|arabalar\.com\.tr|arabakarsilastirma|epey|mukayese|araclo|ekiyasla|otobul|arabam\.com|sahibinden|eskihisarotomotiv|drive\.gr/i; // rakip, ilan, bayi ve dergi siteleri
const AYLAR = {ocak: 1, şubat: 2, mart: 3, nisan: 4, mayıs: 5, haziran: 6, temmuz: 7, ağustos: 8, eylül: 9, ekim: 10, kasım: 11, aralık: 12};

const tur = (ad, url) => {
  const t = (ad + ' ' + url).toLocaleLowerCase('tr');
  if (/euroncap/.test(t)) return 'ncap';
  if (/bak[ıi]m kapsam/.test(t)) return 'bakim';
  if (/fiyat|price|pricelist/.test(t)) return 'fiyat';
  if (/teknik ?f[öo]y|technical ?sheet|technicalsheet|datasheet|spec(ification)?s?\b|teknik veri|teknik özellik/.test(t)) return 'teknik';
  if (/donan[ıi]m/.test(t)) return 'donanim';
  if (/bro[sş][uü]r|brochure|katalog|catalog/.test(t)) return 'brosur';
  return 'belge';
};
const tarih = (ad, url) => {
  let m = ad.match(/(\d{1,2})[.\/](\d{1,2})[.\/](20\d\d)/);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  m = url.match(/(?:^|[^\d])(\d{2})(\d{2})(20\d\d)(?:[^\d]|$)/);
  if (m && +m[2] >= 1 && +m[2] <= 12 && +m[1] >= 1 && +m[1] <= 31) return `${m[3]}-${m[2]}-${m[1]}`;
  m = (ad + ' ').toLocaleLowerCase('tr').match(/(ocak|şubat|mart|nisan|mayıs|haziran|temmuz|ağustos|eylül|ekim|kasım|aralık) (20\d\d)/);
  if (m) return `${m[2]}-${String(AYLAR[m[1]]).padStart(2, '0')}`;
  return null;
};
const temizAd = ad => ad.replace(/\s*\+\s*auto-data\.net.*$/i, '').replace(/\s*\(PDF\)\s*/i, ' ').replace(/\s+/g, ' ').trim();

const belgeler = new Map();
const ekle = (url, ad, c) => {
  if (!/^https?:\/\//.test(url) || YASAK.test(url)) return;
  const anahtar = url.split('#')[0];
  let b = belgeler.get(anahtar);
  if (!b) { b = {url: anahtar, ad: temizAd(ad || ''), tur: tur(ad || '', url), tarih: tarih(ad || '', url), alan: new URL(url).hostname.replace(/^www\./, ''), tr: /\.tr$/.test(new URL(url).hostname) || /\/tr\//.test(new URL(url).pathname), araclar: new Map()}; belgeler.set(anahtar, b); }
  if (!b.ad && ad) b.ad = temizAd(ad);
  const km = c.marka + '|' + c.model;
  const v = b.araclar.get(km) || {marka: c.marka, model: c.model, yillar: new Set(), id: c.id, satista: false};
  v.yillar.add(c.yil); if (!c.durum) { v.satista = true; v.id = c.id; }
  b.araclar.set(km, v);
};
const gez = (o, c, ad) => {
  if (!o || typeof o !== 'object') return;
  for (const [key, v] of Object.entries(o)) {
    if (typeof v === 'string' && /\.pdf(\?|#|$)/i.test(v)) ekle(v, o.ad || o.kaynakAd || ad, c);
    else if (v && typeof v === 'object') gez(v, c, o.ad || ad);
  }
};
CARS.forEach(c => { if (c.kaynakUrl && /\.pdf(\?|#|$)/i.test(c.kaynakUrl)) ekle(c.kaynakUrl, c.kaynakAd, c); gez(c.ekKaynak, c, ''); gez(c.alanKaynak, c, ''); });

// Elle eklenen belgeler (kullanıcının bulduğu PDF'ler): [{marka, model, ad, url, tur?, tarih?}]
const ekDosya = path.join(__dirname, 'brosur_ek.json');
if (fs.existsSync(ekDosya)) JSON.parse(fs.readFileSync(ekDosya, 'utf8')).forEach(e => {
  const c = CARS.find(x => x.marka === e.marka && x.model === e.model && !x.durum) || CARS.find(x => x.marka === e.marka && x.model === e.model) || {marka: e.marka, model: e.model, yil: 2026, id: null};
  ekle(e.url, e.ad, c); const b = belgeler.get(e.url.split('#')[0]); if (b) { if (e.tur) b.tur = e.tur; if (e.tarih) b.tarih = e.tarih; }
});

const liste = [...belgeler.values()].map(b => ({
  url: b.url, ad: b.ad, tur: b.tur, tarih: b.tarih, alan: b.alan, tr: b.tr,
  araclar: [...b.araclar.values()].map(v => ({marka: v.marka, model: v.model, yillar: [...v.yillar].sort((a, x) => x - a), id: v.id, satista: v.satista}))
})).sort((a, b) => a.araclar[0].marka.localeCompare(b.araclar[0].marka, 'tr') || a.araclar[0].model.localeCompare(b.araclar[0].model, 'tr') || String(b.tarih || '').localeCompare(String(a.tarih || '')));
fs.writeFileSync(path.join(ROOT, 'assets', 'brosurler.js'), `/* tools/brosur_uret.js tarafından üretilir, elle düzenlemeyin. Elle belge eklemek için tools/brosur_ek.json. Üretim: ${new Date().toISOString().slice(0, 10)} */\nwindow.BROSURLER=${JSON.stringify(liste)};\n`);
const say = {}; liste.forEach(b => say[b.tur] = (say[b.tur] || 0) + 1);
console.log(liste.length, 'belge', JSON.stringify(say), new Set(liste.flatMap(b => b.araclar.map(a => a.marka))).size, 'marka');
