// Togg T10X: V1 Standart Menzil kaydını katalogla tamamlar, diğer üç 2026 versiyonunu ekler.
const fs = require('fs'), path = require('path'), R = process.argv[2];
const KF = path.join(R, 'karsilastirma.html'), DF = path.join(R, 'arac-detay.html');
let k = fs.readFileSync(KF, 'utf8'), d = fs.readFileSync(DF, 'utf8');
function closeOf(t, i) { let dp = 0; for (let p = i; p < t.length; p++) { const ch = t[p]; if (ch === '"' || ch === "'" || ch === '`') { const q = ch; p++; while (p < t.length && t[p] !== q) { if (t[p] === '\\') p++; p++; } continue; } if (ch === '{' || ch === '[') dp++; else if (ch === '}' || ch === ']') { dp--; if (dp === 0) return p; } } }
const KAT = { ad: 'Togg Türkiye, T10X kataloğu teknik veriler ve donanım tablosu (15.06.2026)', url: 'https://trumore-cdn.togg.cloud/ToggT10XKatalog.pdf', tarih: '2026-11-07' };
const KATO = (not) => ({ ...KAT, ad: KAT.ad + (not ? ` (${not})` : '') });
const FIY = { ad: 'Togg Türkiye fiyat listesi, anahtar teslim (15.06.2026 itibarıyla)', url: 'https://www.togg.com.tr/en/price-list', tarih: '2026-11-07' };
const ORTAK = {
  kasa: 'SUV', yakit: 'Elektrik', sanziman: 'Tek vitesli (elektrikli)', koltuk: 5, kapi: 5, segment: 'C-SUV', hiz_kmh: 185,
  uzunluk_mm: 4599, dingil_mm: 2890, bagaj_l: 441, airbag_sayisi: 7, ncap_yildiz: 5, ncap_test_yili: 2025,
  dc_hizli_sarj_dk_20_80: 26.5, garanti_yil: 3, garanti_km: 100000, batarya_garanti_yil: 8, boya_garanti_yil: 3, pas_garanti_yil: 12,
  otonom_acil_fren: 'Var', adaptif_hiz_sabitleyici: 'Var (dur-kalk işlevi Nisan 2025 sonrası üretimde geçici olarak kapalı)', serit_takip: 'Var', kor_nokta: 'Var',
  yorgunluk_tespit: 'Var (kameralı sürücü dikkat takibi)', yokus_kalkis: 'Var', park_sensoru: 'Var (ön ve arka)', klima: 'Otomatik (çift bölgeli)',
  led_far: 'Var', acilir_tavan: 'Opsiyonel (panoramik cam tavan, 65.000 TL)', dijital_gosterge: 'Var (12 inç)', ekran_inch: 29,
  navigasyon: 'Var (Trumore Gez uygulaması, çevrim içi özellikler 3 yıl ücretsiz)', carplay_android_auto: 'Yok (Trumore işletim sistemi)', ses_sistemi: '6 hoparlör'
};
const V1 = { kamera_360: 'Yok', geri_gorus_kamera: 'Var', koltuk_isitma: 'Yok', elektrikli_koltuk: 'Yok', deri_doseme: 'Yok (kumaş döşeme)', anahtarsiz_giris: 'Opsiyonel (Techno-Konfor paketi; anahtarsız çalıştırma standart)', elektrikli_bagaj: 'Yok', kablosuz_sarj: 'Opsiyonel (Techno-Konfor paketi)' };
const V2 = { kamera_360: 'Var', geri_gorus_kamera: 'Var (360° çevre görüş kamerasıyla)', koltuk_isitma: 'Var (ön; arka koltuk ısıtma Kış paketiyle)', elektrikli_koltuk: 'Var (ön, hafızalı)', deri_doseme: 'Var (vegan deri)', anahtarsiz_giris: 'Var', elektrikli_bagaj: 'Var', kablosuz_sarj: 'Var', ses_sistemi: '6 hoparlör (Meridian Premium ses sistemi opsiyonel)' };
const SURUMLER = [
  { id: 'togg-t10x-2026-v1-rwd-standart', versiyon: 'V1 RWD Standart Menzil', fiyat: 1909048, s: { ...ORTAK, ...V1, guc_hp: 218, tork_nm: 350, sifirYuz_sn: 7.4, menzil_km_wltp: 314, elektrik_tuketim_kwh100km: 19.5, batarya_kwh: 52.4, cekis: 'Arkadan itiş (RWD)', genislik_mm: 1886, yukseklik_mm: 1676, yerden_yukseklik_mm: 192, agirlik_kg: 1960.5 } },
  { id: 'togg-t10x-2026-v1-rwd-uzun-menzil', versiyon: 'V1 RWD Uzun Menzil', fiyat: 2219668, s: { ...ORTAK, ...V1, guc_hp: 218, tork_nm: 350, sifirYuz_sn: 8.0, menzil_km_wltp: 523, elektrik_tuketim_kwh100km: 19.7, batarya_kwh: 89.6, cekis: 'Arkadan itiş (RWD)', genislik_mm: 1885, yukseklik_mm: 1673, yerden_yukseklik_mm: 190, agirlik_kg: 2152.5 } },
  { id: 'togg-t10x-2026-v2-rwd-uzun-menzil', versiyon: 'V2 RWD Uzun Menzil', fiyat: 2411000, s: { ...ORTAK, ...V2, guc_hp: 218, tork_nm: 350, sifirYuz_sn: 8.0, menzil_km_wltp: 523, elektrik_tuketim_kwh100km: 19.7, batarya_kwh: 89.6, cekis: 'Arkadan itiş (RWD)', genislik_mm: 1885, yukseklik_mm: 1670, yerden_yukseklik_mm: 188, agirlik_kg: 2174.5 } },
  { id: 'togg-t10x-2026-v2-4more-obsidyen', versiyon: 'V2 4More Obsidyen', fiyat: 3218137, s: { ...ORTAK, ...V2, deri_doseme: 'Var (Dinamica kumaş ve vegan deri)', guc_hp: 435, tork_nm: 700, sifirYuz_sn: 4.5, menzil_km_wltp: 468, elektrik_tuketim_kwh100km: 22.3, batarya_kwh: 89.6, cekis: 'Dört çeker (AWD, çift motor)', genislik_mm: 1885, yukseklik_mm: 1669, yerden_yukseklik_mm: 185, agirlik_kg: 2306.5 } }
];
const AGIRLIK_ARALIK = { 'togg-t10x-2026-v1-rwd-standart': '1949–1972', 'togg-t10x-2026-v1-rwd-uzun-menzil': '2138–2167', 'togg-t10x-2026-v2-rwd-uzun-menzil': '2160–2189', 'togg-t10x-2026-v2-4more-obsidyen': '2292–2321' };
function ek(v) {
  const e = {};
  for (const a of Object.keys(v.s)) {
    if (['garanti_yil', 'garanti_km', 'batarya_garanti_yil', 'boya_garanti_yil', 'pas_garanti_yil', 'ncap_yildiz', 'ncap_test_yili'].includes(a)) continue;
    e[a] = a === 'agirlik_kg' ? KATO(`sürücüsüz boş ağırlık ${AGIRLIK_ARALIK[v.id]} kg aralığının ortası`) : a === 'batarya_kwh' ? KATO('brüt kapasite') : a === 'ekran_inch' ? KATO('29 inç uçtan uca multimedya ekranı; ayrıca 8 inç dokunmatik kontrol ekranı') : a === 'acilir_tavan' ? { ...FIY, ad: FIY.ad + ' (opsiyon listesi)' } : KAT;
  }
  e.liste_fiyati_tl = FIY;
  return e;
}
// karşılaştırma kaydı
const ks = k.indexOf('const CARS = ['), KC = new Function(k.slice(ks, k.indexOf('\n];', ks) + 3) + ';return CARS;')();
const base = KC.find(c => c.id === 'togg-t10x-2026-v1-rwd-standart');
const kp = k.indexOf('{id:"togg-t10x-2026-v1-rwd-standart"') >= 0 ? k.indexOf('{id:"togg-t10x-2026-v1-rwd-standart"') : k.indexOf('{"id":"togg-t10x-2026-v1-rwd-standart"');
const kEnd = closeOf(k, kp);
const do_ = d.indexOf('{', d.indexOf('const CARS = {')), DC = new Function('return ' + d.slice(do_, closeOf(d, do_) + 1))();
const dbase = DC['togg-t10x-2026-v1-rwd-standart'];
const yeniK = [], yeniD = [];
const genel = x => !/V1|Standart Menzil|314|52[,.]4/.test(JSON.stringify(x));
for (const v of SURUMLER) {
  const eskiS = v.id === base.id ? base.s : {};
  const s = { ...eskiS, ...v.s, liste_fiyati_tl: v.fiyat }; delete s.sistem_puani_10;
  const ekk = { ...(v.id === base.id ? base.ekKaynak : {}), ...ek(v) };
  const kayit = { id: v.id, marka: 'Togg', model: 'T10X', yil: 2026, versiyon: v.versiyon, kaynakAd: 'Togg Türkiye T10X kataloğu (15.06.2026) ve fiyat listesi', kaynakUrl: KAT.url, s, ekKaynak: ekk, ...(base.nesil ? { nesil: base.nesil } : {}), kaynakTarih: '2026-11-07' };
  if (v.id === base.id) {
    k = k.slice(0, kp) + JSON.stringify(kayit) + k.slice(kEnd + 1);
    const dp = d.indexOf("'" + v.id + "':", do_), dO = d.indexOf('{', dp), dE = closeOf(d, dO);
    d = d.slice(0, dO) + JSON.stringify({ ...dbase, kaynakAd: kayit.kaynakAd, kaynakUrl: kayit.kaynakUrl, kaynakTuru: 'birincil', s, ekKaynak: ekk, kaynakTarih: '2026-11-07' }) + d.slice(dE + 1);
  } else {
    if (KC.some(c => c.id === v.id)) { console.log('zaten var', v.id); continue; }
    yeniK.push(JSON.stringify(kayit));
    yeniD.push(`'${v.id}':` + JSON.stringify({ ...kayit, fotoUrl: null, sanalTurUrl: null, kaynakTuru: 'birincil', ncapNot: dbase.ncapNot, ncapKaynak: dbase.ncapKaynak, geriCagirmaNot: dbase.geriCagirmaNot, agirBakim: dbase.agirBakim, kucukDetaylar: (dbase.kucukDetaylar || []).filter(genel), gucluYanlar: (dbase.gucluYanlar || []).filter(genel), dikkatEdilecekler: (dbase.dikkatEdilecekler || []).filter(genel), odul: dbase.odul || [], sistemPuani: null }));
  }
}
// ekle: karşılaştırmada V1'in hemen arkasına, detayda V1 kaydının arkasına; RECALLS/OFFICIAL/REVIEWS girdileri
if (yeniK.length) {
  const kp2 = k.indexOf('"id":"togg-t10x-2026-v1-rwd-standart"') - 1, kE2 = closeOf(k, kp2);
  k = k.slice(0, kE2 + 1) + ',\n ' + yeniK.join(',\n ') + k.slice(kE2 + 1);
  const dp = d.indexOf("'togg-t10x-2026-v1-rwd-standart':", do_), dO = d.indexOf('{', dp), dE = closeOf(d, dO);
  d = d.slice(0, dE + 1) + ',\n' + yeniD.join(',\n') + d.slice(dE + 1);
  for (const [ad, deg] of [['RECALLS', '[]'], ['OFFICIAL', 'null'], ['REVIEWS', '[]']]) {
    const bi = d.indexOf(`const ${ad} = {`); const anahtar = `'togg-t10x-2026-v1-rwd-standart':`; const p = d.indexOf(anahtar, bi);
    const ilk = d.slice(p + anahtar.length).match(/^(\[\]|null)/);
    if (!ilk) { console.error(ad + ' girdisi beklenen biçimde değil'); process.exit(1); }
    const ekle = SURUMLER.slice(1).map(v => `\n'${v.id}':${ad === 'RECALLS' ? '[]' : deg},`).join('');
    d = d.slice(0, p) + ekle.slice(1) + '\n' + d.slice(p);
  }
}
// doğrulama
const K2 = new Function(k.slice(k.indexOf('const CARS = ['), k.indexOf('\n];', k.indexOf('const CARS = [')) + 3) + ';return CARS;')();
const o2 = d.indexOf('{', d.indexOf('const CARS = {')), D2 = new Function('return ' + d.slice(o2, closeOf(d, o2) + 1))();
for (const v of SURUMLER) { if (!K2.find(c => c.id === v.id) || !D2[v.id]) { console.error('doğrulanamadı ' + v.id); process.exit(1); } }
fs.writeFileSync(KF, k); fs.writeFileSync(DF, d);
console.log('Togg güncellendi:', SURUMLER.map(v => v.id).join(', '));
