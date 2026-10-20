#!/usr/bin/env node
/*
 * arac-detay.html'e yeni araç detay kayıtları ekler.
 * Kullanım:  node tools/detay_ekle.js yeni_kayitlar.json   (dosya verilmezse sadece sayıları günceller)
 *
 * Girdi: JSON dizi. Her eleman:
 * { "id": "karsilastirma.html'deki id (aynen)",
 *   "ncap_yildiz": 5 | null, "ncap_test_yili": 2023 | null,      // sadece bu versiyon/nesil için teyitliyse
 *   "ncapNot": "...", "ncapKaynak": "https://..." | null,
 *   "geriCagirmaNot": "...",
 *   "recalls": null | [ {"tarih":"YYYY-MM","parca":"...","baslik":"...","ozet":"...","cozum":"...","kaynak":"https://..."} ],
 *   "kucukDetaylar": [{"ozellik":"...","deger":"...","kaynak":"https://..."}],
 *   "gucluYanlar": [{"metin":"...","kaynak":"https://..."}],
 *   "dikkatEdilecekler": [{"metin":"...","kaynak":"https://..."}],
 *   "odul": [{"ad":"...","yil":2024,"kaynak":"https://..."}] }
 * marka/model/yil/versiyon/kaynak/durum ve teknik özellikler (s) karsilastirma.html'den otomatik kopyalanır.
 */
const fs = require('fs'), path = require('path');
const { YASAK } = require('./yasak_kaynak.js');
const ROOT = path.join(__dirname, '..');
const DF = path.join(ROOT, 'arac-detay.html'), KF = path.join(ROOT, 'karsilastirma.html');
let h = fs.readFileSync(DF, 'utf8');
const k = fs.readFileSync(KF, 'utf8');
const ks = k.indexOf('const CARS = ['), ke = k.indexOf('\n];', ks) + 3;
const KCARS = new Function(k.slice(ks, ke) + ';return CARS;')();
const KMAP = Object.fromEntries(KCARS.map(c => [c.id, c]));

function matchClose(i) {
  let d = 0;
  for (let p = i; p < h.length; p++) {
    const ch = h[p];
    if (ch === '/' && h[p + 1] === '*') { p = h.indexOf('*/', p + 2) + 1; continue; }
    if (ch === '/' && h[p + 1] === '/') { p = h.indexOf('\n', p); continue; }
    if (ch === '"' || ch === "'" || ch === '`') { const q = ch; p++; while (p < h.length && h[p] !== q) { if (h[p] === '\\') p++; p++; } continue; }
    if (ch === '{' || ch === '[') d++;
    else if (ch === '}' || ch === ']') { d--; if (d === 0) return p; }
  }
  throw new Error('eşleşme bulunamadı');
}
function block(name) { let s = h.indexOf('const ' + name + ' = {'); if (s < 0) s = h.indexOf('const ' + name + ' ={'); const open = h.indexOf('{', s); return { open, end: matchClose(open) }; }
function obj(name) { const b = block(name); return new Function('return ' + h.slice(b.open, b.end + 1))(); }
function append(name, text) { const b = block(name); let p = b.end - 1; while (/\s/.test(h[p])) p--; const comma = h[p] === ',' ? '' : ','; h = h.slice(0, p + 1) + comma + '\n' + text + '\n' + h.slice(b.end); }

const CARS = obj('CARS');
// "ids": [...] verilirse aynı detay bilgisi (NCAP, geri çağırma, artı-eksi) bu id'lerin hepsine yazılır.
const input = (process.argv[2] ? JSON.parse(fs.readFileSync(process.argv[2], 'utf8')) : []).flatMap(e => Array.isArray(e.ids) ? e.ids.map(id => { const { ids, ...r } = e; return { ...r, id }; }) : [e]);
const errors = [];
const urlOk = u => typeof u === 'string' && /^https?:\/\//.test(u);
for (const e of input) {
  const kc = KMAP[e.id];
  if (!kc) { errors.push(`${e.id}: karsilastirma.html'de yok`); continue; }
  if (CARS[e.id]) { errors.push(`${e.id}: arac-detay.html'de zaten var`); continue; }
  if (YASAK.test(JSON.stringify(e))) errors.push(`${e.id}: yasaklı kaynak (rakip karşılaştırma ya da ilan sitesi) kullanılamaz`);
  for (const r of (e.recalls || [])) {
    if (!/^\d{4}-\d{2}$/.test(r.tarih || '')) errors.push(`${e.id}: geri çağırma tarihi YYYY-AA olmalı (${r.tarih})`);
    if (!urlOk(r.kaynak)) errors.push(`${e.id}: geri çağırma kaynağı URL değil`);
  }
  for (const key of ['kucukDetaylar', 'gucluYanlar', 'dikkatEdilecekler', 'odul'])
    for (const it of (e[key] || [])) if (!urlOk(it.kaynak)) errors.push(`${e.id}: ${key} öğesinde kaynak URL yok`);
}
if (errors.length) { console.error('HATA:\n' + errors.join('\n')); process.exit(1); }

for (const e of input) {
  const kc = KMAP[e.id];
  const s = { ...kc.s };
  if (e.ncap_yildiz != null) s.ncap_yildiz = e.ncap_yildiz;
  if (e.ncap_test_yili != null) s.ncap_test_yili = e.ncap_test_yili;
  const car = { id: e.id, marka: kc.marka, model: kc.model, yil: kc.yil, versiyon: kc.versiyon, kaynakAd: kc.kaynakAd, kaynakUrl: kc.kaynakUrl };
  if (kc.durum) car.durum = kc.durum;
  if (kc.ekKaynak) car.ekKaynak = kc.ekKaynak;
  if (kc.donem) car.donem = kc.donem;
  if (kc.nesil) car.nesil = kc.nesil;
  Object.assign(car, { fotoUrl: null, sanalTurUrl: null, s,
    ncapNot: e.ncapNot || null, ncapKaynak: e.ncapKaynak || null, geriCagirmaNot: e.geriCagirmaNot || null,
    agirBakim: [], kucukDetaylar: e.kucukDetaylar || [], gucluYanlar: e.gucluYanlar || [], dikkatEdilecekler: e.dikkatEdilecekler || [],
    odul: e.odul || [], sistemPuani: null });
  append('CARS', `'${e.id}':` + JSON.stringify(car));
  append('RECALLS', `'${e.id}':` + JSON.stringify(e.recalls === undefined ? null : e.recalls));
  append('OFFICIAL', `'${e.id}':null`);
  append('REVIEWS', `'${e.id}':[]`);
}
const n = Object.keys(obj('CARS')).length;
h = h.replace(/(Teknik özellikler ve fiyatlar )\d+( versiyonun)/, `$1${n}$2`).replace(/(veritabanındaki )\d+( versiyondan)/, `$1${n}$2`);
fs.writeFileSync(DF, h);
for (const nm of ['RECALLS', 'OFFICIAL', 'REVIEWS']) { const c = Object.keys(obj(nm)).length; if (c !== n) { console.error(`UYARI: ${nm} kayıt sayısı ${c}, CARS ${n}`); process.exit(1); } }
const missing = KCARS.filter(c => !obj('CARS')[c.id]).map(c => c.id);
// Euro NCAP sonucunu karşılaştırma verisine ve aynı neslin diğer versiyonlarına yay (puanları da yeniden hesaplar)
require('child_process').execFileSync('node',[path.join(__dirname,'ncap_yay.js')],{stdio:'inherit'});
console.log(`Eklendi: ${input.length}. arac-detay toplam: ${n}. Detayı eksik versiyon: ${missing.length}`);
