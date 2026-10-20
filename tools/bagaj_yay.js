#!/usr/bin/env node
/*
 * Bagaj hacmini aynı neslin, aynı gövdenin ve aynı güç aktarma tipinin diğer versiyonlarına (diğer model yıllarına,
 * donanım paketlerine, motor seçeneklerine) yayar.
 * Grup: marka + model + (nesil varsa nesil, yoksa model yılı) + kasa + güç tipi (içten yanmalı/hafif hibrit, tam hibrit,
 * plug-in hibrit, elektrikli) + dört çeker mi. Hibrit ve elektriklilerde batarya, dört çekerlerde arka aks bagajı küçültebildiği için ayrı tutulur.
 * FARKLI NESLE YAYILMAZ: yeni nesil farklı gövde ve farklı bagaj demektir.
 * Grup içinde farklı bagaj değerleri varsa grup atlanır. Kaynağı yasaklı sitelere dayanan değer yayılmaz.
 * Kullanım: node tools/bagaj_yay.js [--kuru]
 */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { YASAK } = require('./yasak_kaynak.js');
const ROOT = path.join(__dirname, '..');
const k = fs.readFileSync(path.join(ROOT, 'karsilastirma.html'), 'utf8');
const s0 = k.indexOf('const CARS = ['), CARS = new Function(k.slice(s0, k.indexOf('\n];', s0) + 3) + ';return CARS;')();
const kuru = process.argv.includes('--kuru');

const gucTipi = y => { y = y || ''; if (/^Elektrik/i.test(y)) return 'ev'; if (/plug-?in/i.test(y)) return 'phev'; if (/hafif|mild/i.test(y)) return 'icten'; if (/hibrit|hybrid|e-POWER/i.test(y)) return 'hev'; return 'icten'; };
const dortCeker = c => /4x4|AWD|4WD|4MATIC|xDrive|quattro|4Motion|ALL4|Q4|dört/i.test((c.s.cekis || '') + ' ' + c.versiyon);
const key = c => [c.marka, c.model, c.nesil || c.yil, c.s.kasa || '?', gucTipi(c.s.yakit), dortCeker(c) ? '4x4' : '2x4'].join('|');
const kaynakOf = c => (c.ekKaynak && c.ekKaynak.bagaj_l) ? { ad: c.ekKaynak.bagaj_l.ad, url: c.ekKaynak.bagaj_l.url } : { ad: c.kaynakAd, url: c.kaynakUrl };

const G = {};
for (const c of CARS) (G[key(c)] = G[key(c)] || []).push(c);
const satirlar = [], atlanan = [], rapor = [];
const bugun = new Date().toISOString().slice(0, 10);
for (const [g, L] of Object.entries(G)) {
  const dolu = L.filter(c => c.s.bagaj_l != null), bos = L.filter(c => c.s.bagaj_l == null);
  if (!dolu.length || !bos.length) continue;
  const degerler = [...new Set(dolu.map(c => c.s.bagaj_l))];
  if (degerler.length > 1) { atlanan.push(`${g}: farklı değerler (${degerler.join(', ')} L)`); continue; }
  const src = dolu.find(c => { const kk = kaynakOf(c); return /^https:\/\//.test(kk.url || '') && !YASAK.test(kk.url + ' ' + kk.ad); });
  if (!src) { atlanan.push(`${g}: değerin kaynağı yasaklı ya da URL'siz`); continue; }
  const kk = kaynakOf(src);
  for (const c of bos) satirlar.push({ id: c.id, alan: 'bagaj_l', deger: src.s.bagaj_l, kaynakAd: `${kk.ad} (aynı nesil ve gövde: ${src.yil} ${src.versiyon})`, kaynakUrl: kk.url, kaynakTuru: (src.kaynakTuru === 'sahibinden' ? 'sahibinden' : 'birincil'), sonDogrulama: bugun });
  rapor.push(`${g}: ${src.s.bagaj_l} L → ${bos.length} versiyon`);
}
console.log(rapor.join('\n') || 'Yayılacak bagaj değeri yok.');
if (atlanan.length) console.log('\nAtlanan gruplar:\n' + atlanan.join('\n'));
console.log(`\n${satirlar.length} versiyon ${kuru ? 'güncellenecek (kuru çalıştırma)' : 'güncelleniyor'}.`);
if (!kuru && satirlar.length) {
  const tmp = path.join(require('os').tmpdir(), `bagaj_yay_${process.pid}.jsonl`);
  fs.writeFileSync(tmp, satirlar.map(x => JSON.stringify(x)).join('\n'));
  execFileSync('node', [path.join(__dirname, 'teknik_yama.js'), tmp], { stdio: 'inherit' });
  fs.unlinkSync(tmp);
}
