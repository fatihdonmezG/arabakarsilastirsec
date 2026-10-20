#!/usr/bin/env node
/*
 * Euro NCAP sonucunu bir nesil içindeki bütün versiyonlara yayar ve iki dosyayı (karsilastirma.html, arac-detay.html) eşitler.
 * Kural: Euro NCAP'in bir model nesline verdiği sonuç; motor, yakıt türü, donanım ve gövde ayrımı yapılmadan o neslin
 * bütün versiyonlarında geçerlidir. Nesil grubu: marka + model + (nesil alanı varsa nesil, yoksa model yılı).
 * Farklı adla kayıtlı aynı nesil modeller için (ör. "Egea Cross" ← "Egea Sedan") --esle dosyası verilebilir:
 *   [{"hedef":"Fiat|Egea Cross","kaynak":"Fiat|Egea Sedan"}]   (yalnızca aynı neslin farklı gövdesi/adı için)
 * Kullanım: node tools/ncap_yay.js [--esle esle.json] [--kuru]     (--kuru: yazmadan ne yapılacağını gösterir)
 * Dolu bir değerin üzerine yazmaz. Grup içinde farklı sonuçlar varsa o grubu atlar ve listeler.
 */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const KF = path.join(ROOT, 'karsilastirma.html'), DF = path.join(ROOT, 'arac-detay.html');
const args = process.argv.slice(2), kuru = args.includes('--kuru');
const esleIdx = args.indexOf('--esle');
const ESLE = esleIdx >= 0 ? JSON.parse(fs.readFileSync(args[esleIdx + 1], 'utf8')) : [];

let k = fs.readFileSync(KF, 'utf8'), d = fs.readFileSync(DF, 'utf8');

function closeOf(t, i) {
  let dep = 0;
  for (let p = i; p < t.length; p++) {
    const ch = t[p];
    if (ch === '"' || ch === "'" || ch === '`') { const q = ch; p++; while (p < t.length && t[p] !== q) { if (t[p] === '\\') p++; p++; } continue; }
    if (ch === '{' || ch === '[') dep++;
    else if (ch === '}' || ch === ']') { dep--; if (dep === 0) return p; }
  }
  throw new Error('kapanış bulunamadı');
}
const KC = (() => { const s = k.indexOf('const CARS = ['), e = k.indexOf('\n];', s) + 3; return new Function(k.slice(s, e) + ';return CARS;')(); })();
const DC = (() => { const s = d.indexOf('const CARS = {'), o = d.indexOf('{', s); return new Function('return ' + d.slice(o, closeOf(d, o) + 1))(); })();

