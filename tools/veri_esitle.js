#!/usr/bin/env node
/*
 * Tek kayıt ilkesi: teknik ve donanım değerleri (s) ile alan kaynakları (ekKaynak) karşılaştırma ve detay
 * sayfalarında aynı olmalı. Bu araç iki dosyadaki kayıtları birleştirir ve ikisine de aynı s/ekKaynak'ı yazar.
 *  - İki tarafta da dolu ve farklıysa karsilastirma.html (ana kayıt) kazanır, fark raporlanır.
 *  - Yalnızca bir tarafta dolu olan değer diğerine kopyalanır.
 * Kullanım: node tools/veri_esitle.js [--kuru]   (puan_hesapla.js her çalışmada bunu önce çağırır)
 */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), KF = path.join(ROOT, 'karsilastirma.html'), DF = path.join(ROOT, 'arac-detay.html');
function closeOf(t, i) { let d = 0; for (let p = i; p < t.length; p++) { const ch = t[p]; if (ch === '"' || ch === "'" || ch === '`') { const q = ch; p++; while (p < t.length && t[p] !== q) { if (t[p] === '\\') p++; p++; } continue; } if (ch === '{' || ch === '[') d++; else if (ch === '}' || ch === ']') { d--; if (d === 0) return p; } } return -1; }
function entryRange(t, id, style) {
  let key = style === 'k' ? `{id:"${id}"` : `'${id}':`, p = t.indexOf(key);
  if (p < 0 && style === 'k') { key = `{"id":"${id}"`; p = t.indexOf(key); }
  if (p < 0 && style === 'k') { key = `{id:'${id}'`; p = t.indexOf(key); }
  if (p < 0) return null;
  const open = style === 'k' ? p : t.indexOf('{', p + key.length - 1);
  return [open, closeOf(t, open)];
}
let k = fs.readFileSync(KF, 'utf8'), d = fs.readFileSync(DF, 'utf8');
const ks = k.indexOf('const CARS = ['), K = new Function(k.slice(ks, k.indexOf('\n];', ks) + 3) + ';return CARS;')();
const ds = d.indexOf('const CARS = {'), dobj = d.indexOf('{', ds), D = new Function('return ' + d.slice(dobj, closeOf(d, dobj) + 1))();
const bos = v => v == null || v === '';
function blokYaz(t, id, style, ad, obj) {
  const rg = entryRange(t, id, style); if (!rg) return t;
  let body = t.slice(rg[0], rg[1] + 1);
  const re = new RegExp(`(?<![\\w$])(["']?)${ad}\\1:\\{`), m = body.match(re);
  const yeni = JSON.stringify(obj);
  if (m) { const o = body.indexOf('{', m.index), c = closeOf(body, o); body = body.slice(0, o) + yeni + body.slice(c + 1); }
  else { const sm = body.match(/(?<![\w$])(["']?)s\1:\{/); const so = body.indexOf('{', sm.index), sc = closeOf(body, so); body = body.slice(0, sc + 1) + `,${sm[1] ? '"' + ad + '"' : ad}:${yeni}` + body.slice(sc + 1); }
  return t.slice(0, rg[0]) + body + t.slice(rg[1] + 1);
}
const kuru = process.argv.includes('--kuru');
let degisen = 0, cakisma = [];
for (const c of K) {
  const x = D[c.id]; if (!x) continue;
  const ks_ = c.s || {}, ds_ = x.s || {}, ke = c.ekKaynak || {}, de = x.ekKaynak || {};
  const s = { ...ks_ }, e = { ...ke };
  let fark = false;
  for (const a of Object.keys(ds_)) {
    if (bos(ks_[a]) && !bos(ds_[a])) { s[a] = ds_[a]; if (de[a]) e[a] = de[a]; fark = true; }
    else if (!bos(ks_[a]) && !bos(ds_[a]) && JSON.stringify(ks_[a]) !== JSON.stringify(ds_[a])) {
      // Euro NCAP sonucu detay kaydındaki ncapKaynak (euroncap.com) ile girilir; orada detay esas alınır
      if (/^ncap_/.test(a) && x.ncapKaynak) { s[a] = ds_[a]; cakisma.push(`${c.id}.${a}: detay (Euro NCAP kaynağı) esas alındı ${JSON.stringify(ds_[a])}, karşılaştırmadaki ${JSON.stringify(ks_[a])} değişti`); }
      else cakisma.push(`${c.id}.${a}: karşılaştırma ${JSON.stringify(ks_[a])} esas alındı, detaydaki ${JSON.stringify(ds_[a])} değişti`);
      fark = true; }
    else if (!bos(ks_[a]) && bos(ds_[a])) fark = true;
  }
  for (const a of Object.keys(ks_)) if (!bos(ks_[a]) && bos(ds_[a])) fark = true;
  for (const a of Object.keys(de)) if (!e[a] && !bos(s[a])) { e[a] = de[a]; fark = true; }
  for (const a of Object.keys(e)) if (JSON.stringify(e[a]) !== JSON.stringify(de[a])) fark = true;
  if (!fark) continue;
  degisen++;
  if (kuru) continue;
  k = blokYaz(k, c.id, 'k', 's', s); d = blokYaz(d, c.id, 'd', 's', s);
  if (Object.keys(e).length) { k = blokYaz(k, c.id, 'k', 'ekKaynak', e); d = blokYaz(d, c.id, 'd', 'ekKaynak', e); }
}
if (!kuru && degisen) {
  // doğrula
  const K2 = new Function(k.slice(k.indexOf('const CARS = ['), k.indexOf('\n];', k.indexOf('const CARS = [')) + 3) + ';return CARS;')();
  const o2 = d.indexOf('{', d.indexOf('const CARS = {')), D2 = new Function('return ' + d.slice(o2, closeOf(d, o2) + 1))();
  const esit = (x, y) => { x = x || {}; y = y || {}; const ks = new Set([...Object.keys(x), ...Object.keys(y)]); for (const a of ks) if (!(bos(x[a]) && bos(y[a])) && JSON.stringify(x[a]) !== JSON.stringify(y[a])) return false; return true; };
  for (const c of K2) if (D2[c.id] && !esit(c.s, D2[c.id].s)) { console.error('eşitleme doğrulanamadı: ' + c.id); process.exit(1); }
  fs.writeFileSync(KF, k); fs.writeFileSync(DF, d);
}
console.log(`Veri eşitleme: ${degisen} versiyon ${kuru ? 'eşitlenecek' : 'eşitlendi'}; ${cakisma.length} çakışma (ayrıntı: --ayrinti).`);
if (process.argv.includes('--ayrinti')) cakisma.forEach(x => console.log('  ' + x));
