# Geri çağırma ilerlemesi (satıştaki araçlar)

Kaynak listesi: `node tools/geri_cagirma_yaz.js --liste --satista`

## Çalışmalar

| Tarih | Marka | Araştırılan nesil grupları | Yazılan versiyon | Yazılan kampanya | Kalan (satışta, araştırılmamış) |
|---|---|---|---|---|---|
| 2026-10-26 | Volkswagen | Taigo, T-Cross, Passat (B9), Touareg (2025) kayıt yok olarak yazıldı; Golf, Golf GTI, Golf R, Tiguan, Tayron, T-Roc, ID.4, ID.7 araştırılamadı | 10 | 0 | 319 versiyon |
| 2026-10-27 | Nissan, Skoda | Nissan Qashqai (e-Power 1 kampanya, 1.3 DIG-T kayıt yok), X-Trail 1.5 VC-T (kayıt yok); Skoda Fabia, Octavia, Superb, Kodiaq, Scala, Kamiq, Karoq, Enyaq Coupe, Elroq, Enyaq araştırılamadı | 15 | 1 | 304 versiyon |
| 2026-10-28 | Hyundai | Tucson 2026 (2 kampanya), Tucson Hybrid 2025 (3), Kona 2026 (2), Santa Fe Hybrid 2026 (1), IONIQ 6 2026 (1); Kona Electric, IONIQ 5, IONIQ 9, Inster, i20, i30, Bayon araştırılamadı. Renault ve Skoda için KBA/Safety Gate resmi sayfaları yine açılamadı | 7 | 13 kayıt (6 ayrı kampanya) | 297 versiyon |
| 2026-10-29 | Volvo, Kia, Toyota | Volvo XC90 (2: T8 fren yazılımı 25V392, B5 emniyet kemeri 25V589), XC60 (aynı 2), EX30 ve EX30 Cross Country (1: baş desteği 26V671), EX40 (1: tek pedal fren yazılımı 25V392); Kia Sorento Hybrid (1: gösterge paneli 26V046), EV9 (1: gösterge paneli, Transport Canada 2026032), Niro EV kayıt yok; Toyota Land Cruiser Prado kayıt yok. Volvo V60, EC40 ve Kia EV6 araştırılamadı | 15 | 13 kayıt (6 ayrı kampanya) | 282 versiyon |
| 2026-10-30 | Cadillac, Chevrolet, GMC, Porsche, Subaru, Honda, Lexus, Mini | Escalade (3: transfer kutusu 26V289, 24 inç jant göbek cıvatası 26V304, elektronik kılavuz 26V114), Tahoe (aynı 3), Sierra 1500 Duramax (2: 26V289, 26V114); Subaru Solterra 71.4 kWh (2: klima/buğu çözücü 25V577, 360 kamera 25V744), Forester 2.0i (2: 18 inç jant 25V033, çocuk koltuğu cıvatası 25V419); Mini Cooper 3 Kapı ve Cabrio (1: emniyet kemeri sarıcısı 25V616); Porsche 911, Macan Electric, Cayenne Electric, Honda Prelude, Lexus NX 350h kayıt yok. Üst sıradaki Avrupa markaları (Skoda, Renault, Opel, Peugeot, Ford, Citroën) KBA erişimi olmadığı için bu çalışmada atlandı; NHTSA'da birebir karşılığı olan modeller seçildi | 14 | 16 kayıt (8 ayrı kampanya) | 268 versiyon |
| 2026-10-31 | Opel, Peugeot, Ford | Opel Frontera (4 kampanya: fren bağlantısı kaynağı DVSA R/2025/362, fren pedalı braketi pimi R/2025/513, ön kamera hız sınırı uyarısı R/2025/545, 48V BSG kutup kapağı R/2026/072 yalnızca hibrit); Opel Grandland, Corsa, Mokka; Peugeot 3008, e-3008, 5008, e-5008; Ford Kuga, Puma, Explorer, Capri araştırılamadı (kampanyalar KBA listelerinde görülüyor, resmi kayıt açılamadı) | 4 | 14 kayıt (4 ayrı kampanya) | 264 versiyon |
| 2026-10-31 (2) | Toyota, Kia, Honda | Toyota C-HR (1: park asistanı/360 kamera R/2025/466), Yaris Cross (aynı 1), Kia EV3 (1: gösterge paneli R/2026/139); Toyota Corolla, Corolla Cross, Yaris, Hilux, Kia Stonic, XCeed, Picanto, Honda CR-V kayıt yok (DVSA 2025 ve 2026 sayfaları). Kia Sportage araştırılamadı | 20 | 5 kayıt (2 ayrı kampanya) | 244 versiyon |

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

