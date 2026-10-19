# Donanım alanları ilerleme kaydı

Zamanlanmış görev her çalışmada 2 markanın donanım alanlarını (güvenlik, konfor, multimedya) resmi Türkiye kaynaklarından doldurur.
Durumlar: "tamamlandı" yazan markalar atlanır; "araştırıldı, bulunamadı" işaretli alanlar tekrar aranmaz.

## Markalar

| Marka | Durum | Son çalışma | Kalan boş alan (satıştaki versiyonlar) |
|---|---|---|---|
| Renault | devam ediyor | 2026-10-17 | 231 |
| Fiat | devam ediyor | 2026-10-17 | 249 |
| Toyota | devam ediyor | 2026-10-19 | 147 |
| Hyundai | devam ediyor | 2026-10-19 | 162 |

## Çalışma günlüğü

### 2026-10-17: Renault, Fiat (305 alan, 26 versiyon)

Kaynaklar: renault.com.tr modeller ve versiyonlar sayfaları, Renault Türkiye teknik broşürleri (Boreal 11.06.2026, Clio 16.09.2026, Austral 05.08.2026); fiat.com.tr model ve donanım paketi sayfaları, Grande Panda Elektrikli broşürü.

Doldurulan: Boreal (3 versiyon), Clio Evolution Plus ve Esprit Alpine, Duster (4), Austral Techno, Captur Techno, Megane E-Tech Techno, Megane Sedan Touch, Scenic Esprit Alpine, Renault 5 EV52 Techno, Rafale Esprit Alpine; Egea Sedan 1.6 Multijet (paketlerde ortak donanım), Egea Cross (4 paket), Grande Panda Icon hibrit ve La Prima elektrikli, 500e La Prima Cabrio, 500e Giorgio Armani, 600 La Prima.

Araştırıldı, bulunamadı (resmi kaynakta versiyon eşleşmesi yok):
- clio6-2026-1.2-tce-115 (manuel; donanım paketi adı belirsiz, teknik broşürde yalnızca EDC versiyonlar var): tüm donanım alanları
- renault-megane-sedan-icon-1-3-tce-edc-140-2026: Icon sayfası/broşürü bulunamadı
- renault-austral-techno-esprit-alpine-mild-hybrid-150-2026: broşürde versiyon ayrımı yok, sayfa bulunamadı
- renault-5-e-tech-techno-ev40-120-2025: Türkiye sayfasında yalnızca EV52 listeleniyor; 2025 teknik broşürü açılamadı
- Renault genel: start_stop (broşürlerde versiyon bazında yok)
- egea-sedan-2026-1.4-fire-95: Fiat sayfasında bu motor listelenmiyor
- Egea Sedan / Egea Cross: donanım paketi-motor eşleşmesi dışındaki alanlar (adaptif hız sabitleyici, navigasyon, ses sistemi, yokuş kalkış sayfada yok)
- fiat-grande-panda-1-2-mhev-la-prima-110hp-2026: hibrit La Prima sayfası açılamadı / elektrikliden ayırt edilemedi
- fiat-topolino-5-4kwh-2026, fiat-topolino-plus-5-4kwh-2026: resmi donanım listesi bulunamadı
- fiat-600-la-prima-54kwh-2026: özellikler sayfasında çoğu donanımın versiyonu belirtilmemiş
- Fiat fiyat listesi PDF'i (kampanya.fiat.com.tr) robots.txt nedeniyle okunamadı

### 2026-10-19: Toyota, Hyundai (335 alan, 25 versiyon)

Seçim notu: Renault ve Fiat'ın kalan boş alanlarının çoğu 2026-10-17'de resmi kaynakta bulunamadı olarak işaretlendiği için öncelik sırasındaki sonraki iki marka işlendi.

Kaynaklar: toyota.com.tr e-broşür sayfasındaki teknik ve donanım özellikleri PDF'leri (Corolla Ocak 2026, Corolla Hatchback Ocak 2026, Corolla Cross Nisan 2026, Yaris Cross Mart 2026, Land Cruiser Prado Eylül 2026); hyundai.com/tr model donanım sayfaları (Bayon, i30, Kona, Kona Elektrik, Tucson, Santa Fe Hibrit, IONIQ 5, IONIQ 6, IONIQ 9, Inster) ve i20 dijital broşürü.

Doldurulan: Toyota 129 alan (Corolla Sedan 4, Corolla Hatchback 2, Corolla Cross 2, Yaris Cross Dream, Land Cruiser Prado); Hyundai 206 alan (i20 2, Bayon, i30 2, Kona, Kona Elektrik, Tucson 3, Santa Fe Hybrid, IONIQ 5, IONIQ 6, IONIQ 9, Inster).

Araştırıldı, bulunamadı:
- Toyota genel: yorgunluk_tespit (listede yalnızca sürücü takip kamerası var), start_stop (listelerde yok); Corolla Sedan elektrikli_koltuk (yalnızca elektrikli bel desteği), kamera_360 ve elektrikli_bagaj (listede yok)
- toyota-chr-hybrid-1-8-flame-2026, toyota-chr-hybrid-1-8-grsport-2026: C-HR teknik donanım PDF'i açılamadı, özellikler sayfası yüklenmedi
- toyota-yaris-hybrid-1-5-flame-2026: Yaris teknik donanım PDF'i bulunamadı, özellikler sayfasında paket ayrımı yok
- toyota-hilux-2-8-mildhybrid-invincible-2026: Hilux tablosunda sütun hizası okunamadı (Invincible değerleri belirsiz)
- toyota-camry-2021-passion-2-5-hybrid: güncel e-broşür listesinde Camry yok
- Toyota Yaris Cross Dream: kör nokta, park sensörü, 360 kamera, navigasyon listede yok
- Hyundai genel: elektrikli_bagaj ("akıllı bagaj kapağı" satırı elektrikli olduğunu belirtmiyor); i20, Bayon, i30, Kona Elektrik, Inster adaptif hız sabitleyici ve kör nokta satırı yok; i20, Bayon, Santa Fe start_stop yok
- hyundai-tucson-hybrid-elite-2025: güncel sayfa 2026 donanımı, 2025 ile aynı olduğu doğrulanamadı
- hyundai-accent-blue-2018-*, hyundai-elantra-2023/2024-*: güncel Türkiye kaynağı yok
- hyundai-inster-dynamic-2026: led_far, acilir_tavan (Dynamic sütunu yok)
- hyundai-tucson-comfort-4x2-2026: acilir_tavan (S* dipnotu açıklanmamış); Tucson Comfort dijital_gosterge (yalnızca 4.2 inç gösterge)
- Kona Elektrik: kablosuz_sarj, kamera_360 satırı yok

Kontrol edilmesi gereken mevcut değerler (dokunulmadı): Tucson Comfort (iki versiyon) anahtarsiz_giris=Yok ve carplay_android_auto=Yok, Hyundai sayfasında standart görünüyor; Corolla Sedan Vision Plus ekran_inch=7, PDF'te multimedya ekranı 9 inç (7 inç gösterge).
