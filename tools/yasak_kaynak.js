#!/usr/bin/env node
/*
 * Veritabanında yasaklı kaynak (rakip karşılaştırma ve ilan siteleri) kullanan kayıtları listeler.
 * Kullanım: node tools/yasak_kaynak.js            → marka bazında özet
 *           node tools/yasak_kaynak.js --ayrinti  → her kayıt için hangi alanlarda geçtiği
 *           node tools/yasak_kaynak.js --marka Volkswagen   → yalnızca bir marka (ayrıntılı)
 *           node tools/yasak_kaynak.js --json     → makine okunur liste
 * Çıkış kodu: yasaklı kaynak kalmadıysa 0, kaldıysa 2.
 */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const YASAK = /(sifiraracal|arabalar\.com\.tr|epey\.com|\bepey\b|araclo|ekiyasla|otobul|arabakarsilastirma\.com\.tr|mukayese\.com|\bmukayese\b|arabam\.com|letgo|otoplus|vavacars)/i;
module.exports.YASAK = YASAK;
function closeOf(t, i) {
  let d = 0;
  for (let p = i; p < t.length; p++) {
    const ch = t[p];
    if (ch === '"' || ch === "'" || ch === '`') { const q = ch; p++; while (p < t.length && t[p] !== q) { if (t[p] === '\\') p++; p++; } continue; }
    if (ch === '{' || ch === '[') d++; else if (ch === '}' || ch === ']') { d--; if (d === 0) return p; }
  }
}
function oku() {
  const k = fs.readFileSync(path.join(ROOT, 'karsilastirma.html'), 'utf8'), d = fs.readFileSync(path.join(ROOT, 'arac-detay.html'), 'utf8');
  const ks = k.indexOf('const CARS = ['), KC = new Function(k.slice(ks, k.indexOf('\n];', ks) + 3) + ';return CARS;')();
  const obj = n => { const s = d.indexOf('const ' + n + ' = {'), o = d.indexOf('{', s); return new Function('return ' + d.slice(o, closeOf(d, o) + 1))(); };
  return { KC, DC: obj('CARS'), RC: obj('RECALLS') };
}
module.exports.oku = oku;
function tara(o, yol, out) {
  if (o == null) return;
  if (typeof o === 'string') { if (YASAK.test(o)) out.push(yol); return; }
  if (typeof o === 'object') for (const [k, v] of Object.entries(o)) tara(v, yol ? yol + '.' + k : k, out);
}
function liste() {
  const { KC, DC, RC } = oku(), sonuc = [];
  for (const c of KC) {
    const yerler = [];
    tara({ kaynakAd: c.kaynakAd, kaynakUrl: c.kaynakUrl, ekKaynak: c.ekKaynak }, '', yerler);
    const dy = []; const dc = DC[c.id];
    if (dc) { const { s, ...rest } = dc; tara(rest, '', dy); }
    const ry = []; tara(RC[c.id], 'recalls', ry);
    const hepsi = [...new Set([...yerler, ...dy, ...ry])];
    if (hepsi.length) sonuc.push({ id: c.id, marka: c.marka, model: c.model, yil: c.yil, satista: !c.durum, kaynakAd: c.kaynakAd, yerler: hepsi });
  }
  return sonuc;
}
module.exports.liste = liste;
if (require.main === module) {
  const a = process.argv.slice(2), L = liste();
  const mi = a.indexOf('--marka'), marka = mi >= 0 ? a[mi + 1] : null;
  const S = marka ? L.filter(x => x.marka.toLocaleLowerCase('tr') === marka.toLocaleLowerCase('tr')) : L;
  if (a.includes('--json')) { console.log(JSON.stringify(S, null, 1)); }
  else if (a.includes('--ayrinti') || marka) S.forEach(x => console.log(`${x.id} [${x.satista ? 'satışta' : 'eski'}] ${x.kaynakAd}\n   ${x.yerler.join(', ')}`));
  else {
    const m = {}; L.forEach(x => (m[x.marka] = (m[x.marka] || 0) + 1));
    Object.entries(m).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`${k}: ${v}`));
  }
  console.log(`\nYasaklı kaynak kullanan versiyon: ${S.length}${marka ? '' : ' (' + new Set(L.map(x => x.marka)).size + ' marka)'}`);
  process.exit(L.length ? 2 : 0);
}
