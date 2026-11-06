#!/usr/bin/env node
/* Açıklama metinleri (artılar, dikkat edilecekler, küçük detaylar) ile teknik/donanım alanlarını karşılaştırır.
 * Metin bir özelliğin olmadığını ya da olduğunu söylüyor ama alan boş veya tersi yazıyorsa listeler.
 * Kullanım: node tools/tutarlilik.js [--json] */
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..');
const t = fs.readFileSync(path.join(R, 'arac-detay.html'), 'utf8');
const s = t.indexOf('const CARS = {'), o = t.indexOf('{', s);
function closeOf(t, i) { let d = 0; for (let p = i; p < t.length; p++) { const ch = t[p]; if (ch === '"' || ch === "'" || ch === '`') { const q = ch; p++; while (p < t.length && t[p] !== q) { if (t[p] === '\\') p++; p++; } continue; } if (ch === '{' || ch === '[') d++; else if (ch === '}' || ch === ']') { d--; if (d === 0) return p; } } }
const D = new Function('return ' + t.slice(o, closeOf(t, o) + 1))();
const KURAL = [
  ['carplay_android_auto', /carplay|android auto/i],
  ['kablosuz_sarj', /kablosuz (telefon )?şarj/i],
  ['kamera_360', /360\s*°?\s*(derece )?kamera/i],
  ['acilir_tavan', /(cam|açılır|panoramik) tavan/i],
  ['navigasyon', /navigasyon/i],
  ['koltuk_isitma', /koltuk ısıtma|ısıtmalı koltuk/i],
  ['elektrikli_bagaj', /elektrikli bagaj/i],
  ['adaptif_hiz_sabitleyici', /adaptif (hız sabitleyici|cruise)/i],
];
const YOK = /(yok|desteklenmiyor|desteklemiyor|bulunmuyor|sunulmuyor|verilmiyor|eksik|olmaması|yer almıyor)/i;
const out = [];
for (const [id, c] of Object.entries(D)) {
  const sv = c.s || {};
  const metinler = [...(c.gucluYanlar || []), ...(c.dikkatEdilecekler || [])].map(x => x.metin || '').concat((c.kucukDetaylar || []).map(x => (x.ozellik || '') + ' ' + (x.deger || '')));
  for (const m of metinler) for (const [alan, re] of KURAL) {
    if (!re.test(m)) continue;
    const cumle = m.split(/(?<=[.;])\s/).find(x => re.test(x)) || m;
    const olumsuz = YOK.test(cumle);
    const v = sv[alan];
    const vYok = /^yok/i.test(String(v || ''));
    if (v == null || v === '') out.push({ id, alan, durum: 'alan boş', metin: cumle.slice(0, 160), olumsuz });
    else if (olumsuz !== vYok && !/opsiyonel/i.test(String(v))) out.push({ id, alan, durum: `alan "${v}"`, metin: cumle.slice(0, 160), olumsuz });
  }
}
if (process.argv.includes('--json')) console.log(JSON.stringify(out, null, 1));
else { out.forEach(x => console.log(`${x.id} | ${x.alan} | ${x.durum} | metin ${x.olumsuz ? 'yok diyor' : 'var diyor'}: ${x.metin}`)); console.log('Toplam:', out.length); }
