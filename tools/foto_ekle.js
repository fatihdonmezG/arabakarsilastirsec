#!/usr/bin/env node
/*
 * Araç fotoğraflarını assets/fotolar.js'e ekler: Wikimedia Commons (kaynakTuru "commons", varsayılan)
 * ya da markanın resmi basın/medya sitesi veya resmi Türkiye sitesi (kaynakTuru "basin").
 * Kullanım: node tools/foto_ekle.js fotolar.json
 * Girdi: JSON dizi. Her eleman:
 * { "marka":"Renault", "model":"Clio", "yilMin":2019, "yilMax":2026,          // karsilastirma.html'deki marka/model adlarıyla birebir
 *   "src":"https://upload.wikimedia.org/wikipedia/commons/thumb/x/xx/Dosya.jpg/1280px-Dosya.jpg",
 *   "sayfa":"https://commons.wikimedia.org/wiki/File:Dosya.jpg",
 *   "yazar":"Kullanıcı adı ya da yazar", "lisans":"CC BY-SA 4.0", "lisansUrl":"https://creativecommons.org/licenses/by-sa/4.0/",
 *   "aci":"on-3/4|yan|arka-3/4" (zorunlu; düz önden ve düz arkadan kabul edilmez; arka-3/4 yalnızca galeride ikinci fotoğraf olur),
 *   "arkaPlan":"studyo|sade|kalabalik", "baslik":"Commons dosya başlığı ya da görsel adı" }
 * Basın görseli: { ..., "kaynakTuru":"basin", "src":"https://<marka medya sitesi>/...jpg", "sayfa":"https://<görselin yayımlandığı sayfa>",
 *   "yazar":"Hyundai Türkiye", "lisans":"Basın görseli", "lisansUrl":"https://<kullanım koşulları sayfası>" }  // rakip, ilan, bayi ve haber siteleri kabul edilmez
 * Lisans yalnızca: CC0, Public domain, CC BY 2.0/2.5/3.0/4.0, CC BY-SA 2.0/2.5/3.0/4.0 (ülke uyarlamaları, ör. "CC BY-SA 3.0 de", dahil). Hata varsa hiçbir şey yazmaz.
 */
const fs=require('fs'), path=require('path');
const ROOT=path.join(__dirname,'..'), FF=path.join(ROOT,'assets','fotolar.js');
const k=fs.readFileSync(path.join(ROOT,'karsilastirma.html'),'utf8');
const s=k.indexOf('const CARS = ['), e=k.indexOf('\n];',s)+3;
const CARS=new Function(k.slice(s,e)+';return CARS;')();
const MODELS=new Set(CARS.map(c=>c.marka+'|'+c.model));
const src=fs.readFileSync(FF,'utf8');
const cur=JSON.parse(src.match(/window\.FOTOLAR = (\{[\s\S]*?\});\n/)[1]);
const { YASAK } = require('./yasak_kaynak.js');
const BASIN_YASAK=/(bayi|dealer|otomotiv\.com\.tr|sahibinden|arabam\.com|letgo|otoplus|donanimhaber|webtekno|hurriyet|milliyet|sabah|sozcu|ntv|haberturk|carwow|autocar|topgear|motor1|whatcar|google\.)/i;
const LIS=/^(CC0( 1\.0)?|Public domain|CC BY(-SA)? (2\.0|2\.5|3\.0|4\.0)( [a-z]{2})?)$/;
const input=process.argv[2]?JSON.parse(fs.readFileSync(process.argv[2],'utf8')):[];
const err=[];
for(const f of input){
  const key=f.marka+'|'+f.model, tag=`${key} ${f.yilMin}-${f.yilMax}`;
  if(!MODELS.has(key)) err.push(`${tag}: karşılaştırmada bu marka/model yok`);
  if(!/^(on-3\/4|yan|arka-3\/4)$/.test(f.aci||'')) err.push(`${tag}: aci on-3/4, yan ya da arka-3/4 olmalı (${f.aci})`);
  if((f.kaynakTuru||'commons')==='basin'){
    const h=(()=>{try{return new URL(f.src).hostname+' '+new URL(f.sayfa).hostname}catch(e){return ''}})();
    if(!/^https:\/\//.test(f.src||'')||!/^https:\/\//.test(f.sayfa||'')) err.push(`${tag}: basın görselinde src ve sayfa https olmalı`);
    if(BASIN_YASAK.test(h)||(YASAK&&YASAK.test&&YASAK.test(h))) err.push(`${tag}: kaynak rakip, ilan, bayi ya da haber sitesi (${h})`);
    if(!/basın|medya|press|media/i.test(f.lisans||'')) err.push(`${tag}: basın görselinde lisans "Basın görseli" olmalı`);
  } else {
    if(!/^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//.test(f.src||'')) err.push(`${tag}: src upload.wikimedia.org/wikipedia/commons adresi olmalı`);
    if(!/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/.test(f.sayfa||'')) err.push(`${tag}: sayfa commons dosya sayfası olmalı`);
    if(!LIS.test(f.lisans||'')) err.push(`${tag}: lisans izinli listede değil (${f.lisans})`);
  }
  if(!/^https?:\/\//.test(f.lisansUrl||'')) err.push(`${tag}: lisansUrl yok`);
  if(!(f.yazar||'').trim()) err.push(`${tag}: yazar yok`);
  if(f.yilMin!=null&&f.yilMax!=null&&f.yilMin>f.yilMax) err.push(`${tag}: yıl aralığı ters`);
  const has=CARS.some(c=>c.marka===f.marka&&c.model===f.model&&(f.yilMin==null||c.yil>=f.yilMin)&&(f.yilMax==null||c.yil<=f.yilMax));
  if(!has) err.push(`${tag}: bu yıl aralığında versiyon yok`);
}
if(err.length){ console.error('HATA, hiçbir şey yazılmadı:\n'+err.join('\n')); process.exit(1); }
for(const f of input){
  const key=f.marka+'|'+f.model, rec={yilMin:f.yilMin??null,yilMax:f.yilMax??null,src:f.src,sayfa:f.sayfa,yazar:f.yazar,lisans:f.lisans,lisansUrl:f.lisansUrl,aci:f.aci||null,arkaPlan:f.arkaPlan||null,baslik:f.baslik||null,kaynakTuru:f.kaynakTuru||'commons',...(f.kasa?{kasa:f.kasa}:{})};
  // aynı yıl aralığı ve aynı açıdan eski fotoğraf değiştirilir (önden ve arkadan fotoğraf birlikte durabilir)
  const ayniAci=x=>/^arka/.test(x.aci||'')===/^arka/.test(rec.aci||'');
  const list=(cur[key]||[]).filter(x=>!(x.yilMin===rec.yilMin&&x.yilMax===rec.yilMax&&ayniAci(x)));
  list.push(rec); cur[key]=list.sort((a,b)=>(a.yilMin??0)-(b.yilMin??0));
}
fs.writeFileSync(FF, src.replace(/window\.FOTOLAR = \{[\s\S]*?\};\n/, 'window.FOTOLAR = '+JSON.stringify(cur)+';\n'));
const covered=new Set(CARS.filter(c=>{const l=cur[c.marka+'|'+c.model];return l&&l.some(f=>(f.yilMin==null||c.yil>=f.yilMin)&&(f.yilMax==null||c.yil<=f.yilMax));}).map(c=>c.marka+'|'+c.model));
console.log(`Eklendi: ${input.length}. Fotoğrafı olan model: ${covered.size} / ${MODELS.size}`);
