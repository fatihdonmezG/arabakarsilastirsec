# Geri çağırma ilerlemesi (satıştaki araçlar)

Kaynak listesi: `node tools/geri_cagirma_yaz.js --liste --satista`

## Çalışmalar

| Tarih | Marka | Araştırılan nesil grupları | Yazılan versiyon | Yazılan kampanya | Kalan (satışta, araştırılmamış) |
|---|---|---|---|---|---|
| 2026-10-26 | Volkswagen | Taigo, T-Cross, Passat (B9), Touareg (2025) kayıt yok olarak yazıldı; Golf, Golf GTI, Golf R, Tiguan, Tayron, T-Roc, ID.4, ID.7 araştırılamadı | 10 | 0 | 319 versiyon |
| 2026-10-27 | Nissan, Skoda | Nissan Qashqai (e-Power 1 kampanya, 1.3 DIG-T kayıt yok), X-Trail 1.5 VC-T (kayıt yok); Skoda Fabia, Octavia, Superb, Kodiaq, Scala, Kamiq, Karoq, Enyaq Coupe, Elroq, Enyaq araştırılamadı | 15 | 1 | 304 versiyon |
| 2026-10-28 | Hyundai | Tucson 2026 (2 kampanya), Tucson Hybrid 2025 (3), Kona 2026 (2), Santa Fe Hybrid 2026 (1), IONIQ 6 2026 (1); Kona Electric, IONIQ 5, IONIQ 9, Inster, i20, i30, Bayon araştırılamadı. Renault ve Skoda için KBA/Safety Gate resmi sayfaları yine açılamadı | 7 | 13 kayıt (6 ayrı kampanya) | 297 versiyon |
| 2026-10-29 | Volvo, Kia, Toyota | Volvo XC90 (2: T8 fren yazılımı 25V392, B5 emniyet kemeri 25V589), XC60 (aynı 2), EX30 ve EX30 Cross Country (1: baş desteği 26V671), EX40 (1: tek pedal fren yazılımı 25V392); Kia Sorento Hybrid (1: gösterge paneli 26V046), EV9 (1: gösterge paneli, Transport Canada 2026032), Niro EV kayıt yok; Toyota Land Cruiser Prado kayıt yok. Volvo V60, EC40 ve Kia EV6 araştırılamadı | 15 | 13 kayıt (6 ayrı kampanya) | 282 versiyon |

## Araştırılamadı

Bu gruplar null bırakıldı. Ortak neden: KBA Rückrufdatenbank (kba-online.de/rrdb, /gpsg) bu ortamdan açılamadı; ilgili kampanyalar yalnızca basında görüldü, resmi sayfa (KBA, Safety Gate, NHTSA, üretici) bulunamadı. KBA erişimi sağlanınca yeniden bakılmalı.

- Volkswagen | T-Roc | 2026: KBA 16132R / VW 48AX rot kolu cıvatası, üretim 06.09.2025 - 05.02.2026 (basın, Mart 2026). Büyük olasılıkla kapsıyor.
- Volkswagen | ID.4 | 2025: KBA 17137R / 17101R, VW 93MF / 93MV yüksek gerilim batarya hücreleri, üretim 2022 - 06.2025 (basın, Ekim 2026).
- Volkswagen | ID.7 | 2025: aynı batarya kampanyası; ayrıca VW 69UK ön yolcu hava yastığı, üretim 17.05.2022 - 27.05.2025 (basın, Ağustos 2025).
- Volkswagen | Golf | 2026, Golf GTI | 2026, Golf R | 2026, Tiguan | 2026, Tayron | 2026: VW 48AA direksiyon motoru yazılımı (Avustralya REC-006602, 2025-2026 model yılı, tüm varyantlar; tarih ve Avrupa kapsamı belirsiz) ve 48JP (REC-006592, 2024-2025). Avrupa karşılığı bulunamadı. Golf GTI ve Golf R için ayrıca NHTSA 25V638 ön emniyet kemeri sarıcısı (yalnızca ABD 2025 model yılı) hariç tutuldu.

- Skoda | Octavia | 2026, Karoq | 2026: KBA 17091R / Skoda 48LS direksiyon bağlantı cıvatası, üretim 11.2015 - 08.2026, Octavia III-IV, Karoq, Kodiaq I, Superb III (basın ve car-recalls.eu, Ekim 2026). Büyük olasılıkla kapsıyor; resmi sayfa açılamadı.
- Skoda | Kodiaq | 2026: Avustralya REC-006554 / Skoda 72SG ön koltuk iç çerçeve kenarı yan hava yastığına zarar verebilir (2024-2025 model yılı, yayın tarihi ve üretim aralığı sayfada yok). 2026 kapsamı belirsiz. 48LS yalnızca Kodiaq I'i kapsıyor.
- Skoda | Superb | 2026: 48LS yalnızca Superb III'ü kapsıyor; başka kampanya resmi kaynakta doğrulanamadı.
- Skoda | Fabia, Scala, Kamiq, Enyaq, Enyaq Coupe, Elroq | 2026: KBA ve DVSA erişilemedi, Safety Gate aramasında kayıt çıkmadı; kampanya olmadığı doğrulanamadığı için null bırakıldı.
- Erişim notu (2026-10-27): kba-online.de ve check-vehicle-recalls.service.gov.uk proxy tarafından reddediliyor (403); vehiclerecalls.gov.au ve ec.europa.eu Safety Gate PDF'leri arama sonucu üzerinden açılabiliyor. Bu iki alan izinli alanlara eklenirse Skoda grupları tamamlanabilir.

