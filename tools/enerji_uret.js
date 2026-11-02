#!/usr/bin/env node
/* Hesaplama sayfaları için araç enerji verisini üretir: assets/arac_enerji.js
   Kaynak: karsilastirma.html içindeki kaynaklı CARS verisi. Veri değişince yeniden çalıştırılır.
   Satır: [id, marka, model, versiyon, yil, yakit, l/100km, kWh/100km, batarya kWh, WLTP menzil, DC %20-80 dk, AC dk, depo L, liste fiyatı TL, satışta mı, kasa] */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const k = fs.readFileSync(path.join(ROOT, 'karsilastirma.html'), 'utf8');
const s0 = k.indexOf('const CARS = ['), e0 = k.indexOf('\n];', s0) + 3;
const CARS = new Function(k.slice(s0, e0) + ';return CARS;')();
const n = v => (typeof v === 'number' && isFinite(v)) ? v : null;
const satirlar = CARS.filter(c => c.s && (n(c.s.liste_fiyati_tl) || n(c.s.tuketim_l100km) || n(c.s.elektrik_tuketim_kwh100km) || (n(c.s.batarya_kwh) && n(c.s.menzil_km_wltp))))
  .map(c => {
    const s = c.s;
    return [c.id, c.marka, c.model, c.versiyon, c.yil, s.yakit || '', n(s.tuketim_l100km), n(s.elektrik_tuketim_kwh100km), n(s.batarya_kwh),
      n(s.menzil_km_wltp), n(s.dc_hizli_sarj_dk_20_80), n(s.ac_sarj_dk), n(s.depo_l), (c.yil === 2026 && !c.durum) ? n(s.liste_fiyati_tl) : null, c.durum ? 0 : 1, s.kasa || ''];
  })
  .sort((a, b) => a[1].localeCompare(b[1], 'tr') || a[2].localeCompare(b[2], 'tr') || b[4] - a[4] || a[3].localeCompare(b[3], 'tr'));
const out = `/* tools/enerji_uret.js tarafından üretilir, elle düzenlemeyin. */
window.ARAC_ENERJI=${JSON.stringify(satirlar)};
`;
fs.writeFileSync(path.join(ROOT, 'assets', 'arac_enerji.js'), out);
console.log(satirlar.length, 'araç;', satirlar.filter(r => /^Elektrik/i.test(r[5])).length, 'elektrikli');
