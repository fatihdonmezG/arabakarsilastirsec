# Puan eksikleri — ilerleme

Kaynak kuralları: tools/DETAY_EKLEME_REHBERI.md ("Puanı açan eksik veriler", "Araştırma kuralları", "Eksik teknik alanları doldurma").

## 2026-10-21

- Önce: Toplam puanı olmayan 248 / 647 → Sonra: 222 / 647 (26 versiyon puanlandı).
- Euro NCAP (ncap_yildiz + ncap_test_yili, ncap_yay.js ile nesle yayıldı; 6 kayıt + 17 yayılım):
  - Renault Symbol III (13 versiyon): 3★, 2014 — Euro NCAP Dacia Logan MCV 2014 sonucu (aynı nesil Logan II; Symbol III = Logan II sedan, motor1.com). Test 6 yıldan eski.
  - Skoda Octavia 2026 (3): 5★, 2025 (2022 testinin 2025 yeniden değerlendirmesi).
  - Skoda Kamiq 2026 (2): 5★, 2019. Test 6 yıldan eski.
  - Skoda Scala 2026 (2): 5★, 2019. Test 6 yıldan eski.
- Diğer alanlar (Renault, Fiat): 26 alan, 14 versiyon
  - Fiat Linea (makyajlı) 1.3 Multijet 95 ×5: tuketim 4.9, 0-100 13.8, ağırlık 1185 (autocentrum.pl). NCAP eksik olduğundan puan henüz açılmadı.
  - Fiat Doblo Combi (makyajlı) 1.6 Multijet 105 ×7: tuketim 5.2 (ultimatespecs, NEDC).
  - Renault Symbol 2017/2018 1.5 dCi 90: tuketim 3.6, 0-100 11.8 (auto-data.net, Logan II makyajlı ikizi).
  - Bagaj yayılımı: yeni değer yok (bagaj_yay.js 0 versiyon).

### Euro NCAP testi yok
- Maserati Grecale (2025) — Euro NCAP'te Maserati sonucu bulunamadı; güvenlik hava yastığı + sürüş destek kalemleriyle açılmalı.
- Forthing T5 Evo, Aston Martin (Vantage, DB12, DBX, Vanquish) — rehberde test edilmeyen markalar arasında.
- Fiat Linea (makyajlı) — Euro NCAP sonuç sayfası bulunamadı (yalnızca forum kaydı "test edilmedi" diyor); güvenlik hava yastığı + sürüş destek ile açılmalı.

### Araştırıldı, bulunamadı (id.alan)
- opel-frontera-* .ncap_yildiz — euroncap.com'da Frontera sonucu bulunamadı (Ekim 2026).
- fiat-linea-201[2-6]-1.4-fire-77.tuketim_l100km — yalnızca makyaj öncesi (Euro 4) veri var.
- fiat-linea-201[2-6]-*.ncap_yildiz — bkz. yukarı.
- renault-fluence-201[3-6]-1.6-16v-115-cvt.tuketim_l100km, .sifirYuz_sn — X-Tronic CVT sürümü km77/auto-data'da yok.
- renault-megane-201[4-6]-1.5-dci-90/110, 1.6-16v-115-cvt .tuketim_l100km — autocentrum sayfası Faz I (2010–2011); Faz III kaynağı bulunamadı.
- fiat-doblo-combi-2016-1.3-multijet-90, 2019–2022-1.3-multijet-95 .tuketim_l100km — kaynaklarda binek 1.3 MJ yok.
- fiat-doblo-combi-*-1.6-multijet-105.tuketim_l100km auto-data aralık (5.2-5.7) verdiği için ultimatespecs kullanıldı.