- Hyundai | Kona Electric, IONIQ 5, IONIQ 9 | 2026: ABD kampanyaları (NHTSA 26V068 batarya bara cıvatası, 26V314 arka süspansiyon cıvataları, 26V432 SK On batarya hücreleri) ABD'deki HMGMA fabrikasında üretilen ya da 2023-2024 araçları kapsıyor; Avrupa'ya giden Kore ve Çekya üretimi araçlar için Safety Gate/KBA kontrolü yapılamadı. IONIQ 9 için AU REC-006589 yalnızca 2025 model yılını kapsıyor.
- Hyundai | Inster, i20, i30, Bayon | 2026: ABD ve Kanada'da satılmıyor; Avrupa kaynakları (KBA, Safety Gate) erişilemedi.
- Hyundai notu: NHTSA 26V047 (çok modelli gösterge paneli yazılımı, Ocak 2026) model yılları netleşmediği için yazılmadı. ABD fabrikasına özgü montaj kampanyaları (25V549 biyel cıvatası, 25V809 perde hava yastığı, 26V254 B direği sensörü) Avrupa üretimi Tucson ve Santa Fe için hariç tutuldu.
- Renault (2026-10-28 denemesi): car-recalls.eu kayıtlarına göre 0EY9 park freni (OR/00145/25, üretim 12.04.2024 - 07.05.2025; Austral, Captur, Megane E-Tech, Rafale, Scenic E-Tech, Symbioz, Espace) ve 0EN9 Austral ABS-ESP (SR/01910/26, üretim 03.2023 - 01.2025) var; Captur için 2025-2026 çekiş bataryası bara montajı (Ekim 2026). Safety Gate detay sayfaları ve PDF'leri arama sonucunda çıkmadığı için açılamadı.

- Volvo | V60 | 2026, EC40 | 2026 (2026-10-29): tek aday AB Safety Gate SR/03370/25 (ön emniyet kemeri burulma çubuğu, sınırlı şasi aralıkları; PDF: ec.europa.eu/safety-gate-alerts/api/download/notification/detail/pdf/10096062/en). Yayın ayı PDF'te yok, alertDetail sayfası açılamadı; ABD/Kanada karşılığı (25V589, 2025471) yalnızca V60 Cross Country'yi kapsıyor. EC40 için 25V392 ABD listesinde yalnızca 2025 model yılı var. Ay doğrulanınca yazılmalı.
- Kia | EV6 | 2026 (2026-10-29): tek aday Avustralya REC-006557 (2025 üretimi CV1 EV6 dahil çok modelli gösterge paneli yazılımı); resmi sayfada tarih yok (basına göre Mart 2026). Ay doğrulanınca yazılmalı. NHTSA 24V867 (ICCU, üretim 07.2024'e kadar) ve 26V431 (2021-2023 üretimi) hariç.
- Erişim notu (2026-10-29): api.nhtsa.gov ve kba-online.de proxy tarafından reddediliyor; WebFetch yalnızca arama sonuçlarında çıkan adresleri açabiliyor.

## Hariç tutulanlar (kayıt yok yazılan gruplar)

- Taigo, T-Cross: VW 90V6 emniyet kemeri uyarısı yazılımı (2020-2022 üretimi); Taigo için ayrıca VW 69UK yolcu hava yastığı (üretim 05.2025'te bitiyor).
- Passat B9: VW 69UK yolcu hava yastığı (üretim 17.05.2022 - 27.05.2025, 2026 model yılından önce).
- Touareg 3.0 V6 TDI: Touareg eHybrid batarya kampanyası yalnızca şarj edilebilir hibriti kapsıyor.
- Nissan Qashqai 2026 1.3 DIG-T: PG5CA yalnızca e-Power; REC-006308, REC-006450, REC-006618 2022-2024 model yıllarını kapsıyor.
- Nissan X-Trail 2026 1.5 VC-T: Safety Gate SR/01993/26 ve Avustralya REC-006653 (Nissan R26A5, batarya kontrol ünitesi, üretim 12.2021 - 04.2026) yalnızca e-Power versiyonlarını kapsıyor.
- Hyundai Tucson 2026, Kona 2026: AU REC-006589 (2025 model yılı gösterge paneli) yalnızca 2025 model yılına yazıldı.
- Volvo XC90/XC60 2026: 25V282 ve 25V908 geri görüş kamerası kampanyaları 2025 model yılına kadar; XC60 25V818 (oturak cıvatası) yalnızca üç belirli şasiyi kapsadığı için yazılmadı.
- Volvo EX30 2026: 26V001/26V103 yüksek gerilim batarya kampanyaları 2025 model yılı (AB/İngiltere'de yalnızca sağdan direksiyonlu pazarlar); 26V136 Premium Sound kemer uyarı sesi Kuzey Amerika'ya özgü göründüğü için hariç.
- Kia EV9 2026: 26V545 (hava yastığı sensör matı) ve 25V115 yalnızca ABD Georgia üretimi; 24V757 ve 24V962 2024-2025 model yılı.
- Kia Sorento 2026: 25V006 (2024 üretimi), 25V745 (Georgia üretimi stepne) hariç.
- Kia Niro EV 2026: 25V024 (üretim 12.2024'e kadar) hariç.
- Toyota Land Cruiser Prado 2026 2.8 dizel: AU REC-006616 / Toyota NZ gösterge paneli (2024-2025 model yılı, üretim 08.2024 - 06.2025), REC-006302 aksesuar fren kontrolcüsü (2024), NHTSA 26V179 ve 26V673 (yalnızca ABD 2.4 hibrit) hariç.
