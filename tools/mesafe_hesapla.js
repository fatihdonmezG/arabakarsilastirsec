/* 81 il merkezi arasındaki karayolu mesafe ve süre tablosunu üretir.
   Koordinatlar: OpenStreetMap Nominatim (il merkezi araması).
   Mesafe/süre: OSRM table servisi, OpenStreetMap yol ağı üzerinde en hızlı rota.
   Çıktı: assets/mesafeler.js. GitHub Action içinde çalışır (tools/mesafe_hesapla.js). */
const fs = require('fs');
const path = require('path');

// [plaka, il adı, arama için merkez adı]
const ILLER = [
  [1,'Adana','Adana'],[2,'Adıyaman','Adıyaman'],[3,'Afyonkarahisar','Afyonkarahisar'],[4,'Ağrı','Ağrı'],[5,'Amasya','Amasya'],
  [6,'Ankara','Ankara'],[7,'Antalya','Antalya'],[8,'Artvin','Artvin'],[9,'Aydın','Aydın'],[10,'Balıkesir','Balıkesir'],
  [11,'Bilecik','Bilecik'],[12,'Bingöl','Bingöl'],[13,'Bitlis','Bitlis'],[14,'Bolu','Bolu'],[15,'Burdur','Burdur'],
  [16,'Bursa','Bursa'],[17,'Çanakkale','Çanakkale'],[18,'Çankırı','Çankırı'],[19,'Çorum','Çorum'],[20,'Denizli','Denizli'],
  [21,'Diyarbakır','Diyarbakır'],[22,'Edirne','Edirne'],[23,'Elazığ','Elazığ'],[24,'Erzincan','Erzincan'],[25,'Erzurum','Erzurum'],
  [26,'Eskişehir','Eskişehir'],[27,'Gaziantep','Gaziantep'],[28,'Giresun','Giresun'],[29,'Gümüşhane','Gümüşhane'],[30,'Hakkari','Hakkari'],
  [31,'Hatay','Antakya'],[32,'Isparta','Isparta'],[33,'Mersin','Mersin'],[34,'İstanbul','İstanbul'],[35,'İzmir','İzmir'],
  [36,'Kars','Kars'],[37,'Kastamonu','Kastamonu'],[38,'Kayseri','Kayseri'],[39,'Kırklareli','Kırklareli'],[40,'Kırşehir','Kırşehir'],
  [41,'Kocaeli','İzmit'],[42,'Konya','Konya'],[43,'Kütahya','Kütahya'],[44,'Malatya','Malatya'],[45,'Manisa','Manisa'],
  [46,'Kahramanmaraş','Kahramanmaraş'],[47,'Mardin','Mardin'],[48,'Muğla','Muğla'],[49,'Muş','Muş'],[50,'Nevşehir','Nevşehir'],
  [51,'Niğde','Niğde'],[52,'Ordu','Ordu'],[53,'Rize','Rize'],[54,'Sakarya','Adapazarı'],[55,'Samsun','Samsun'],
  [56,'Siirt','Siirt'],[57,'Sinop','Sinop'],[58,'Sivas','Sivas'],[59,'Tekirdağ','Tekirdağ'],[60,'Tokat','Tokat'],
  [61,'Trabzon','Trabzon'],[62,'Tunceli','Tunceli'],[63,'Şanlıurfa','Şanlıurfa'],[64,'Uşak','Uşak'],[65,'Van','Van'],
  [66,'Yozgat','Yozgat'],[67,'Zonguldak','Zonguldak'],[68,'Aksaray','Aksaray'],[69,'Bayburt','Bayburt'],[70,'Karaman','Karaman'],
  [71,'Kırıkkale','Kırıkkale'],[72,'Batman','Batman'],[73,'Şırnak','Şırnak'],[74,'Bartın','Bartın'],[75,'Ardahan','Ardahan'],
  [76,'Iğdır','Iğdır'],[77,'Yalova','Yalova'],[78,'Karabük','Karabük'],[79,'Kilis','Kilis'],[80,'Osmaniye','Osmaniye'],
  [81,'Düzce','Düzce']
];
const UA = 'arabakarsilastirsec-mesafe-tablosu/1.0 (github.com/fatihdonmezG/arabakarsilastirsec)';
const bekle = ms => new Promise(r => setTimeout(r, ms));

async function koordinat(il, merkez){
  const u = 'https://nominatim.openstreetmap.org/search?' + new URLSearchParams({q: `${merkez}, ${il}, Türkiye`, format: 'json', limit: '1', countrycodes: 'tr'});
  const r = await fetch(u, {headers: {'User-Agent': UA, 'Accept-Language': 'tr'}});
  if (!r.ok) throw new Error(`Nominatim ${r.status} ${il}`);
  const j = await r.json();
  if (!j.length) throw new Error('Bulunamadı: ' + il);
  return [+(+j[0].lat).toFixed(5), +(+j[0].lon).toFixed(5)];
}

(async () => {
  const liste = [];
  for (const [plaka, ad, merkez] of ILLER) {
    const [lat, lon] = await koordinat(ad, merkez);
    liste.push({plaka, ad, lat, lon});
    console.log(plaka, ad, lat, lon);
    await bekle(1200); // Nominatim kullanım kuralı: saniyede en çok 1 istek
  }
  const coords = liste.map(x => `${x.lon},${x.lat}`).join(';');
  const r = await fetch(`https://router.project-osrm.org/table/v1/driving/${coords}?annotations=distance,duration`, {headers: {'User-Agent': UA}});
  if (!r.ok) throw new Error('OSRM ' + r.status + ' ' + await r.text());
  const t = await r.json();
  if (t.code !== 'Ok') throw new Error('OSRM ' + t.code);
  const km = t.distances.map(s => s.map(v => v == null ? null : Math.round(v / 1000)));
  const dk = t.durations.map(s => s.map(v => v == null ? null : Math.round(v / 60)));
  const tarih = new Date().toISOString().slice(0, 10);
  const out = `/* tools/mesafe_hesapla.js tarafından üretilir, elle düzenlemeyin.
   İl merkezleri arası karayolu mesafesi (km) ve tahmini sürüş süresi (dk).
   Kaynak: OpenStreetMap katkıcıları (ODbL), OSRM en hızlı rota. Üretim: ${tarih} */
window.ILLER=${JSON.stringify(liste)};
window.MESAFE_KM=${JSON.stringify(km)};
window.MESAFE_DK=${JSON.stringify(dk)};
window.MESAFE_META=${JSON.stringify({kaynak: 'OpenStreetMap katkıcıları (ODbL), OSRM ile en hızlı karayolu rotası', url: 'https://www.openstreetmap.org/copyright', tarih})};
`;
  fs.writeFileSync(path.join(__dirname, '..', 'assets', 'mesafeler.js'), out);
  console.log('Ankara-İstanbul', km[5][33], 'km', dk[5][33], 'dk');
})().catch(e => { console.error(e); process.exit(1); });
