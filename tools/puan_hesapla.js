#!/usr/bin/env node
/*
 * Sistem puanı: karsilastirma.html'deki kaynaklı verilerden her versiyon için 10 üzerinden puan hesaplar
 * ve assets/puanlar.js dosyasına yazar. Veri değiştiğinde yeniden çalıştırılır (detay_ekle.js ve teknik_yama.js bunu otomatik yapar).
 *
 * Yöntem (sistem-puani.html sayfasında da anlatılır):
 *  Kriter ve ağırlıklar: Güvenlik %30, Verimlilik %20, Performans %15, Donanım %15, Pratiklik %10, Garanti %10.
 *  Her kriter sabit, açıklanmış bir ölçekle 0–10'a çevrilir (ölçekler aşağıdaki O nesnesinde ve sistem-puani.html'de).
 *  Araç başka araçlarla sıralanmaz; aynı değer her zaman aynı puanı alır.
 *  Veri yoksa o kriter hesaba katılmaz, ağırlığı diğerlerine dağıtılır; güvenlik verisi, en az 4 kriter ve toplam ağırlığın en az %60'ı yoksa toplam puan verilmez.
 */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const k = fs.readFileSync(path.join(ROOT, 'karsilastirma.html'), 'utf8');
const s0 = k.indexOf('const CARS = ['), e0 = k.indexOf('\n];', s0) + 3;
const CARS = new Function(k.slice(s0, e0) + ';return CARS;')();
const BUGUN_YIL = new Date().getFullYear();

function fuelCat(y){ y=y||''; if(/^Elektrik/i.test(y)) return 'elektrik'; if(/plug-?in/i.test(y)) return 'phev'; if(/hafif|mild/i.test(y)) return 'mhev'; if(/hibrit|hybrid|e-POWER/i.test(y)) return 'hibrit'; if(/LPG/.test(y)) return 'lpg'; if(/^Dizel/i.test(y)) return 'dizel'; if(/^Benzin/i.test(y)) return 'benzin'; return 'diger'; }
function bodyCat(k){ k=k||''; if(/pick-?up/i.test(k)) return 'pickup'; if(/MPV|Minivan/i.test(k)) return 'mpv'; if(/Station|Estate/i.test(k)) return 'sw'; if(/SUV|Crossover/i.test(k)) return 'suv'; if(/Coupe|Cabrio|Roadster|Targa|Fastback/i.test(k)) return 'coupe'; if(/Sedan|Sportback/i.test(k)) return 'sedan'; if(/Hatchback/i.test(k)) return 'hatchback'; return 'diger'; }
const num = v => (typeof v === 'number' && isFinite(v)) ? v : null;
function varlik(v){ if(v==null) return null; const t=String(v).trim(); if(/^Yok/i.test(t)) return 0; if(/^Opsiyonel/i.test(t)) return 0.5; return 1; }

// Sabit ölçek: değer a'da 0, b'de 10 puan (arası doğrusal, uçlarda kırpılır). a>b ise küçük değer iyidir.
const olcek = (v, a, b) => r1(Math.max(0, Math.min(10, (v - a) / (b - a) * 10)));
const nf = (v, d=1) => Number(v).toLocaleString('tr-TR', { maximumFractionDigits: d });
const ADAS = ['esp','abs','adaptif_hiz_sabitleyici','serit_takip','yorgunluk_tespit','geri_gorus_kamera','yokus_kalkis'];
const DONANIM = ['klima','koltuk_isitma','acilir_tavan','anahtarsiz_giris','start_stop','carplay_android_auto','dijital_gosterge','ses_sistemi'];
const r1 = x => Math.round(x * 10) / 10;

// Ölçekler (sistem-puani.html'deki tabloyla aynı tutulmalı)
const O = {
  airbag: [2, 8],            // 2 hava yastığı = 0, 8 ve üstü = 10
  tuketim: [10, 4],          // l/100 km: 10 = 0, 4 ve altı = 10 (benzin, dizel, hibrit, LPG)
  phev: [2.5, 0.5],          // plug-in hibrit WLTP l/100 km
  ev: [24, 14],              // kWh/100 km: 24 = 0, 14 ve altı = 10
  sifirYuz: [14, 4.5],       // sn: 14 ve üstü = 0, 4,5 ve altı = 10
  gucAgirlik: [45, 160],     // HP/ton: 45 = 0, 160 ve üstü = 10
  bagaj: [200, 600],         // L: 200 = 0, 600 ve üstü = 10
  garanti: [-2, 6],          // yıl: 2 yıl (yasal asgari) = 5, her ek yıl +1,25, 6 yıl ve üstü = 10
};

