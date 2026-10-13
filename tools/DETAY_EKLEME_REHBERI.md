# Araç detay kaydı ekleme rehberi

`karsilastirma.html`'deki her versiyonun `arac-detay.html`'de bir detay kaydı olmalı. Detay kaydı; geri çağırmalar, Euro NCAP, basın/sahip değerlendirmelerinden artı-eksiler ve ödülleri içerir. Teknik özellikler karşılaştırma verisinden otomatik kopyalanır.

## Hangi versiyonların detayı eksik?

```bash
node -e "
const fs=require('fs');const k=fs.readFileSync('karsilastirma.html','utf8');const d=fs.readFileSync('arac-detay.html','utf8');
const ex=new Set([...d.matchAll(/'([a-zA-Z0-9.\-]+)':\{id:'\1'/g)].map(m=>m[1]));
const s=k.indexOf('const CARS = ['),e=k.indexOf('\n];',s)+3;const C=new Function(k.slice(s,e)+';return CARS;')();
C.filter(c=>!ex.has(c.id)).forEach(c=>console.log(c.marka,'|',c.id,'|',c.model,c.yil,c.versiyon));"
```

## Araştırma kuralları (ihlal eden bilgi eklenmez)

1. **Sıfır uydurma.** Her bilgi, gerçekten açıp okuduğun bir sayfaya dayanır ve o sayfanın URL'si kaynak olarak yazılır. Emin değilsen yazma.
2. **Yasak kaynaklar:** sahibinden.com ve tüm ilan siteleri; rakip karşılaştırma siteleri (sifiraracal, arabalar.com.tr, epey, araclo, ekiyasla, otobul vb.).
3. **Geri çağırmalar** (öncelik NHTSA: `https://www.nhtsa.gov/recalls?nhtsaId=XXVXXX000` ya da `static.nhtsa.gov` PDF'i; sonra KBA, üretici duyurusu):
   - Kampanyanın kapsadığı **model yılı** bu versiyonun yılını içermiyorsa ya da kaynak açıkça başka bir motor/donanım diyorsa `recalls` listesine **ekleme**; `geriCagirmaNot` içinde "X kampanyası Y yıllarını kapsadığı için hariç tutuldu" diye yaz.
   - `tarih` mutlaka `YYYY-AA`. Kesin ay bilinmiyorsa listeye ekleme, nota yaz.
   - ABD kampanyası olduğunu `ozet`'te belirt; Türkiye'deki araçları kapsayıp kapsamadığı bilinmiyorsa bunu söyle.
   - Hiç araştıramadıysan `recalls: null` ("veri eklenmedi" görünür). Araştırdın ve bu yıl için kayıt yoksa `recalls: []`.
4. **Euro NCAP:** Sonucu yalnızca test edilen model/nesil bu versiyonla aynıysa kullan; `ncap_test_yili` ve `ncapKaynak` (euroncap.com sayfası) zorunlu. Farklı gövde/nesil/elektrikli-benzinli ayrımı varsa yıldızı yazma, `ncapNot`'ta açıkla. 6 yıldan eski testlerde "Test X yıldan eski" diye not düş.
5. **Artı-eksi (`gucluYanlar`, `dikkatEdilecekler`):** Tanınmış basın incelemeleri (What Car, Auto Express, Top Gear, Car and Driver, ADAC, Autocar, Türk otomotiv dergileri) ya da güvenilirlik anketleri (What Car? Reliability Survey, Which?). Kendi cümlelerinle, en fazla 3'er madde. İnceleme farklı motor/donanım için yapıldıysa bunu metinde belirt.
6. **Ödül:** Tam teyit edemediğin ödülü ekleme.
7. **Fiyat yazma.** Fiyat zaten karşılaştırma verisinde (yalnızca satıştaki sıfır araçlar için); detay kaydına fiyat bilgisi koyma.

## Kayıt nasıl eklenir?

1. Bulduklarını bir JSON dosyasına yaz (biçim `tools/detay_ekle.js` dosyasının başında açıklanıyor; `id` karşılaştırmadaki id'nin aynısı olmalı).
2. `node tools/detay_ekle.js yeni.json` çalıştır. Araç bu id'yle karşılaştırmada yoksa, detayda zaten varsa, tarih biçimi ya da kaynak URL'si hatalıysa script hiçbir şey eklemeden durur. Başarılı olursa sayfa üstündeki versiyon sayısını da günceller.
3. Doğrula:
   - `node -e "const h=require('fs').readFileSync('arac-detay.html','utf8');[...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach(x=>new Function(x[1]));console.log('ok')"`
   - Playwright ile (Chromium `/opt/pw-browsers/chromium`, dış istekleri engelle) birkaç yeni kaydı `arac-detay.html#<id>` ile aç: sayfa hatası yok, başlık doğru, geri çağırmalar ve artı-eksiler görünüyor.
4. Commit mesajı Türkçe; hangi markadan kaç versiyon eklendiğini ve önemli bulguları (hariç tutulan kampanyalar, NCAP uyarıları) yaz.

---

# Eksik teknik alanları doldurma

Karşılaştırmadaki versiyonların boş teknik alanları (`s` içindeki `null`/eksik alanlar) `tools/teknik_yama.js` ile doldurulur. Araç hem karşılaştırmada hem detay sayfasında güncellenir ve her alanın kaynağı `ekKaynak` olarak saklanır; sitede değerin yanında ↗ bağlantısı görünür.

## Boş alanları listeleme

```bash
node -e "
const fs=require('fs');const k=fs.readFileSync('karsilastirma.html','utf8');const s=k.indexOf('const CARS = ['),e=k.indexOf('\n];',s)+3;
const C=new Function(k.slice(s,e)+';return CARS;')();
const COMMON=['segment','kasa','yakit','sanziman','cekis','koltuk','kapi','guc_hp','tork_nm','sifirYuz_sn','hiz_kmh','uzunluk_mm','genislik_mm','yukseklik_mm','dingil_mm','agirlik_kg','bagaj_l','airbag_sayisi','ncap_yildiz','ncap_test_yili'];
const ICE=['cc','silindir','besleme','tuketim_l100km','co2_gkm','emisyon_normu','depo_l'];const EV=['batarya_kwh','menzil_km_wltp','dc_hizli_sarj_dk_20_80','elektrik_tuketim_kwh100km'];
const MARKA=process.argv[1];
C.filter(c=>!MARKA||c.marka===MARKA).forEach(c=>{const ev=/^Elektrik/i.test(c.s.yakit||'');const m=[...COMMON,...(ev?EV:ICE)].filter(f=>c.s[f]==null);if(m.length)console.log(c.id,'|',m.join(','));});" "Volkswagen"
```

## Kurallar

- Her değer, açıp okuduğun bir sayfaya dayanır (öncelik: üreticinin Türkiye sitesi, broşür/teknik katalog PDF'i, basın sitesi; sonra ultimatespecs, auto-data.net, encycarpedia gibi teknik veritabanları; NCAP için euroncap.com).
- Kaynak, **aynı model yılı, motor ve donanım** için olmalı. Başka pazarın (ör. ABD) farklı motorlu versiyonunun değerini kullanma.
- WLTP ve NEDC değerlerini karıştırma; 2026 araçlarda WLTP.
- `ncap_yildiz` yalnızca Euro NCAP'in aynı nesil/gövde için verdiği sonuçsa; `ncap_test_yili` ile birlikte gir.
- `segment` gibi sınıflandırmalar da kaynaktan gelir (üretici ya da Euro NCAP sınıfı); kendin sınıflandırma.
- Fiyat alanları bu araçla doldurulamaz.
- sahibinden yalnızca satıştan kalkmış eski modellerde, son çare, tek seferlik ve elle okunarak; `kaynakTuru:"sahibinden"`.

## Uygulama

1. Bulguları satır satır JSON olarak (JSONL) yaz: `{"id":"...","alan":"agirlik_kg","deger":1425,"kaynakAd":"...","kaynakUrl":"https://...","kaynakTuru":"birincil","sonDogrulama":"2026-10-14"}`. Sayısal değerler tırnaksız; birim alan adındaki birimle aynı olmalı (mm, kg, L, HP, Nm, sn, km/s, l/100km, g/km, kWh, km, dk).
2. `node tools/teknik_yama.js yama.jsonl`. Dolu alanlar atlanır; hata varsa hiçbir şey yazılmaz.
3. İki sayfanın sözdizimini kontrol et, karşılaştırmada güncellenen birkaç versiyonu Playwright ile aç.
