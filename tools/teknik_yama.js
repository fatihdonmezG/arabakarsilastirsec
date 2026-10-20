#!/usr/bin/env node
/*
 * Eksik teknik alanları doldurur (hem karsilastirma.html hem arac-detay.html).
 * Kullanım:  node tools/teknik_yama.js yama.jsonl
 * Her satır: {"id":"...","alan":"agirlik_kg","deger":1425,"kaynakAd":"...","kaynakUrl":"https://...","kaynakTuru":"birincil|ikincil|sahibinden","sonDogrulama":"YYYY-AA-GG"}
 * Kurallar: dolu bir alanın üzerine YAZMAZ; bilinmeyen alan adı, boş değer, URL'siz kaynak, sahibinden kaynağının güncel (satıştaki) araçta
 * kullanılması ya da fiyat alanı reddedilir. Hata varsa hiçbir dosyaya yazmaz.
 */
const fs = require('fs'), path = require('path');
const { YASAK } = require('./yasak_kaynak.js');
const ROOT = path.join(__dirname, '..');
const KF = path.join(ROOT, 'karsilastirma.html'), DF = path.join(ROOT, 'arac-detay.html');
let k = fs.readFileSync(KF, 'utf8'), d = fs.readFileSync(DF, 'utf8');
const ALANLAR = new Set(['segment','kasa','yakit','sanziman','cekis','koltuk','kapi','cc','silindir','besleme','guc_hp','tork_nm','sifirYuz_sn','hiz_kmh',
 'tuketim_sehir_ici','tuketim_sehir_disi','tuketim_l100km','co2_gkm','emisyon_normu','depo_l','batarya_kwh','batarya_tipi','menzil_km_wltp','ac_sarj_dk',
 'dc_hizli_sarj_dk_20_80','elektrik_tuketim_kwh100km','uzunluk_mm','genislik_mm','yukseklik_mm','dingil_mm','yerden_yukseklik_mm','agirlik_kg','istiap_kg',
 'bagaj_l','jant_inch','airbag_sayisi','ncap_yildiz','ncap_test_yili','abs','esp','yokus_kalkis','adaptif_hiz_sabitleyici','serit_takip','yorgunluk_tespit',
 'geri_gorus_kamera','otonom_acil_fren','arka_klima_cikisi','kor_nokta','park_sensoru','kamera_360','elektrikli_koltuk','deri_doseme','elektrikli_bagaj','led_far','kablosuz_sarj','navigasyon','klima','koltuk_isitma','acilir_tavan','anahtarsiz_giris','start_stop','ekran_inch','carplay_android_auto','ses_sistemi','dijital_gosterge',
 'garanti_yil','garanti_km','batarya_garanti_yil','boya_garanti_yil','pas_garanti_yil','bakim_araligi_km','bakim_araligi_ay']);

