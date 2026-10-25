#!/usr/bin/env node
/*
 * Mevcut detay kayıtlarına geri çağırma (recall) yazar ve araştırılmamış olanları listeler.
 *
 * Liste:  node tools/geri_cagirma_yaz.js --liste [--satista|--eski] [--marka X]
 *         Geri çağırması araştırılmamış (RECALLS değeri null) versiyonları marka | model | nesil grubunda gösterir.
 *         Aynı nesil aynı kampanyaları paylaşır: grup başına bir araştırma yeter.
 * Yazma:  node tools/geri_cagirma_yaz.js kampanyalar.json [--kuru]
 *   [ { "ids": ["id1","id2"],                // ya da "id": "..."
 *       "recalls": [ {"tarih":"YYYY-MM","parca":"...","baslik":"...","ozet":"...","cozum":"...","kaynak":"https://..."} ],  // kayıt yoksa []
 *       "kapsam": { "id3": [0] }           // isteğe bağlı: bir kampanya yalnızca bazı yıllara/versiyonlara aitse,
 *                                           //   o id'ye recalls dizisinin hangi öğelerinin yazılacağı (sıra numarası)
 *     } ]
 *   Yalnızca değeri null olan kayıtlara yazar (--uzerine ile dolu kayda da yazar). Yasaklı kaynak reddedilir.
 *   Kampanya, araç sahibinin şikâyeti değil resmi geri çağırma olmalıdır (NHTSA, KBA, EU Safety Gate, Transport Canada,
 *   üretici ya da distribütör duyurusu).
 */
const fs = require('fs'), path = require('path');
const { YASAK } = require('./yasak_kaynak.js');
const DF = path.join(__dirname, '..', 'arac-detay.html');
let d = fs.readFileSync(DF, 'utf8');
const a = process.argv.slice(2);

function closeOf(t, i) {
  let n = 0;
  for (let p = i; p < t.length; p++) {
    const c = t[p];
    if (c === '"' || c === "'" || c === '`') { const q = c; p++; while (p < t.length && t[p] !== q) { if (t[p] === '\\') p++; p++; } continue; }
    if (c === '{' || c === '[') n++; else if (c === '}' || c === ']') { n--; if (!n) return p; }
  }
  throw new Error('kapanış yok');
}
const blok = n => { const s = d.indexOf('const ' + n + ' = {'), o = d.indexOf('{', s); return { o, e: closeOf(d, o) }; };
const obj = n => { const b = blok(n); return new Function('return ' + d.slice(b.o, b.e + 1))(); };
const CARS = obj('CARS'), RECALLS = obj('RECALLS');

if (a.includes('--liste')) {
  const mi = a.indexOf('--marka'), marka = mi >= 0 ? a[mi + 1].toLocaleLowerCase('tr') : null;
  const ids = Object.keys(RECALLS).filter(id => RECALLS[id] === null && CARS[id])
    .filter(id => !a.includes('--satista') || !CARS[id].durum).filter(id => !a.includes('--eski') || CARS[id].durum)
    .filter(id => !marka || CARS[id].marka.toLocaleLowerCase('tr') === marka);
  const g = {};
  for (const id of ids) { const c = CARS[id], k = `${c.marka} | ${c.model} | ${c.nesil || c.yil}`; (g[k] = g[k] || []).push(id); }
  const sirali = Object.entries(g).sort((x, y) => y[1].length - x[1].length);
  if (marka) sirali.forEach(([k, v]) => console.log(`${k} (${v.length}): ${v.join(' ')}`));
  else {
    const m = {}; sirali.forEach(([k, v]) => { const b = k.split(' | ')[0]; m[b] = m[b] || { grup: 0, v: 0 }; m[b].grup++; m[b].v += v.length; });
    Object.entries(m).sort((x, y) => y[1].v - x[1].v).forEach(([b, x]) => console.log(`${b}: ${x.v} versiyon, ${x.grup} nesil grubu`));
  }
  console.log(`\nAraştırılmamış: ${ids.length} versiyon, ${sirali.length} nesil grubu`);
  process.exit(0);
}