// Bir kaydın s nesnesine alan ekler (yoksa); ayrıca üst düzey alanları (ncapNot, ncapKaynak) boşsa doldurur.
function patch(t, id, sFields, top) {
  const pats = [`{id:"${id}"`, `{"id":"${id}"`, `{id:'${id}'`, `'${id}':{`];
  let a = -1; for (const p of pats) { a = t.indexOf(p); if (a >= 0) { if (p.startsWith("'")) a = t.indexOf('{', a); break; } }
  if (a < 0) return t;
  const b = closeOf(t, a);
  let body = t.slice(a, b + 1);
  const m = body.match(/(["']?)s\1:\{/);
  if (!m) return t;
  const q = m[1] || (body.startsWith('{"') ? '"' : '');
  const sStart = body.indexOf(m[0]) + m[0].length - 1, sEnd = closeOf(body, sStart);
  let sBody = body.slice(sStart, sEnd + 1);
  const yeni = [];
  for (const [f, v] of Object.entries(sFields)) {
    const val = typeof v === 'number' ? String(v) : JSON.stringify(v);
    const re = new RegExp(`(["']?)${f}\\1:(null|undefined)\\b`);
    if (re.test(sBody)) sBody = sBody.replace(re, `$1${f}$1:${val}`);   // alan var ama boş: yerinde doldur
    else yeni.push(`${q}${f}${q}:${val}`);
  }
  if (yeni.length) sBody = '{' + yeni.join(',') + (sBody[1] === '}' ? '' : ',') + sBody.slice(1);
  body = body.slice(0, sStart) + sBody + body.slice(sEnd + 1);
  for (const [f, v] of Object.entries(top || {})) {
    const re = new RegExp(`(["']?)${f}\\1:null`);
    if (re.test(body)) body = body.replace(re, `$1${f}$1:${JSON.stringify(v)}`);
  }
  return t.slice(0, a) + body + t.slice(b + 1);
}

// Nesil adındaki gövde ekleri (Sport Tourer, SW, Sedan...) atılır: aynı neslin gövdeleri aynı sonucu paylaşır.
const nesilAd = n => String(n).replace(/\s+(sport tourer|grandtour|grand tour|sw|sedan|hatchback|hb|estate|combi|kombi|variant|avant|touring|coup[eé]|cabrio(let)?|fastback|liftback|sportback|station wagon)\b.*$/i, '').trim();
const key = c => `${c.marka}|${c.model}|${c.nesil ? nesilAd(c.nesil) : c.yil}`;
const src = {}; // grup → {yildiz, yil, kaynak, not}
const celiski = new Set();
for (const c of KC) {
  const dc = DC[c.id] || {};
  // Detaydaki değer yalnızca kaynağı euroncap.com ise kabul edilir (NHTSA, ANCAP, C-NCAP sonuçları Euro NCAP yerine geçmez).
  const dOk = dc.s?.ncap_yildiz != null && /euroncap\.com/i.test(dc.ncapKaynak || '');
  const sy = c.s.ncap_yildiz ?? (dOk ? dc.s.ncap_yildiz : null), ty = c.s.ncap_test_yili ?? (dOk ? dc.s.ncap_test_yili : null);
  if (sy == null) continue;
  const g = key(c), v = { yildiz: sy, yil: ty ?? null, kaynak: dc.ncapKaynak || null, ad: `${c.model}${c.nesil ? ' (' + c.nesil + ')' : ''}` };
  if (src[g] && (src[g].yildiz !== v.yildiz || (src[g].yil && v.yil && src[g].yil !== v.yil))) celiski.add(g);
  if (!src[g] || (!src[g].yil && v.yil) || (!src[g].kaynak && v.kaynak)) src[g] = v;
}
// eşleme: farklı adla kayıtlı aynı nesil
for (const { hedef, kaynak } of ESLE) {
  const [hm, hmo] = hedef.split('|'), [km, kmo] = kaynak.split('|');
  for (const c of KC.filter(x => x.marka === hm && x.model === hmo)) {
    const g = key(c); if (src[g]) continue;
    const s2 = Object.entries(src).find(([gg]) => gg.startsWith(`${km}|${kmo}|`) && gg.split('|')[2] === String(c.nesil || c.yil));
    if (s2) src[g] = { ...s2[1], esle: kaynak.split('|')[1] };
  }
}

const yapilan = [];
for (const c of KC) {
  const g = key(c); if (celiski.has(g) || !src[g]) continue;
  const v = src[g], dc = DC[c.id];
  const kEksik = c.s.ncap_yildiz == null, dEksik = dc && dc.s && dc.s.ncap_yildiz == null;
  if (!kEksik && !dEksik) continue;
  const f = { ncap_yildiz: v.yildiz }; if (v.yil) f.ncap_test_yili = v.yil;
  const not = v.esle ? `Euro NCAP sonucu aynı neslin ${v.esle} modeline verildi; motor ve gövde ayrımı yapılmadan bu versiyon için de geçerlidir.`
                     : `Euro NCAP sonucu bu neslin tamamı için geçerlidir (motor, yakıt türü ve donanım ayrımı yapılmaz).`;
  const top = { ncapNot: not }; if (v.kaynak) top.ncapKaynak = v.kaynak;
  if (!kuru) {
    if (kEksik) k = patch(k, c.id, Object.fromEntries(Object.entries(f).filter(([ff]) => c.s[ff] == null)), {});
    if (dEksik) d = patch(d, c.id, Object.fromEntries(Object.entries(f).filter(([ff]) => dc.s[ff] == null)), top);
  }
  yapilan.push(`${c.id} ← ${v.yildiz}★ ${v.yil || ''}${v.esle ? ' (' + v.esle + ')' : ''}${kEksik ? '' : ' [yalnız detay]'}${dEksik ? '' : ' [yalnız karşılaştırma]'}`);
}
console.log(yapilan.join('\n'));
if (celiski.size) console.log('\nAtlandı (grup içinde farklı sonuçlar): ' + [...celiski].join(', '));
console.log(`\n${yapilan.length} versiyon ${kuru ? 'güncellenecek (kuru çalıştırma)' : 'güncellendi'}.`);
if (!kuru && yapilan.length) {
  for (const [f, t] of [[KF, k], [DF, d]]) {
    for (const m of t.matchAll(/<script>([\s\S]*?)<\/script>/g)) new Function(m[1]); // sözdizimi kontrolü
    fs.writeFileSync(f, t);
  }
  execFileSync('node', [path.join(__dirname, 'puan_hesapla.js')], { stdio: 'inherit' });
}