- Opel | Grandland | 2026 (2026-10-31): adaylar ön cam silecekleri ön klimatizasyon sonrası çalışmıyor (üretim 05.11.2024 - 10.12.2025, Haziran 2026) ve direksiyon kontrol kaybı kampanyası; yalnızca car-recalls.eu'da görüldü. DVSA GRANDLAND 2025/2026 sayfası açılamadı.
- Opel | Corsa, Mokka | 2026 (2026-10-31): Safety Gate SR/00818/26 (48V BSG kutup kapağı ve partikül filtresi borusu, Corsa/Frontera/Mokka, üretim 30.07.2024 - 22.12.2025, Mart 2026) hibrit versiyonları büyük olasılıkla kapsıyor; resmi kayıt yalnızca Fransız RappelConso (fiche 49385) üzerinden görüldü. Ayrıca Opel/Citroën ön kamera kampanyası (KBA). DVSA CORSA ve MOKKA 2025/2026 sayfaları açılamadı.
- Peugeot | 3008, e-3008, 5008, e-5008 | 2026 (2026-10-31): A) arka kapı kolları VSM yazılımı (Safety Gate SR/01735/26, Haziran 2026; KBA 16644R/16645R/16647R; Avustralya REC-006738; üretim 3008 09.10.2023 - 09.07.2025, 5008 05.12.2023 - 10.07.2025), dört grubu kapsıyor; B) 48V ısıtma kablosu bağlantısı (KBA 15569R, Eylül 2025, üretim 23.06.2025 - 20.08.2025), yalnızca hibritler; C) ön tampon hava yönlendiricileri (KBA 17142R, Ekim 2026, üretim 29.06.2026 - 16.07.2026), yalnızca 3008 Hybrid. Resmi kayıt (KBA, Safety Gate sayfası, REC-006738 robots engeli) açılamadı.
- Ford | Kuga 1.5 EcoBoost | 2026 (2026-10-31): KBA 17052R / 26S62 kablo demeti, sürüş kaybı ve yangın (üretim 20.12.2024 - 10.07.2026, Ekim 2026; motor kapsamı belirsiz), KBA 16753R / 26C23 otomatik uzun far (üretim 25.06.2025 - 15.05.2026), KBA 16541R / 26S25 (Kuga ve Puma, üretim 26.06.2018 - 09.09.2025), DVSA R/2026/366 trafik işareti tanıma.
- Ford | Puma 1.0 EcoBoost | 2026 (2026-10-31): KBA 16351R / 26S15 sağ ön aks mili iç mafsalı (üretim 05.09.2025 - 09.02.2026, Mayıs 2026), 16400R / 26C04 CoC (üretim 27.05.2025 - 31.10.2025), 17105R / 26C33 yanlış parça (üretim 31.10.2025 - 30.04.2026), 15926R / 25SB2 arka tekerlek kilitlenmesi (üretim 29.01.2025 - 22.09.2025, Aralık 2025), 16541R / 26S25.
- Ford | Explorer EV, Capri | 2026 (2026-10-31): KBA 16921R / 26S57 (üretim 18.03.2026 - 29.03.2026), 16335R / 26S06 arka aks mafsalları (üretim 20.02.2025 - 10.11.2025), 15856R / 25SA1 koltuk sırtlığı (üretim 18.08.2024 - 19.09.2025). Hariç: SR/00177/26 cıvata sıkma (üretim 05.2025'te bitiyor), 15557R / 25S79 (üretim 21.05.2025'e kadar).
- Erişim notu (2026-10-31): İngiltere DVSA model/yıl sayfaları (check-vehicle-recalls.service.gov.uk/recall-type/vehicle/make/<MARKA>/model/<MODEL>/year/<YIL>/recalls) arama sonucunda çıktığında açılabiliyor ve resmi kaynak olarak kullanılabiliyor; elle kurulan adresler reddediliyor. Kaynak listesi Stellantis ve Ford için bu sayfalarla tamamlanabilir.
- Kia | Sportage | 2026 (2026-10-31): DVSA SPORTAGE 2024 ve 2025 sayfalarında kayıt yok, 2026 sayfası açılamadı. Aday: KBA 16442R / Kia 261026 gösterge paneli yazılımı (Sportage dahil 13 model, üretim 24.06.2025 - 18.12.2025, Nisan 2026; yalnızca car-recalls.eu'da görüldü; Avustralya REC-006557 tarih vermiyor, Kore üretimi). Ayrıca Polonya TDT kaynaklı Kia 250S54 (NQ5e, dış rotil bağlantı deliği) tarih ve üretim aralığı olmadan görüldü. KBA kaydı doğrulanınca yazılmalı.
- Erişim notu (2026-10-31, 2. çalışma): DVSA model/yıl sayfaları WebFetch ile doğrudan açılabildi (Toyota için marka adı "TOYOTA (GB) PLC"). Stellantis ve Ford grupları da bu yolla yeniden denenebilir.

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
- GM Escalade/Tahoe/Sierra 2026: 26V494 (yalnızca elektrikli Escalade IQ/Sierra EV batarya modülü), 26V329 (2015-2016 hava yastığı), 26V166/26V325 (2018-2019 tavan hava yastığı), 26V083 (2020-2022 şanzıman), 26V085 (eski model yılları) hariç. 26V304 Sierra'yı kapsamıyor.
- Porsche 911 2026: 25V896 geri görüş kamerası yazılımı 2020-2025 model yılını kapsıyor. Macan Electric 2026: 24V889 (far), 25V220 (kamera), 25V492 (koltuk hava yastığı) 2024-2025 model yılı. Cayenne Electric: 25V634 yüksek basınç yakıt pompası yalnızca benzinli Cayenne/Panamera; Safety Gate SR/00266/25 (ön üst salıncak, üretim 05-06.2024) önceki nesil Cayenne.
- Subaru Solterra 2025: 22V444 ve 23V064 göbek cıvatası kampanyaları 2023 model yılı (üretim 2022); 26V393 batarya ECU'su 2026 makyajlı Solterra.
- Subaru Forester 2025 2.0i: 26V106 yakıt kapağı contası yalnızca ABD 2.5 Forester Hybrid; 26V685 2026 model yılı (Ağustos 2026 üretimi, ABD tedarikçisi); 26E028 yedek parça (Beck/Arnley salıncak) araç kampanyası değil.
- Lexus NX 350h 2026: 26V162 geri görüş kamerası yalnızca benzinli NX250/NX350 (2022-2025); hibritler kapsam dışında.
- Opel Frontera 2026: AB Safety Gate SR/02932/25 yüksek basınçlı yakıt hortumu (üretim 30.07.2024 - 23.04.2025) 2026 model yılından önce bitiyor; elektrikli direksiyon kablo demeti kampanyası resmi kayıtla doğrulanamadığı için yazılmadı.
- Toyota Corolla, Corolla Cross, Yaris, Yaris Cross 2026: DVSA R/2025/270 / Safety Gate SR/02991/25 gösterge paneli belleği (Kasım 2025) 2025 yılı sayfalarında görünüyor ama 2026 sayfalarında yok; üretim aralığı (Corolla 05.2025'e, Yaris ve Yaris Cross 02.2025'e kadar) 2026 model yılından önce bitiyor. R/2024/463 fren aktüatörü ve R/2023/279 eCall 2023-2024 araçlarında.
- Toyota C-HR 2026: R/2023/349 uzaktan park (üretim 09-12.2023) hariç.
- Toyota Hilux 2026: Avustralya REC-006578 (aksesuar tampon montajında direksiyon kablo şasesi) yalnızca Avustralya; DVSA HILUX 2025 ve 2026 sayfalarında kayıt yok.
- Kia Stonic, XCeed, Picanto 2026: EGR valfi (Stonic, Picanto, üretim 01-02.2024), Picanto ISLA (R/2024/367, üretim 04-05.2024) ve XCeed eski kampanyaları 2026 model yılından önce. DVSA 2025 ve 2026 sayfalarında kayıt yok.
- Honda CR-V 2026 e:HEV: Safety Gate SR/01451/25 çeki demiri kablosu (üretim 04.2023 - 03.2024) hariç; NHTSA 26V366 lastik tamir kiti ABD tedarikçisine özgü, 25V378 yalnızca 6 ABD aracı.
- Kia EV3 2026: NHTSA 26V046 / Transport Canada 2026032 EV3'ü kapsamıyor.