const dosya = a.find(x => !x.startsWith('--'));
if (!dosya) { console.error('Kullanım: node tools/geri_cagirma_yaz.js --liste | kampanyalar.json [--kuru] [--uzerine]'); process.exit(1); }
const giris = JSON.parse(fs.readFileSync(dosya, 'utf8'));
const hata = [], yaz = {};
for (const [i, g] of giris.entries()) {
  const ids = g.ids || (g.id ? [g.id] : []);
  if (!ids.length) { hata.push(`Öğe ${i + 1}: id yok`); continue; }
  if (!Array.isArray(g.recalls)) { hata.push(`Öğe ${i + 1}: recalls dizi olmalı (kayıt yoksa [])`); continue; }
  for (const r of g.recalls) {
    if (!/^\d{4}-\d{2}$/.test(r.tarih || '')) hata.push(`Öğe ${i + 1}: tarih YYYY-AA olmalı (${r.tarih})`);
    if (!/^https:\/\//.test(r.kaynak || '') || YASAK.test(r.kaynak)) hata.push(`Öğe ${i + 1}: kaynak https olmalı ve yasaklı site olamaz (${r.kaynak})`);
    for (const f of ['parca', 'baslik', 'ozet']) if (!String(r[f] || '').trim()) hata.push(`Öğe ${i + 1}: ${f} boş`);
    if (/—/.test(JSON.stringify(r))) hata.push(`Öğe ${i + 1}: metinde uzun tire (—) kullanma`);
  }
  for (const id of ids) {
    if (!(id in RECALLS)) { hata.push(`${id}: arac-detay.html'de yok`); continue; }
    if (RECALLS[id] !== null && !a.includes('--uzerine')) { console.log(`atlandı (zaten araştırılmış): ${id}`); continue; }
    const k = g.kapsam && g.kapsam[id];
    yaz[id] = Array.isArray(k) ? k.map(n => g.recalls[n]).filter(Boolean) : g.recalls;
  }
}
if (hata.length) { console.error('HATA, hiçbir şey yazılmadı:\n' + hata.join('\n')); process.exit(1); }
for (const [id, list] of Object.entries(yaz)) {
  const b = blok('RECALLS');
  const govde = d.slice(b.o, b.e + 1);
  const re = new RegExp(`(['"])${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\1\\s*:\\s*null`);
  const m = govde.match(re);
  let yeni;
  if (m) yeni = govde.replace(re, `'${id}':${JSON.stringify(list)}`);
  else { // --uzerine: mevcut diziyi değiştir
    const p = govde.search(new RegExp(`(['"])${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\1\\s*:`)); if (p < 0) continue;
    const ac = govde.indexOf(':', p) + 1; let s = ac; while (/\s/.test(govde[s])) s++;
    const bit = govde[s] === '[' ? closeOf(govde, s) : s + 3;
    yeni = govde.slice(0, ac) + JSON.stringify(list) + govde.slice(bit + 1);
  }
  d = d.slice(0, b.o) + yeni + d.slice(b.e + 1);
}
for (const m of d.matchAll(/<script>([\s\S]*?)<\/script>/g)) new Function(m[1]);
const sonra = obj('RECALLS');
for (const id of Object.keys(yaz)) if (JSON.stringify(sonra[id]) !== JSON.stringify(yaz[id])) { console.error('doğrulama hatası ' + id); process.exit(1); }
const kampanya = Object.values(yaz).reduce((t, l) => t + l.length, 0);
if (a.includes('--kuru')) { console.log(`${Object.keys(yaz).length} versiyon, ${kampanya} kampanya kaydı yazılacak (kuru çalıştırma).`); process.exit(0); }
fs.writeFileSync(DF, d);
console.log(`Yazıldı: ${Object.keys(yaz).length} versiyon, ${kampanya} kampanya kaydı. Kalan araştırılmamış: ${Object.values(sonra).filter(v => v === null).length}`);
