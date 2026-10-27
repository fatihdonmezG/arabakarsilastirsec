# Geri çağırma ilerlemesi (satıştaki araçlar)

Kaynak listesi: `node tools/geri_cagirma_yaz.js --liste --satista`

## Çalışmalar

| Tarih | Marka | Araştırılan nesil grupları | Yazılan versiyon | Yazılan kampanya | Kalan (satışta, araştırılmamış) |
|---|---|---|---|---|---|
| 2026-10-26 | Volkswagen | Taigo, T-Cross, Passat (B9), Touareg (2025) kayıt yok olarak yazıldı; Golf, Golf GTI, Golf R, Tiguan, Tayron, T-Roc, ID.4, ID.7 araştırılamadı | 10 | 0 | 319 versiyon |
| 2026-10-27 | Nissan, Skoda | Nissan Qashqai (e-Power 1 kampanya, 1.3 DIG-T kayıt yok), X-Trail 1.5 VC-T (kayıt yok); Skoda Fabia, Octavia, Superb, Kodiaq, Scala, Kamiq, Karoq, Enyaq Coupe, Elroq, Enyaq araştırılamadı | 15 | 1 | 304 versiyon |

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

## Hariç tutulanlar (kayıt yok yazılan gruplar)

- Taigo, T-Cross: VW 90V6 emniyet kemeri uyarısı yazılımı (2020-2022 üretimi); Taigo için ayrıca VW 69UK yolcu hava yastığı (üretim 05.2025'te bitiyor).
- Passat B9: VW 69UK yolcu hava yastığı (üretim 17.05.2022 - 27.05.2025, 2026 model yılından önce).
- Touareg 3.0 V6 TDI: Touareg eHybrid batarya kampanyası yalnızca şarj edilebilir hibriti kapsıyor.
- Nissan Qashqai 2026 1.3 DIG-T: PG5CA yalnızca e-Power; REC-006308, REC-006450, REC-006618 2022-2024 model yıllarını kapsıyor.
- Nissan X-Trail 2026 1.5 VC-T: Safety Gate SR/01993/26 ve Avustralya REC-006653 (Nissan R26A5, batarya kontrol ünitesi, üretim 12.2021 - 04.2026) yalnızca e-Power versiyonlarını kapsıyor.
