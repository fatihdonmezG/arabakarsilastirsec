# Geri çağırma ilerlemesi (satıştaki araçlar)

Kaynak listesi: `node tools/geri_cagirma_yaz.js --liste --satista`

## Çalışmalar

| Tarih | Marka | Araştırılan nesil grupları | Yazılan versiyon | Yazılan kampanya | Kalan (satışta, araştırılmamış) |
|---|---|---|---|---|---|
| 2026-10-26 | Volkswagen | Taigo, T-Cross, Passat (B9), Touareg (2025) kayıt yok olarak yazıldı; Golf, Golf GTI, Golf R, Tiguan, Tayron, T-Roc, ID.4, ID.7 araştırılamadı | 10 | 0 | 319 versiyon |

## Araştırılamadı

Bu gruplar null bırakıldı. Ortak neden: KBA Rückrufdatenbank (kba-online.de/rrdb, /gpsg) bu ortamdan açılamadı; ilgili kampanyalar yalnızca basında görüldü, resmi sayfa (KBA, Safety Gate, NHTSA, üretici) bulunamadı. KBA erişimi sağlanınca yeniden bakılmalı.

- Volkswagen | T-Roc | 2026: KBA 16132R / VW 48AX rot kolu cıvatası, üretim 06.09.2025 - 05.02.2026 (basın, Mart 2026). Büyük olasılıkla kapsıyor.
- Volkswagen | ID.4 | 2025: KBA 17137R / 17101R, VW 93MF / 93MV yüksek gerilim batarya hücreleri, üretim 2022 - 06.2025 (basın, Ekim 2026).
- Volkswagen | ID.7 | 2025: aynı batarya kampanyası; ayrıca VW 69UK ön yolcu hava yastığı, üretim 17.05.2022 - 27.05.2025 (basın, Ağustos 2025).
- Volkswagen | Golf | 2026, Golf GTI | 2026, Golf R | 2026, Tiguan | 2026, Tayron | 2026: VW 48AA direksiyon motoru yazılımı (Avustralya REC-006602, 2025-2026 model yılı, tüm varyantlar; tarih ve Avrupa kapsamı belirsiz) ve 48JP (REC-006592, 2024-2025). Avrupa karşılığı bulunamadı. Golf GTI ve Golf R için ayrıca NHTSA 25V638 ön emniyet kemeri sarıcısı (yalnızca ABD 2025 model yılı) hariç tutuldu.

## Hariç tutulanlar (kayıt yok yazılan gruplar)

- Taigo, T-Cross: VW 90V6 emniyet kemeri uyarısı yazılımı (2020-2022 üretimi); Taigo için ayrıca VW 69UK yolcu hava yastığı (üretim 05.2025'te bitiyor).
- Passat B9: VW 69UK yolcu hava yastığı (üretim 17.05.2022 - 27.05.2025, 2026 model yılından önce).
- Touareg 3.0 V6 TDI: Touareg eHybrid batarya kampanyası yalnızca şarj edilebilir hibriti kapsıyor.
