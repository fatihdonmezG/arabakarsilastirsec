#!/usr/bin/env node
/*
 * Fotoğrafı aynı NESLİN (aynı kasa) diğer model yıllarına yayar: assets/fotolar.js'teki her fotoğrafın kapsadığı
 * versiyonların nesil adı bulunur; aynı marka + model + nesildeki fotoğrafsız yıllar fotoğrafın yıl aralığına eklenir.
 * Kural: fotoğrafın kapsadığı versiyonların hepsinde "nesil" yazılı ve tek bir nesil olmalı; genişletilen aralığa başka
 * nesilden bir yıl girmemeli. Nesli bilinmeyen kayda fotoğraf yayılmaz (önce nesil eklenir: kaynak_degistir.js "yol":"nesil").
 * Kullanım: node tools/foto_yay.js [--kuru]
 */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), FF = path.join(ROOT, 'assets', 'fotolar.js');
const kuru = process.argv.includes('--kuru');
const k = fs.readFileSync(path.join(ROOT, 'karsilastirma.html'), 'utf8');
const s0 = k.indexOf('const CARS = ['), CARS = new Function(k.slice(s0, k.indexOf('\n];', s0) + 3) + ';return CARS;')();
const src = fs.readFileSync(FF, 'utf8');
const w = {}; new Function('window', src)(w);
const F = w.FOTOLAR;
const nesilAd = n => String(n || '').replace(/\s+(sport tourer|grandtour|sw|estate|kombi|variant|avant|touring)\b.*$/i, '').trim();
const rapor = [], atla = [];
for (const [key, list] of Object.entries(F)) {
  const [marka, model] = key.split('|');
  const L = CARS.filter(c => c.marka === marka && c.model === model);
  for (const f of list) {
    const kapsanan = L.filter(c => (f.yilMin == null || c.yil >= f.yilMin) && (f.yilMax == null || c.yil <= f.yilMax));
    const nesiller = [...new Set(kapsanan.map(c => c.nesil || ''))];
    if (!kapsanan.length) continue;
    if (nesiller.length !== 1 || !nesiller[0]) { atla.push(`${key} ${f.yilMin}-${f.yilMax}: kapsanan kayıtlarda nesil ${nesiller.includes('') ? 'yazılı değil' : 'birden fazla'}`); continue; }
    const n = nesiller[0];
    const ayni = L.filter(c => c.nesil === n && (!c.s.kasa || !kapsanan[0].s.kasa || c.s.kasa === kapsanan[0].s.kasa));
    const yillar = ayni.map(c => c.yil), yeniMin = Math.min(...yillar, f.yilMin ?? Infinity), yeniMax = Math.max(...yillar, f.yilMax ?? -Infinity);
    const karisan = L.filter(c => c.nesil !== n && c.yil >= yeniMin && c.yil <= yeniMax);
    if (karisan.length) { atla.push(`${key} (${n}): ${yeniMin}-${yeniMax} aralığında başka nesil var (${[...new Set(karisan.map(c => c.nesil || '?'))].join(', ')})`); continue; }
    if (yeniMin !== f.yilMin || yeniMax !== f.yilMax) { rapor.push(`${key} (${n}): ${f.yilMin}-${f.yilMax} → ${yeniMin}-${yeniMax}`); f.yilMin = yeniMin; f.yilMax = yeniMax; }
  }
}
console.log(rapor.join('\n') || 'Yayılacak fotoğraf yok.');
if (atla.length) console.log(process.argv.includes('--ayrinti') ? '\nAtlanan:\n' + atla.join('\n') : `\n${atla.length} fotoğraf atlandı (çoğu: kapsadığı kayıtlarda nesil yazılı değil). Ayrıntı: --ayrinti`);
if (!kuru && rapor.length) {
  const bas = src.slice(0, src.indexOf('window.FOTOLAR ='));
  const son = src.slice(src.indexOf('\n', src.indexOf('window.FOTOLAR =')));
  fs.writeFileSync(FF, bas + 'window.FOTOLAR = ' + JSON.stringify(F) + ';' + son);
  console.log(`\n${rapor.length} fotoğraf aralığı genişletildi.`);
}
