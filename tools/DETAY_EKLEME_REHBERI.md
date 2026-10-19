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
- `ncap_yildiz` yalnızca Euro NCAP'in aynı nesil/gövde için verdiği sonuçsa; `ncap_test_yili` ile birlikte gir.
- `segment` gibi sınıflandırmalar da kaynaktan gelir (üretici ya da Euro NCAP sınıfı); kendin sınıflandırma.
- Fiyat alanları bu araçla doldurulamaz.
- sahibinden yalnızca satıştan kalkmış eski modellerde, son çare, tek seferlik ve elle okunarak; `kaynakTuru:"sahibinden"`.

## Donanım alanları

Detay sayfasındaki "Donanım, konfor ve güvenlik" bölümü ve karşılaştırma tablosu şu alanları gösterir:

- Güvenlik ve sürüş destek: `abs`, `esp`, `otonom_acil_fren`, `adaptif_hiz_sabitleyici`, `serit_takip`, `kor_nokta`, `yorgunluk_tespit`, `yokus_kalkis`, `park_sensoru`, `geri_gorus_kamera`, `kamera_360`
- Konfor: `klima`, `koltuk_isitma`, `elektrikli_koltuk`, `deri_doseme`, `acilir_tavan`, `anahtarsiz_giris`, `elektrikli_bagaj`, `led_far`, `start_stop`
- Multimedya: `ekran_inch` (sayı, inç), `carplay_android_auto`, `kablosuz_sarj`, `navigasyon`, `dijital_gosterge`, `ses_sistemi`

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
- **Versiyon seçimi:** Her nesil için Türkiye'de en yaygın satılan 1–3 motor/şanzıman seçeneği. Donanım paketlerini tek tek değil, temsil eden birini girin. Makyajla teknik değerler belirgin değiştiyse makyajlı hal ayrı `yil` ile eklenebilir.
- **`yil`:** Teknik verinin ait olduğu model yılı (2010–2025). Aynı nesilde genelde son tam satış yılı ya da makyaj yılı seçilir.
- **`model` adı:** Aynı isim tabelası devam ediyorsa mevcut adla aynı yazılır (ör. "Clio", "Corolla", "Egea Sedan"); nesil `nesil` alanında belirtilir ("Clio IV", "Corolla E170"). Böylece detay sayfasında yıllar aynı modelin altında listelenir.
- **`donem`:** Neslin Türkiye'de satıldığı yıllar ("2012–2019"). Bilinmiyorsa yazılmaz.
- **`durum`:** Kısa ve okura dönük: "Türkiye'de satıştan kalktı; yerini Clio V aldı (2019)."
- **id biçimi:** `marka-model-yil-motor` (ör. `renault-clio-2017-1.5-dci-90`), küçük harf; mevcut id'lerle çakışmamalı.

## Kaynaklar

1. Markanın Türkiye sitesinin arşivlenmiş fiyat/teknik listesi (web.archive.org), e-broşür PDF'leri, basın bültenleri.
2. Teknik veritabanları: auto-data.net, ultimatespecs.com, encycarpedia; Euro NCAP.
3. sahibinden.com yalnızca son çare, yalnızca teknik özellik için, elle okunarak; `kaynakTuru:"sahibinden"`. Fiyat, km, ilan bilgisi asla alınmaz.
4. Rakip karşılaştırma siteleri (sifiraracal, arabalar.com.tr, epey, araclo, ekiyasla, otobul, arabakarsilastirma.com.tr, mukayese) ve diğer ilan siteleri (arabam.com vb.) kaynak olamaz.

Satıştan kalkmış araçlara **fiyat yazılmaz**. Kaynak, aynı nesil ve motor için olmalı (başka pazarın farklı motorlu versiyonu kullanılmaz). Emin olunmayan alan boş bırakılır.

## Uygulama

1. Versiyonları JSON dizi olarak yaz (biçim `tools/arac_ekle.js` başında) ve `node tools/arac_ekle.js yeni.json` çalıştır. Script hata verirse hiçbir şey yazmaz; düzelt, zorlamayla yazma.
2. Aynı id'ler için detay kaydı hazırla (Euro NCAP aynı nesil için, o model yıllarını kapsayan geri çağırmalar, basın artı-eksileri; bulunamayan bölüm `null`/boş bırakılır) ve `node tools/detay_ekle.js detay.json` çalıştır. Her yeni versiyonun detay kaydı olmalı.
3. Doğrulama: iki HTML'in sözdizimi; Playwright ile birkaç yeni versiyonu `arac-detay.html#<id>` ve `karsilastirma.html#k=<eski id>,<aynı modelin güncel id'si>` ile aç; sayfa hatası olmamalı, "Satıştan kalktı" etiketi ve dönem görünmeli, fiyat satırı "Satışta değil" olmalı.