function guvenlik(c){
  const s=c.s, parts=[], notes=[], acik=[];
  if (num(s.ncap_yildiz)!=null){
    let v = s.ncap_yildiz*2, eski='';
    if (num(s.ncap_test_yili)!=null && BUGUN_YIL - s.ncap_test_yili > 6){ v *= 0.85; eski=' (test 6 yıldan eski, %15 düşüldü)'; }
    parts.push([v, 0.6]); acik.push(`Euro NCAP ${s.ncap_yildiz} yıldız${s.ncap_test_yili?` (${s.ncap_test_yili})`:''} → ${nf(r1(v))}${eski}`);
  }
  if (num(s.airbag_sayisi)!=null){ const p=olcek(s.airbag_sayisi,...O.airbag); parts.push([p,0.15]); acik.push(`${s.airbag_sayisi} hava yastığı → ${nf(p)}`); }
  const known = ADAS.map(f=>varlik(s[f])).filter(v=>v!=null);
  if (known.length >= 3){ const sum=known.reduce((a,b)=>a+b,0), p=r1(sum/known.length*10); parts.push([p, 0.25]); acik.push(`sürüş destek donanımı: bilgisi olan ${known.length} kalemden ${nf(sum)} tanesi var → ${nf(p)}`); }
  if (!parts.length || num(s.ncap_yildiz)==null && parts.length < 2) return null;
  if (num(s.ncap_yildiz)==null) notes.push('Euro NCAP sonucu yok; güvenlik puanı yalnızca donanımdan hesaplandı');
  const w = parts.reduce((a,p)=>a+p[1],0); return { puan: r1(parts.reduce((a,p)=>a+p[0]*p[1],0)/w), notes, aciklama: acik.join('; ') };
}
function verimlilik(c){
  const s=c.s, f=fuelCat(s.yakit);
  if (f==='elektrik'){ const v=num(s.elektrik_tuketim_kwh100km); if(v==null) return null; const p=olcek(v,...O.ev);
    return {puan:p,notes:[],aciklama:`${nf(v)} kWh/100 km (24 kWh = 0, 14 kWh ve altı = 10)`}; }
  const v=num(s.tuketim_l100km); if(v==null) return null;
  if (f==='phev'){ const p=olcek(v,...O.phev); return {puan:p,notes:[],aciklama:`${nf(v)} l/100 km WLTP, plug-in hibrit ölçeği (2,5 l = 0, 0,5 l ve altı = 10)`}; }
  const p=olcek(v,...O.tuketim); return {puan:p,notes:[],aciklama:`${nf(v)} l/100 km (10 l = 0, 4 l ve altı = 10)`};
}
function performans(c){
  const s=c.s;
  if (num(s.sifirYuz_sn)!=null){ const p=olcek(s.sifirYuz_sn,...O.sifirYuz); return {puan:p,notes:[],aciklama:`0-100 km/s ${nf(s.sifirYuz_sn)} sn (14 sn = 0, 4,5 sn ve altı = 10)`}; }
  if (num(s.guc_hp)!=null && num(s.agirlik_kg)!=null){ const g=s.guc_hp/s.agirlik_kg*1000, p=olcek(g,...O.gucAgirlik);
    return {puan:p,notes:['0-100 süresi olmadığı için güç/ağırlık oranı kullanıldı'],aciklama:`${nf(s.guc_hp,0)} HP / ${nf(s.agirlik_kg,0)} kg = ton başına ${nf(g,0)} HP (45 = 0, 160 ve üstü = 10)`}; }
  return null;
}
function donanim(c){
  const known = DONANIM.map(f=>varlik(c.s[f])).filter(v=>v!=null);
  if (known.length < 4) return null;
  const sum=known.reduce((a,b)=>a+b,0);
  return { puan: r1(sum/known.length*10), notes: known.length<DONANIM.length?[`${DONANIM.length} donanım kaleminden ${known.length} tanesinin bilgisi var`]:[], aciklama:`bilgisi olan ${known.length} kalemden ${nf(sum)} tanesi var (opsiyonel = yarım)` };
}
function pratiklik(c){ const v=num(c.s.bagaj_l); if(v==null) return null; const p=olcek(v,...O.bagaj); return {puan:p,notes:[],aciklama:`${nf(v,0)} L bagaj (200 L = 0, 600 L ve üstü = 10)`}; }
function garanti(c){
  const s=c.s; if(num(s.garanti_yil)==null) return null;
  const p=olcek(s.garanti_yil,...O.garanti);
  const ek=[num(s.boya_garanti_yil)!=null?`boya ${s.boya_garanti_yil} yıl`:null, num(s.pas_garanti_yil)!=null?`paslanma ${s.pas_garanti_yil} yıl`:null, num(s.batarya_garanti_yil)!=null?`batarya ${s.batarya_garanti_yil} yıl`:null].filter(Boolean);
  return {puan:p,notes:[],aciklama:`${s.garanti_yil} yıl araç garantisi (2 yıl yasal asgari = 5, her ek yıl +1,25, 6 yıl ve üstü = 10)${ek.length?`; ayrıca ${ek.join(', ')} (puana katılmaz)`:''}`};
}
const KRITER = [['Güvenlik',0.30,guvenlik],['Verimlilik',0.20,verimlilik],['Performans',0.15,performans],['Donanım',0.15,donanim],['Pratiklik (bagaj)',0.10,pratiklik],['Garanti',0.10,garanti]];

const out = {};
for (const c of CARS){
  const kr=[], yok=[], notlar=[]; let wsum=0, total=0;
  for (const [ad,w,fn] of KRITER){ const r=fn(c); if(r==null){ yok.push(ad); continue; } kr.push({ad, puan:r.puan, max:10, agirlik:w, aciklama:r.aciklama||null}); notlar.push(...r.notes); wsum+=w; total+=r.puan*w; }
  out[c.id] = (kr.length>=4 && wsum>=0.6 && kr.some(x=>x.ad==='Güvenlik')) ? { toplam: r1(total/wsum), kriterler: kr, veriYokKriterler: yok, notlar } : { toplam:null, kriterler: kr, veriYokKriterler: yok, notlar:['Toplam puan için güvenlik verisi ve en az 4 kriter gerekiyor; şimdilik yalnızca alt puanlar gösteriliyor'] };
}
const stamp = new Date().toISOString().slice(0,10);
fs.writeFileSync(path.join(ROOT,'assets','puanlar.js'), `/* tools/puan_hesapla.js tarafından üretilir, elle düzenlemeyin. Tarih: ${stamp} */\nwindow.PUANLAR=${JSON.stringify(out)};\n`);
const n = Object.values(out).filter(x=>x.toplam!=null).length;
console.log(`Puan hesaplandı: ${n} / ${CARS.length} versiyon`);
