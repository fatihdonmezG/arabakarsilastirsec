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
