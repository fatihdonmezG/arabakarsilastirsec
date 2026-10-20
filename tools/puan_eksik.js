#!/usr/bin/env node
/*
 * Toplam sistem puanı hesaplanamayan versiyonlar için, puanı açmak için bulunması gereken EN AZ veriyi listeler.
 * Puan kuralı (tools/puan_hesapla.js): Güvenlik kriteri zorunlu, en az 4 kriter ve toplam ağırlığın en az %60'ı.
 *   Güvenlik  %32: Euro NCAP yıldızı  YA DA  hava yastığı sayısı + en az 3 sürüş destek kalemi (esp, abs, otonom_acil_fren, ...)
 *   Verimlilik %22: tuketim_l100km (elektrikli: elektrik_tuketim_kwh100km)
 *   Performans %16: sifirYuz_sn  YA DA  guc_hp + agirlik_kg
 *   Donanım   %16: 8 konfor kaleminden en az 4'ünün bilgisi (klima, koltuk_isitma, acilir_tavan, anahtarsiz_giris, start_stop, carplay_android_auto, dijital_gosterge, ses_sistemi)
 *   Pratiklik %3: bagaj_l       Garanti %11: garanti_yil
 * Kullanım: node tools/puan_eksik.js              → marka özeti
 *           node tools/puan_eksik.js --marka Renault   → o markanın versiyonları ve gereken alanlar
 *           node tools/puan_eksik.js --alan       → hangi alan kaç versiyonun puanını açar
 *           node tools/puan_eksik.js --satista | --eski   (filtre)
 */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const k = fs.readFileSync(path.join(ROOT, 'karsilastirma.html'), 'utf8');
const s0 = k.indexOf('const CARS = ['), CARS = new Function(k.slice(s0, k.indexOf('\n];', s0) + 3) + ';return CARS;')();
const ADAS = ['esp','abs','otonom_acil_fren','adaptif_hiz_sabitleyici','serit_takip','kor_nokta','yorgunluk_tespit','geri_gorus_kamera','yokus_kalkis'];
const DONANIM = ['klima','koltuk_isitma','acilir_tavan','anahtarsiz_giris','start_stop','carplay_android_auto','dijital_gosterge','ses_sistemi'];
const has = v => v != null && v !== '';
const W = { G: .32, V: .22, P: .16, D: .16, B: .03, R: .11 };  // tools/puan_hesapla.js ile aynı

// Her kriter için: zaten var mı, yoksa onu açmak için gereken alanlar (en ucuz seçenek) ve maliyeti (alan sayısı)
function secenekler(c) {
  const s = c.s, ev = /^Elektrik/i.test(s.yakit || ''), r = {};
  // Güvenlik
  if (has(s.ncap_yildiz) || (has(s.airbag_sayisi) && ADAS.filter(f => has(s[f])).length >= 3)) r.G = [];
  else {
    const adasEksik = Math.max(0, 3 - ADAS.filter(f => has(s[f])).length);
    const yolB = [...(has(s.airbag_sayisi) ? [] : ['airbag_sayisi']), ...(adasEksik ? [`${adasEksik} sürüş destek kalemi (${ADAS.filter(f => !has(s[f])).slice(0, 4).join('/')}...)`] : [])];
    r.G = { ncap: ['ncap_yildiz (+ncap_test_yili)'], donanim: yolB };
  }
  r.V = has(ev ? s.elektrik_tuketim_kwh100km : s.tuketim_l100km) ? [] : [ev ? 'elektrik_tuketim_kwh100km' : 'tuketim_l100km'];
  r.P = has(s.sifirYuz_sn) || (has(s.guc_hp) && has(s.agirlik_kg)) ? [] : (has(s.guc_hp) ? ['sifirYuz_sn ya da agirlik_kg'] : ['sifirYuz_sn']);
  const dn = DONANIM.filter(f => has(s[f])).length;
  r.D = dn >= 4 ? [] : [`${4 - dn} konfor kalemi (${DONANIM.filter(f => !has(s[f])).join('/')})`];
  r.B = has(s.bagaj_l) ? [] : ['bagaj_l'];
  r.R = has(s.garanti_yil) ? [] : ['garanti_yil'];
  return r;
}
// En az alanla puanı açan kriter kümesi
function plan(c) {
  const r = secenekler(c), eski = !!c.durum;
  const gYollari = Array.isArray(r.G) ? [[]] : [r.G.ncap, r.G.donanim];
  let best = null;
  const keys = ['V', 'P', 'D', 'B', 'R'];
  for (const g of gYollari) for (let m = 0; m < 32; m++) {
    const sec = keys.filter((_, i) => m >> i & 1);
    if (sec.length + 1 < 4 || W.G + sec.reduce((a, x) => a + W[x], 0) < 0.6 - 1e-9) continue;
    // eski modellerde garanti (sıfırken verilen garanti) bulunması zor: maliyeti yüksek say
    const alanlar = [...g, ...sec.flatMap(x => r[x])];
    const maliyet = alanlar.length + (eski && sec.includes('R') && r.R.length ? 3 : 0) + (alanlar.some(a => /kalemi/.test(a)) ? 1 : 0);
    if (!best || maliyet < best.maliyet) best = { alanlar, maliyet };
  }
  return best.alanlar;
}
const P = (() => { const w = {}; new Function('window', fs.readFileSync(path.join(ROOT, 'assets', 'puanlar.js'), 'utf8'))(w); return w.PUANLAR; })();
const a = process.argv.slice(2);
let L = CARS.filter(c => P[c.id] && P[c.id].toplam == null);
if (a.includes('--satista')) L = L.filter(c => !c.durum);
if (a.includes('--eski')) L = L.filter(c => c.durum);
const mi = a.indexOf('--marka');
if (mi >= 0) {
  const m = a[mi + 1].toLocaleLowerCase('tr');
  L.filter(c => c.marka.toLocaleLowerCase('tr') === m).forEach(c => console.log(`${c.id} [${c.durum ? 'eski' : 'satışta'}${c.nesil ? ', ' + c.nesil : ''}]\n   gerekli: ${plan(c).join(', ')}`));
} else if (a.includes('--alan')) {
  const say = {}; L.forEach(c => plan(c).forEach(f => { const n = f.replace(/ \(.*/, ''); say[n] = (say[n] || 0) + 1; }));
  Object.entries(say).sort((x, y) => y[1] - x[1]).forEach(([f, n]) => console.log(`${f}: ${n} versiyonda gerekli`));
} else {
  const m = {}; L.forEach(c => { m[c.marka] = m[c.marka] || { n: 0, alan: 0 }; m[c.marka].n++; m[c.marka].alan += plan(c).length; });
  Object.entries(m).sort((x, y) => y[1].n - x[1].n).forEach(([b, v]) => console.log(`${b}: ${v.n} versiyon, ${v.alan} alan`));
}
console.log(`\nToplam puanı olmayan: ${L.length} / ${CARS.length}`);