function closeOf(t, i) {
  let dpt = 0;
  for (let p = i; p < t.length; p++) {
    const ch = t[p];
    if (ch === '/' && t[p + 1] === '*') { p = t.indexOf('*/', p + 2) + 1; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { const q = ch; p++; while (p < t.length && t[p] !== q) { if (t[p] === '\\') p++; p++; } continue; }
    if (ch === '{' || ch === '[') dpt++; else if (ch === '}' || ch === ']') { dpt--; if (dpt === 0) return p; }
  }
  throw new Error('kapanış yok');
}
// Bir kaydın içinde s ve ekKaynak nesnelerini bul; kayıt metni [start,end]
function entryRange(t, id, style) {
  const key = style === 'k' ? `{id:"${id}"` : `'${id}':`;
  const p = t.indexOf(key); if (p < 0) return null;
  const open = style === 'k' ? p : t.indexOf('{', p + key.length - 1);
  return [open, closeOf(t, open)];
}
function getObj(t, name) { // CARS nesnesini değerlendir
  if (name === 'k') { const s = t.indexOf('const CARS = ['), e = t.indexOf('\n];', s) + 3; return new Function(t.slice(s, e) + ';return CARS;')(); }
  const s = t.indexOf('const CARS = {'), o = t.indexOf('{', s); return new Function('return ' + t.slice(o, closeOf(t, o) + 1))();
}
const lines = fs.readFileSync(process.argv[2], 'utf8').split('\n').map(x => x.trim()).filter(Boolean).map(x => JSON.parse(x));
const KC = Object.fromEntries(getObj(k, 'k').map(c => [c.id, c])), DC = getObj(d, 'd');
const errors = [], todo = [];
for (const r of lines) {
  const c = KC[r.id];
  if (!c) { errors.push(`${r.id}: karşılaştırmada yok`); continue; }
  if (!ALANLAR.has(r.alan)) { errors.push(`${r.id}: bilinmeyen/izin verilmeyen alan ${r.alan}`); continue; }
  if (r.deger === null || r.deger === '' || r.deger === undefined) { errors.push(`${r.id}.${r.alan}: boş değer`); continue; }
  if (!/^https?:\/\//.test(r.kaynakUrl || '')) { errors.push(`${r.id}.${r.alan}: kaynak URL yok`); continue; }
  if (YASAK.test(r.kaynakUrl + ' ' + (r.kaynakAd || ''))) { errors.push(`${r.id}.${r.alan}: yasaklı kaynak (rakip karşılaştırma ya da ilan sitesi): ${r.kaynakUrl}`); continue; }
  if (/sahibinden/i.test(r.kaynakUrl + ' ' + r.kaynakTuru) && !(c.durum && !c.s.liste_fiyati_tl)) { errors.push(`${r.id}.${r.alan}: sahibinden yalnızca satıştan kalkmış eski modellerde kullanılabilir`); continue; }
  // Klimada yalnızca "Var" yazıyorsa tipi (manuel / dijital / bölge sayısı) ile güncellenebilir.
  const klimaIyilestir = r.alan === 'klima' && /^\s*Var\s*$/i.test(String(c.s.klima || '')) && !/^\s*Var\s*$/i.test(String(r.deger));
  if (c.s[r.alan] != null && !klimaIyilestir) { console.log(`atlandı (zaten dolu): ${r.id}.${r.alan}`); continue; }
  todo.push(r);
}
if (errors.length) { console.error('HATA, hiçbir şey yazılmadı:\n' + errors.join('\n')); process.exit(1); }

function lit(v) { return typeof v === 'number' ? String(v) : JSON.stringify(String(v)); }
function patch(t, id, style, rows) {
  const rg = entryRange(t, id, style); if (!rg) return t;
  let body = t.slice(rg[0], rg[1] + 1);
  const sKey = body.match(/(["']?)s\1:\{/); if (!sKey) throw new Error(id + ': s bulunamadı');
  const sOpen = body.indexOf('{', sKey.index); const sClose = (() => { const tt = t; return closeOf(body, sOpen); })();
  const quoted = sKey[1] === '"';
  const add = rows.map(r => `${quoted ? JSON.stringify(r.alan) : r.alan}:${lit(r.deger)}`).join(',');
  const empty = body.slice(sOpen + 1, sClose).trim() === '';
  body = body.slice(0, sClose) + (empty ? '' : ',') + add + body.slice(sClose);
  // ekKaynak
  const ekRe = /(["']?)ekKaynak\1:\{/; const m = body.match(ekRe);
  const ekAdd = rows.map(r => `${quoted ? JSON.stringify(r.alan) : r.alan}:${JSON.stringify({ ad: r.kaynakAd + (r.kaynakTuru === 'sahibinden' ? ' (satıcı beyanı)' : ''), url: r.kaynakUrl, tarih: r.sonDogrulama || null })}`).join(',');
  if (m) { const eo = body.indexOf('{', m.index), ec = closeOf(body, eo); const emp = body.slice(eo + 1, ec).trim() === ''; body = body.slice(0, ec) + (emp ? '' : ',') + ekAdd + body.slice(ec); }
  else { const sEnd = closeOf(body, body.indexOf('{', body.match(/(["']?)s\1:\{/).index)); body = body.slice(0, sEnd + 1) + `,${quoted ? '"ekKaynak"' : 'ekKaynak'}:{${ekAdd}}` + body.slice(sEnd + 1); }
  return t.slice(0, rg[0]) + body + t.slice(rg[1] + 1);
}
const byId = {}; todo.forEach(r => (byId[r.id] ??= []).push(r));
for (const [id, rows] of Object.entries(byId)) { k = patch(k, id, 'k', rows); if (DC[id]) d = patch(d, id, 'd', rows); }
// doğrula
const K2 = Object.fromEntries(getObj(k, 'k').map(c => [c.id, c])), D2 = getObj(d, 'd');
for (const r of todo) { if (K2[r.id].s[r.alan] !== r.deger) { console.error('doğrulama hatası ' + r.id + '.' + r.alan); process.exit(1); } if (D2[r.id] && D2[r.id].s[r.alan] !== r.deger) { console.error('detay doğrulama hatası ' + r.id); process.exit(1); } }
fs.writeFileSync(KF, k); fs.writeFileSync(DF, d);
require('child_process').execFileSync('node',[path.join(__dirname,'puan_hesapla.js')],{stdio:'inherit'});
console.log(`Uygulandı: ${todo.length} alan, ${Object.keys(byId).length} versiyon.`);
