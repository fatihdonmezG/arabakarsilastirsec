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
   - **Zaman aşımı yok:** Kampanya ne kadar eski olursa olsun (10–15 yıl önce bile) o model yılını kapsıyorsa eklenir. Eski modellerde de geri çağırma araştırması zorunludur; nesil başına bir kez yapılır ve kampanyalar kapsadığı model yıllarına göre ilgili versiyonlara yazılır.
   - `recalls: null` yalnızca araştırma hiç yapılamadıysa kullanılır (sitede "henüz eklenmedi" görünür). Araştırdın ve bu yıl için kayıt yoksa `recalls: []`.
   - Detay sayfası, aynı modelin diğer yıllarına ait kampanyaları ayrıca "Bu modelin diğer yıllarındaki geri çağırmalar" başlığıyla gösterir; bu yüzden bir kampanyayı yanlış yıla yazmak yerine doğru yıla yazmak yeterlidir.
4. **Euro NCAP:** Euro NCAP'in bir model **nesline** verdiği sonuç, o neslin bütün versiyonlarına yazılır: benzinli, dizel, hibrit, elektrikli, farklı motor ve donanım paketleri arasında ayrım yapılmaz (ör. test dizel versiyonla yapıldıysa benzinli ve hibrit versiyonlar da aynı yıldızı alır; aynı neslin hatchback/sedan/SW/coupe gövdeleri de aynı sonucu paylaşır). Ayrım yalnızca **nesil** içindir: önceki neslin sonucu yeni nesle yazılmaz. `ncap_test_yili` ve `ncapKaynak` zorunlu. 6 yıldan eski testlerde "Test X yıldan eski" diye not düş.
5. **Artı-eksi (`gucluYanlar`, `dikkatEdilecekler`):** Tanınmış basın incelemeleri (What Car, Auto Express, Top Gear, Car and Driver, ADAC, Autocar, Türk otomotiv dergileri) ya da güvenilirlik anketleri (What Car? Reliability Survey, Which?). Kendi cümlelerinle, en fazla 3'er madde. İnceleme farklı motor/donanım için yapıldıysa bunu metinde belirt.
6. **Ödül:** Tam teyit edemediğin ödülü ekleme.
7. **Fiyat yazma.** Fiyat yalnızca 2026 model yılı, satıştaki sıfır araçlarda ve yalnızca resmi fiyat listesinden karşılaştırma verisine girilir; 2026 dışındaki araçlar için fiyat araştırılmaz. Detay kaydına fiyat bilgisi koyma.

## Kayıt nasıl eklenir?

