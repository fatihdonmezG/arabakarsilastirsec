#!/usr/bin/env node
/*
 * Sistem puanı: karsilastirma.html'deki kaynaklı verilerden her versiyon için 10 üzerinden puan hesaplar
 * ve assets/puanlar.js dosyasına yazar. Veri değiştiğinde yeniden çalıştırılır (detay_ekle.js ve teknik_yama.js bunu otomatik yapar).
 *
 * Yöntem (sistem-puani.html sayfasında da anlatılır):
 *  Kriter ve ağırlıklar: Güvenlik %30, Verimlilik %20, Performans %15, Donanım %15, Pratiklik %10, Garanti %10.
 *  Sayısal kriterler aynı gruptaki araçlara göre yüzdelik sıra ile 0–10'a çevrilir (grup: kasa tipi; verimlilikte enerji türü).
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

// Yüzdelik sıra (0–10). higher=true ise büyük değer iyi.
function pctScore(val, pool, higher){
  const xs = pool.filter(x => x != null); if (val == null || xs.length < 5) return null;
  let below = 0, eq = 0; for (const x of xs){ if (higher ? x < val : x > val) below++; else if (x === val) eq++; }
  return Math.round(((below + (eq - 1) / 2) / (xs.length - 1)) * 100) / 10;
}
const groupBy = (f) => { const g = {}; for (const c of CARS) (g[f(c)] ??= []).push(c); return g; };
const byBody = groupBy(c => bodyCat(c.s.kasa));
const poolFor = (c, key, getter, keyFn = c2 => bodyCat(c2.s.kasa)) => {
  const grp = CARS.filter(x => keyFn(x) === keyFn(c)); const vals = grp.map(getter);
  return vals.filter(v => v != null).length >= 5 ? vals : CARS.map(getter);
};

const ADAS = ['esp','abs','adaptif_hiz_sabitleyici','serit_takip','yorgunluk_tespit','geri_gorus_kamera','yokus_kalkis'];
const DONANIM = ['klima','koltuk_isitma','acilir_tavan','anahtarsiz_giris','start_stop','carplay_android_auto','dijital_gosterge','ses_sistemi'];
const r1 = x => Math.round(x * 10) / 10;

function guvenlik(c){
  const s=c.s, parts=[], notes=[];
  if (num(s.ncap_yildiz)!=null){
    let v = s.ncap_yildiz/5*10;
    if (num(s.ncap_test_yili)!=null && BUGUN_YIL - s.ncap_test_yili > 6){ v *= 0.85; notes.push(`NCAP testi ${s.ncap_test_yili} yılında yapıldı; 6 yıldan eski testlerde yıldız puanı %15 düşürülür`); }
    parts.push([v, 0.6]);
  }
  if (num(s.airbag_sayisi)!=null){ const p = pctScore(s.airbag_sayisi, poolFor(c,'ab',x=>num(x.s.airbag_sayisi)), true); if(p!=null) parts.push([p,0.15]); }
  const known = ADAS.map(f=>varlik(s[f])).filter(v=>v!=null);
  if (known.length >= 3) parts.push([known.reduce((a,b)=>a+b,0)/known.length*10, 0.25]);
  if (!parts.length || num(s.ncap_yildiz)==null && parts.length < 2) return null;
  if (num(s.ncap_yildiz)==null) notes.push('Euro NCAP sonucu yok; güvenlik puanı yalnızca donanımdan hesaplandı');
  const w = parts.reduce((a,p)=>a+p[1],0); return { puan: r1(parts.reduce((a,p)=>a+p[0]*p[1],0)/w), notes };
}
function verimlilik(c){
  const s=c.s, f=fuelCat(s.yakit);
  if (f==='elektrik'){ const v=num(s.elektrik_tuketim_kwh100km); if(v==null) return null;
    const p=pctScore(v, CARS.filter(x=>fuelCat(x.s.yakit)==='elektrik').map(x=>num(x.s.elektrik_tuketim_kwh100km)), false); return p==null?null:{puan:p,notes:['Elektrikli araçlar yalnızca birbirleriyle karşılaştırılır (kWh/100 km)']}; }
  const v=num(s.tuketim_l100km); if(v==null) return null;
  const grp = f==='phev' ? x=>fuelCat(x.s.yakit)==='phev' : x=>!['elektrik','phev'].includes(fuelCat(x.s.yakit)) && bodyCat(x.s.kasa)===bodyCat(s.kasa);
  let pool = CARS.filter(grp).map(x=>num(x.s.tuketim_l100km)); if (pool.filter(x=>x!=null).length<5) pool = CARS.filter(x=>!['elektrik','phev'].includes(fuelCat(x.s.yakit))).map(x=>num(x.s.tuketim_l100km));
  const p=pctScore(v,pool,false); return p==null?null:{puan:p,notes: f==='phev'?['Plug-in hibritler yalnızca birbirleriyle karşılaştırılır']:[]};
}
function performans(c){
  const s=c.s;
  if (num(s.sifirYuz_sn)!=null){ const p=pctScore(s.sifirYuz_sn, poolFor(c,'sy',x=>num(x.s.sifirYuz_sn)), false); if(p!=null) return {puan:p,notes:[]}; }
  if (num(s.guc_hp)!=null && num(s.agirlik_kg)!=null){ const g=x=>(num(x.s.guc_hp)!=null&&num(x.s.agirlik_kg)!=null)?x.s.guc_hp/x.s.agirlik_kg:null; const p=pctScore(g(c), poolFor(c,'pw',g), true); if(p!=null) return {puan:p,notes:['0-100 süresi olmadığı için güç/ağırlık oranı kullanıldı']}; }
  return null;
}
function donanim(c){
  const known = DONANIM.map(f=>varlik(c.s[f])).filter(v=>v!=null);
  if (known.length < 4) return null;
  return { puan: r1(known.reduce((a,b)=>a+b,0)/known.length*10), notes: known.length<DONANIM.length?[`${DONANIM.length} donanım kaleminden ${known.length} tanesinin bilgisi var`]:[] };
}
function pratiklik(c){ const v=num(c.s.bagaj_l); if(v==null) return null; const p=pctScore(v, poolFor(c,'bg',x=>num(x.s.bagaj_l)), true); return p==null?null:{puan:p,notes:[]}; }
function garanti(c){
  const g=x=>{ const s=x.s; if(num(s.garanti_yil)==null) return null; return s.garanti_yil + (num(s.boya_garanti_yil)||0)*0.25 + (num(s.pas_garanti_yil)||0)*0.1 + (num(s.batarya_garanti_yil)||0)*0.25; };
  const v=g(c); if(v==null) return null; const p=pctScore(v, CARS.map(g), true); return p==null?null:{puan:p,notes:[]};
}
const KRITER = [['Güvenlik',0.30,guvenlik],['Verimlilik',0.20,verimlilik],['Performans',0.15,performans],['Donanım',0.15,donanim],['Pratiklik (bagaj)',0.10,pratiklik],['Garanti',0.10,garanti]];

const out = {};
for (const c of CARS){
  const kr=[], yok=[], notlar=[]; let wsum=0, total=0;
  for (const [ad,w,fn] of KRITER){ const r=fn(c); if(r==null){ yok.push(ad); continue; } kr.push({ad, puan:r.puan, max:10, agirlik:w}); notlar.push(...r.notes); wsum+=w; total+=r.puan*w; }
  out[c.id] = (kr.length>=4 && wsum>=0.6 && kr.some(x=>x.ad==='Güvenlik')) ? { toplam: r1(total/wsum), kriterler: kr, veriYokKriterler: yok, notlar } : { toplam:null, kriterler: kr, veriYokKriterler: yok, notlar:['Toplam puan için güvenlik verisi ve en az 4 kriter gerekiyor; şimdilik yalnızca alt puanlar gösteriliyor'] };
}
const stamp = new Date().toISOString().slice(0,10);
fs.writeFileSync(path.join(ROOT,'assets','puanlar.js'), `/* tools/puan_hesapla.js tarafından üretilir, elle düzenlemeyin. Tarih: ${stamp} */\nwindow.PUANLAR=${JSON.stringify(out)};\n`);
const n = Object.values(out).filter(x=>x.toplam!=null).length;
console.log(`Puan hesaplandı: ${n} / ${CARS.length} versiyon`);