1. Bulduklarını bir JSON dosyasına yaz (biçim `tools/detay_ekle.js` dosyasının başında açıklanıyor; `id` karşılaştırmadaki id'nin aynısı olmalı).
2. `node tools/detay_ekle.js yeni.json` çalıştır. Araç bu id'yle karşılaştırmada yoksa, detayda zaten varsa, tarih biçimi ya da kaynak URL'si hatalıysa script hiçbir şey eklemeden durur. Başarılı olursa sayfa üstündeki versiyon sayısını da günceller.
3. Doğrula:
   - `node -e "const h=require('fs').readFileSync('arac-detay.html','utf8');[...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach(x=>new Function(x[1]));console.log('ok')"`
   - Playwright ile (Chromium `/opt/pw-browsers/chromium`, dış istekleri engelle) birkaç yeni kaydı `arac-detay.html#<id>` ile aç: sayfa hatası yok, başlık doğru, geri çağırmalar ve artı-eksiler görünüyor.
4. Commit mesajı Türkçe; hangi markadan kaç versiyon eklendiğini ve önemli bulguları (hariç tutulan kampanyalar, NCAP uyarıları) yaz.

## Sitede görünen metinlerin dili

Sitedeki her metin (notlar, açıklamalar, artı-eksiler, geri çağırma özetleri) bir otomotiv editörünün yazacağı gibi yazılır:

- Kısa ve doğrudan cümleler. Süreç anlatılmaz: "bu oturumda", "araştırmamızda bulamadık", "erişemedik", "uydurmuyoruz", "tahmin yazmıyoruz" gibi ifadeler kullanılmaz. Bilgi yoksa alan boş bırakılır, açıklama yazılmaz.
- Kod ve alan adları metne girmez (`s.guc_hp`, `RECALLS`, `ncap_yildiz` vb.).
- "ÖNEMLİ:", "NOT:" gibi büyük harfli etiketler yerine gerekiyorsa "Not:" yazılır; tamamı büyük harfli kelimeler kullanılmaz.
- Uzun tire (—) yerine virgül, iki nokta ya da nokta tercih edilir.
- Belirsizlik gerçekten okuru ilgilendiriyorsa tek cümleyle ve okura dönük söylenir: "Türkiye'deki araçların kapsamı açıklanmadı; şasi numarasıyla yetkili serviste sorgulatın."
- Kod içine yorum (`/* ... */`) yazılmaz; kayıtların nasıl araştırıldığı commit mesajında anlatılır.

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
- **Aralık verilen değerler:** Kaynak bir değeri aralık olarak veriyorsa (ör. WLTP tüketim "5,8–6,1 l/100 km", CO₂ "131–139 g/km", menzil, ağırlık) aralığın ortasını yaz (5,95; 135) ve kaynak adına aralığı ekle: "... (5,8–6,1 l/100 km aralığının ortası)". Pakete açıkça karşılık gelen tek değer varsa onu yaz.
- **Boş bırakma eşiği:** Kullanıcılar boş alanlardan şikâyetçi. Değer resmi Türkiye kaynağında yoksa aynı motor, şanzıman ve gövde için üreticinin Avrupa kaynağı, ardından ultimatespecs, auto-data.net, encycarpedia, autotijd gibi teknik veritabanları kullanılabilir. Aynı motor ve şanzımanla satılan donanım paketleri aynı değeri paylaşabilir. Yalnızca hiçbir kaynakta bulunamayan değer boş kalır.
- `ncap_yildiz`: Euro NCAP'in aynı nesil için verdiği sonuç; motor, yakıt türü, donanım ve gövde ayrımı yapılmaz. `ncap_test_yili` ile birlikte gir.
- `segment` gibi sınıflandırmalar da kaynaktan gelir (üretici ya da Euro NCAP sınıfı); kendin sınıflandırma.
- Fiyat alanları bu araçla doldurulamaz.
- sahibinden yalnızca satıştan kalkmış eski modellerde, son çare, tek seferlik ve elle okunarak; `kaynakTuru:"sahibinden"`.

## Donanım alanları

Detay sayfasındaki "Donanım, konfor ve güvenlik" bölümü ve karşılaştırma tablosu şu alanları gösterir:

- Güvenlik ve sürüş destek: `abs`, `esp`, `otonom_acil_fren`, `adaptif_hiz_sabitleyici`, `serit_takip`, `kor_nokta`, `yorgunluk_tespit`, `yokus_kalkis`, `park_sensoru`, `geri_gorus_kamera`, `kamera_360`
- Konfor: `klima`, `arka_klima_cikisi`, `koltuk_isitma`, `elektrikli_koltuk`, `deri_doseme`, `acilir_tavan`, `anahtarsiz_giris`, `elektrikli_bagaj`, `led_far`, `start_stop`
- Multimedya: `ekran_inch` (sayı, inç), `carplay_android_auto`, `kablosuz_sarj`, `navigasyon`, `dijital_gosterge`, `ses_sistemi`

**Klima tipi zorunlu:** `klima` alanına yalnızca "Var" yazılmaz; tipi yazılır: `"Manuel"`, `"Otomatik (dijital)"`, `"Otomatik (çift bölgeli)"`, `"Otomatik (3 bölgeli)"`, `"Otomatik (4 bölgeli)"`. Mevcut değeri yalnızca "Var" olan klimalar `teknik_yama.js` ile tipiyle güncellenebilir. `arka_klima_cikisi`: arka yolculara klima/havalandırma çıkışı ("Var", "Yok", "Var (orta konsolda)").

**Şanzıman:** `sanziman` alanı tipi ve vites sayısını içerir: ör. `"Otomatik (8 ileri, tork konvertörlü)"`, `"Çift kavramalı otomatik (7 ileri DSG)"`, `"e-CVT"`, `"Tek vitesli (elektrikli)"`, `"Manuel (6 ileri)"`. Yalnızca "Otomatik" yazmaktan kaçının; tip biliniyorsa yazın.

Değer biçimi: `"Var"`, `"Yok"`, `"Opsiyonel"` ya da kısa açıklamayla `"Var (çift bölgeli otomatik)"`, `"Var (ön ve arka)"`. Kaynak öncelikle markanın Türkiye fiyat listesi / donanım listesi PDF'i; donanım versiyona (donanım paketine) göre değiştiği için yalnızca o versiyonun sütunundaki bilgi girilir.

## Uygulama

1. Bulguları satır satır JSON olarak (JSONL) yaz: `{"id":"...","alan":"agirlik_kg","deger":1425,"kaynakAd":"...","kaynakUrl":"https://...","kaynakTuru":"birincil","sonDogrulama":"2026-10-14"}`. Sayısal değerler tırnaksız; birim alan adındaki birimle aynı olmalı (mm, kg, L, HP, Nm, sn, km/s, l/100km, g/km, kWh, km, dk).
2. `node tools/teknik_yama.js yama.jsonl`. Dolu alanlar atlanır; hata varsa hiçbir şey yazılmaz.
3. İki sayfanın sözdizimini kontrol et, karşılaştırmada güncellenen birkaç versiyonu Playwright ile aç.

---

# Araç fotoğrafı ekleme (Wikimedia Commons)

Fotoğraflar yalnızca Wikimedia Commons'tan, serbest lisanslı dosyalardan gelir ve `assets/fotolar.js` içinde **model + model yılı aralığı** başına bir kayıt olarak tutulur (aynı modelin tüm versiyonları aynı fotoğrafı kullanır). Sitede fotoğrafın altında yazar, lisans ve Commons sayfası bağlantısı otomatik görünür; fotoğrafı olmayan araçlarda çizim gösterilir.

## Seçim kuralları

1. **Doğru nesil.** Fotoğraftaki araç, versiyonun nesliyle aynı olmalı (ör. 4116 mm Clio = Clio VI). Aynı nesilde makyaj öncesi/sonrası farkı varsa makyajlı hali tercih edilir; makyajsız foto ancak başka seçenek yoksa ve fark küçükse kullanılır. Farklı rozet (Dacia Duster ≠ Renault Duster), farklı pazar modeli (Çin'e özel Tayron, Çin Camry'si) ya da farklı kasa (SW/Combi yerine sedan) kullanılmaz; uygun foto yoksa boş bırakılır.
2. **Açı ve arka plan:** önden 3/4 ya da yandan, araç kadrajı dolduruyor, arka plan sade. Arkadan çekim, iç mekân, kalabalık fuar çekimi, polis/taksi/kiralık araç kaplamaları, yarış livreleri seçilmez.
2b. **Uzaktan çekim yok:** Araç karenin büyük kısmını kaplamalı ve dört tarafında da kenara değmeden tamamen görünmeli (arka planı otomatik kaldırılabilsin). Çit, çim, yol ya da bina arkasında küçük görünen araç fotoğrafı kullanılmaz; `tools/foto_kes.py` aracın karenin %10'undan azını kapladığı fotoğrafları "uzaktan çekim" diye reddeder ve sitede bu fotoğraf yerine amblem kartı gösterilir. Fuar ya da açık alanda yakından, önden 3/4 çekimler (ör. Alexander-93, M 93, Matti Blume çekimleri) en iyi sonucu verir.
3. **Yatay ve yeterli çözünürlük:** genişlik ≥ 1500 px, en/boy ≥ 1,25.
4. **Lisans:** CC0, Public domain, CC BY / CC BY-SA 2.0–4.0 (ülke uyarlamaları dahil). Yazar ve lisans Commons'taki `Artist` ve `LicenseShortName` alanlarından aynen alınır.
5. İyi kaynaklar: Wikipedia makale bilgi kutusundaki görsel (genelde güncel neslin temiz önden 3/4 fotoğrafı); Commons'ta "M 93" (`– f TARİH` = önden), Alexander Migl / Alexander-93, Vauxford, MoCars, Damian B Oh dosyaları.

## Veriyi alma

Commons API'si (`https://commons.wikimedia.org/w/api.php`) tek istekte küçük resim adresi, lisans ve yazarı verir:

```
?action=query&generator=search&gsrnamespace=6&gsrsearch="Marka Model" filetype:bitmap&gsrlimit=12&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1280&format=json
```

Wikipedia bilgi kutusu görseli: `https://en.wikipedia.org/w/api.php?action=query&redirects=1&prop=pageimages&piprop=name&format=json&titles=Hyundai Kona`

Bulut ortamının kabuğu Wikimedia'ya erişemez; API, kullanıcının bilgisayarındaki tarayıcı panelinden (commons.wikimedia.org sayfası açıkken `fetch`) okunur.

## Ekleme

1. JSON dizi hazırla (biçim `tools/foto_ekle.js` başında). `src` = API'deki `thumburl` (1280px, `upload.wikimedia.org/wikipedia/commons/thumb/...`), `sayfa` = `descriptionurl`, `baslik` = Commons dosya adı.
2. `node tools/foto_ekle.js fotolar.json`. Marka/model karşılaştırmada yoksa, lisans izinli değilse, adresler Commons değilse hiçbir şey yazmaz. Sonda kaç modelin fotoğrafı olduğunu yazar.
3. araclar.html, arac-detay.html ve karsilastirma.html'de birkaç modeli aç; fotoğraf ve kredi satırı görünmeli.

---

# Eski modelleri (2010–2025) ekleme

Amaç: Türkiye'de 2010–2025 arasında satılmış, bugün satışta olmayan model ve nesilleri veritabanına eklemek. İlerleme `tools/eski_model_ilerleme.md` dosyasında tutulur.

## Hangi modeller, hangi versiyonlar?

- **Marka sırası** (Türkiye satış hacmine göre): Renault, Fiat, Volkswagen, Hyundai, Toyota, Ford, Peugeot, Mercedes-Benz, Skoda, Opel, Citroën, Dacia, BMW, Kia, Nissan, Honda, Audi, Seat, Volvo, Mazda, Suzuki, Chevrolet, Mitsubishi, Jeep, Alfa Romeo, Land Rover, Mini, Subaru, Lexus, Porsche, Infiniti, DS, Cupra, Lancia, Saab ve diğerleri. Togg'un eski modeli yoktur.
- **Kapsam:** Markanın Türkiye'de 2010–2025 arasında satılan binek modellerinin (otomobil, SUV, MPV, pick-up; hafif ticari panelvanlar hariç) her **nesli**. Nesil Türkiye'de satıldığına dair kaynak olmalı (marka Türkiye sitesi/arşivi, basın bülteni, ODMD satış verisi, Türk otomotiv basını).
- **Kapsam her model yılıdır:** Bir model 2010–2025 arasında Türkiye'de hangi yıllarda satıldıysa, **her model yılı** ayrı versiyon olarak girilir (ör. Clio IV için 2013, 2014, …, 2019). Her yıl için o yıl Türkiye'de sunulan motor/şanzıman seçenekleri girilir; donanım paketleri tek tek değil, her motor/şanzıman için temsil eden bir paket.
- **Yıllar arası tekrar:** Teknik değerleri birkaç yıl aynı kalan versiyon için `yillar: [2013, 2014, 2015]` kullanılır (bkz. `tools/arac_ekle.js`); motor gamı, güç, tüketim ya da makyaj değiştiği yıldan itibaren yeni kayıt açılır. Bir motorun o yıl Türkiye'de satıldığı kaynakla gösterilemiyorsa o yıl eklenmez.
- **`yil`:** Versiyonun model yılı (2010–2025).
- **`model` adı:** Aynı isim tabelası devam ediyorsa mevcut adla aynı yazılır (ör. "Clio", "Corolla", "Egea Sedan"); nesil `nesil` alanında belirtilir ("Clio IV", "Corolla E170"). Böylece detay sayfasında yıllar aynı modelin altında listelenir.
- **`donem`:** Neslin Türkiye'de satıldığı yıllar ("2012–2019"). Bilinmiyorsa yazılmaz.
- **`durum`:** Kısa ve okura dönük: "Türkiye'de satıştan kalktı; yerini Clio V aldı (2019)."
- **id biçimi:** `marka-model-yil-motor` (ör. `renault-clio-2017-1.5-dci-90`), küçük harf; mevcut id'lerle çakışmamalı.

## Kota tasarrufu (eski modeller)

- **Detay kaydı sade:** Eski modellerde yalnızca Euro NCAP (aynı nesil, test yılıyla) ve geri çağırmalar araştırılır. Basın artı-eksileri (`gucluYanlar`, `dikkatEdilecekler`), ödüller ve küçük detaylar araştırılmaz, boş bırakılır.
- **Nesil başına bir kez:** NCAP ve geri çağırma araştırması nesil başına bir kez yapılır ve `"ids": [...]` ile o neslin bütün yıllarına yazılır.
- **Nesil başına tek teknik kaynak:** Bir neslin bütün motorlarını tek sayfada veren kaynak tercih edilir (ör. auto-data.net nesil sayfası, markanın o neslin teknik broşürü). Türkiye'de hangi yıllar ve motorlarla satıldığı nesil başına bir kez, mümkünse tek kaynakla (marka Türkiye arşivi/fiyat listesi, basın bülteni) gösterilir; yıl yıl ayrı sayfa açılmaz.
- **Önce çok satanlar:** Marka içinde Türkiye'de çok satmış modellerden başlanır (ör. Renault: Clio, Megane, Fluence, Symbol, Captur, Kadjar, Talisman; Fiat: Linea, Egea, Doblo, Punto, Fiorino Combi). Düşük hacimli modeller, özel ve sınırlı seriler markanın sonuna bırakılır.
- Aynı sayfayı ikinci kez açma; okuduğun sayfadan gereken tüm alanları tek seferde çıkar.

## Kaynaklar

1. Markanın Türkiye sitesinin arşivlenmiş fiyat/teknik listesi (web.archive.org), e-broşür PDF'leri, basın bültenleri.
2. Teknik veritabanları: auto-data.net, ultimatespecs.com, encycarpedia; Euro NCAP.
3. sahibinden.com yalnızca son çare, yalnızca teknik özellik için, elle okunarak; `kaynakTuru:"sahibinden"`. Fiyat, km, ilan bilgisi asla alınmaz.
4. Rakip karşılaştırma siteleri (sifiraracal, arabalar.com.tr, epey, araclo, ekiyasla, otobul, arabakarsilastirma.com.tr, mukayese) ve diğer ilan siteleri (arabam.com vb.) kaynak olamaz.

**Fiyat yalnızca 2026 model yılı, Türkiye'de satıştaki sıfır araçlar için yazılır.** 2026 dışındaki hiçbir araç için fiyat araştırılmaz ve yazılmaz (ikinci el fiyatı dahil). Kaynak, aynı nesil ve motor için olmalı (başka pazarın farklı motorlu versiyonu kullanılmaz). Emin olunmayan alan boş bırakılır.

## Uygulama

1. Versiyonları JSON dizi olarak yaz (biçim `tools/arac_ekle.js` başında) ve `node tools/arac_ekle.js yeni.json` çalıştır. Script hata verirse hiçbir şey yazmaz; düzelt, zorlamayla yazma.
2. Aynı id'ler için detay kaydı hazırla; aynı nesildeki yıllar aynı NCAP ve geri çağırma araştırmasını paylaşabilir, bunun için `"ids": [...]` kullan (bkz. `tools/detay_ekle.js`). (Euro NCAP aynı nesil için, o model yıllarını kapsayan geri çağırmalar, basın artı-eksileri; bulunamayan bölüm `null`/boş bırakılır) ve `node tools/detay_ekle.js detay.json` çalıştır. Her yeni versiyonun detay kaydı olmalı.
3. Doğrulama: iki HTML'in sözdizimi; Playwright ile birkaç yeni versiyonu `arac-detay.html#<id>` ve `karsilastirma.html#k=<eski id>,<aynı modelin güncel id'si>` ile aç; sayfa hatası olmamalı, "Satıştan kalktı" etiketi ve dönem görünmeli, fiyat satırı "Satışta değil" olmalı.

## Yasaklı kaynak temizliği (kademeli)

Rakip karşılaştırma siteleri (sifiraracal, arabakarsilastirma.com.tr, arabalar.com.tr, epey, mukayese, araclo, ekiyasla, otobul) ve ilan siteleri (arabam.com vb.) hiçbir alan için kaynak olamaz. Geçmişte bu sitelerle girilmiş kayıtlar resmi kaynaklara taşınıyor.

1. Listeyi al: `node tools/yasak_kaynak.js` (marka özeti), `node tools/yasak_kaynak.js --marka Volkswagen` (ayrıntı).
2. Markanın resmi Türkiye kaynağını bul: güncel fiyat listesi, teknik özellik sayfası ya da e-broşür PDF'i. Satıştan kalkmış eski modellerde markanın o yıla ait broşürü ya da basın bülteni; bulunamazsa son çare olarak teknik veri için sahibinden (`kaynakTuru:"sahibinden"`). Üretici küresel basın sitesi (ör. media.*) ikincil kaynak olarak kullanılabilir.
3. Kaydın her dolu alanını yeni kaynakla karşılaştır:
   - Kaynakta aynı değer varsa dokunma.
   - Kaynakta farklı değer varsa `alan_kaynak` ile `deger` vererek düzelt.
   - Ana kaynakta olmayıp başka bir resmi kaynakta bulduğun değer için `alan_kaynak` (değer vermeden) yaz.
   - Hiçbir resmi kaynakta doğrulanamayan değeri `alan_sil` ile sil. Tahmin ya da yuvarlama yapma.
   - Fiyat (`liste_fiyati_tl`) yalnızca 2026 model yılında ve yalnızca markanın resmi fiyat listesinden; değilse sil.
4. Ana kaynağı `ana_kaynak` ile değiştir. Detay kaydında (artılar, küçük detaylar, durum metni) yasaklı kaynak varsa `detay_deger` ile resmi kaynağa çevir ya da `detay_sil` ile kaldır.
5. JSONL'i önce `node tools/kaynak_degistir.js temizlik.jsonl --kuru` ile dene, sonra kurusuz uygula. Araç kalan yasaklı kayıt sayısını yazar.
6. tools/kaynak_temizlik.md dosyasına tarih, marka, temizlenen versiyon sayısı, silinen alanlar (id ve alan adıyla) ve kalan sayıyı yaz.

teknik_yama.js, detay_ekle.js ve arac_ekle.js yasaklı kaynakları artık reddeder.

## Puanı açan eksik veriler

Toplam sistem puanı için Güvenlik kriteri zorunlu, en az 4 kriter ve toplam ağırlığın en az %60'ı gerekir. `node tools/puan_eksik.js` puansız versiyonları, `--alan` hangi alanın kaç versiyonu açtığını, `--marka X` her versiyon için gereken en az alanı gösterir.
- Güvenlik: Euro NCAP yıldızı (nesil bazlı; tek sonuç `ncap_yay.js` ile bütün nesle yayılır, en verimli yol budur). Euro NCAP'in hiç test etmediği modellerde (ör. Rolls-Royce, Bentley, Ferrari, Lamborghini, Aston Martin, bazı Çin markaları) hava yastığı sayısı + en az 3 sürüş destek kalemi (esp, abs, otonom_acil_fren, adaptif_hiz_sabitleyici, serit_takip, kor_nokta, yorgunluk_tespit, geri_gorus_kamera, yokus_kalkis).
- Aynı neslin farklı adla satılan ikizi Euro NCAP'te test edildiyse (ör. Renault Symbol III ↔ Dacia Logan II) `ncap_yay.js --esle` kullanılabilir; yalnızca gerçekten aynı gövde ve platform ise ve kaynak bunu söylüyorsa.
- Bagaj hacmi bir versiyonda bulunduğunda `node tools/bagaj_yay.js` aynı nesil, aynı kasa, aynı güç tipi (içten yanmalı/hafif hibrit, tam hibrit, plug-in, elektrikli) ve aynı çekiş türündeki diğer versiyonlara yayar. Farklı nesle yaymaz. Bu yüzden bagajı her grubun yalnızca bir versiyonu için araştırmak yeterlidir.
- Eski modellerde garanti (sıfırken verilen) zor bulunur; puan için genellikle tüketim, 0-100 (ya da ağırlık), bagaj yeterlidir.

## Fotoğrafı aynı nesle yayma

`node tools/foto_yay.js` her fotoğrafın kapsadığı versiyonların nesil adını bulur ve fotoğrafı aynı marka + model + nesildeki fotoğrafsız yıllara yayar (kasa değişmediği için). Farklı nesle yaymaz; kapsadığı kayıtlarda nesil yazılı değilse atlar. Yeni eski model yılları eklendikten sonra ya da bir 2026 kaydına nesil adı yazıldıktan sonra çalıştırılır. 2026 kaydına nesil yazmak için: `{"id":"...","islem":"detay_deger","yol":"nesil","deger":"Egea Sedan (makyajlı)"}` satırıyla `node tools/kaynak_degistir.js`. Nesil adı, eski model kayıtlarındaki adla birebir aynı olmalı ve yalnızca kasa gerçekten aynıysa (aynı makyaj dönemi) yazılır.

## Satıştaki araçların geri çağırmaları

`node tools/geri_cagirma_yaz.js --liste --satista` araştırılmamış (null) versiyonları marka | model | nesil grubunda listeler; `--marka X` grup içindeki id'leri verir. Aynı nesil aynı kampanyaları paylaşır, grup başına bir araştırma yapılır.
- Kaynaklar: NHTSA (static.nhtsa.gov / nhtsa.gov), KBA Rückrufdatenbank, EU Safety Gate, Transport Canada, üretici ya da Türkiye distribütörü duyurusu. Şikâyet ve forum yazıları geri çağırma değildir.
- Zaman sınırı yok; neslin üretim başından bu yana bütün kampanyalar. Kampanya belirli model yıllarını ya da motorları kapsıyorsa yalnızca o versiyonlara yaz ("kapsam" alanı). Türkiye'deki kapsamı açıklanmamışsa özet ya da çözüm metnine "Türkiye'deki araçların kapsamı açıklanmadı; şasi numarasıyla yetkili serviste sorgulatın." ekle.
- Araştırıp kampanya bulamadıysan `"recalls": []` yaz (null kalmaz). Yalnızca hiç araştıramadıysan null bırak.
- Biçim: {"tarih":"YYYY-AA","parca":"kısa parça adı","baslik":"...","ozet":"...","cozum":"...","kaynak":"https://..."}; metinler kendi cümlelerinle, uzun tire yok.
- Yazma: `node tools/geri_cagirma_yaz.js kampanyalar.json --kuru`, sonra kurusuz.

# Resmi marka bağlantıları (teklif, test sürüşü, servis)

`assets/marka_linkleri.js` marka başına markanın resmi Türkiye sitesindeki sayfaları tutar: `teklif`, `test`, `bayi`, `servis` (randevu formu), `bakim` (bakım paketi/fiyat sayfası). Detay sayfasında satıştaki araçlar için satın alma ve servis bağlantıları, satıştan kalkmış araçlar için yalnızca servis bağlantıları gösterilir; karşılaştırma başlığında en çok iki kısa bağlantı çıkar.
- Yalnızca markanın resmi alan adı (bayi alt alan adları değil, ana site). İlan ve karşılaştırma siteleri kullanılmaz.
- Giriş (üyelik) isteyen, mobilde açılmayan ya da sık değişen PDF bağlantıları eklenmez. Bulunamayan tür boş bırakılır; düğme görünmez.
- Yeni marka eklerken sayfayı açıp türünü doğrula (ör. "bilgi talep formu" `teklif`tir, `test` değil).
- Kontrol: `node tools/link_kontrol.js` (normal internet erişimi olan bir makinede). 4xx/5xx ya da bağlantı hatası verenleri yeniden bul ya da kaldır.
