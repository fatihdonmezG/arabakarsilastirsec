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

## 2026-10-22

- Önce: Toplam puanı olmayan 237 / 741 → Sonra: 221 / 741 (16 versiyon puanlandı).
- Euro NCAP (5 kayıt + ncap_yay.js ile 5 yayılım):
  - Hyundai i30 2026 (2): 5★, 2017 (euroncap.com/en/results/hyundai/i30/27355; yıldız: Caetano/Hyundai Portekiz duyurusu). Test 9 yıldan eski.
  - Škoda Karoq 2026 (2): 5★, 2017 (euroncap.com/en/results/skoda/karoq/28527; Škoda Storyboard). Test 9 yıldan eski.
  - Nissan Townstar Combi EV 2026 (2): 4★, 2021 (Renault Kangoo ikizi; euroncap.com/en/results/nissan/townstar/44205).
  - Subaru Solterra 2025 (2): 5★, 2022 (Toyota bZ4X ikizi; 71,4 kWh makyaj öncesi nesil; euroncap.com/en/results/subaru/solterra/47137). 2025 testi (MY26 makyajlı) bu kayıtlara yazılmadı.
  - Porsche Taycan 2026 (2): 5★, 2019 (euroncap.com/en/results/porsche/taycan/39129). Test 7 yıldan eski.
- Diğer alanlar (Renault, Fiat): 4 alan, 3 versiyon + bagaj yayılımı 8 versiyon
  - Bagaj yayılımı: Renault Clio V (içten yanmalı) 391 L → 7 versiyon; Ford Tourneo Courier 570 L → 1 versiyon.
  - Renault Clio IV 2018/2019 1.5 dCi 75: 0-100 12 sn (auto-data.net).
  - Renault Symbol 2018 1.0 SCe 75: tüketim 5,1, 0-100 15,1 (autotijd.be, Logan II makyajlı ikizi).

### Euro NCAP testi yok (2026-10-22)
- Fiat Grande Panda, Citroën ë-C3, C3 Aircross ve ë-C3 Aircross (Smart Car platformu) — Euro NCAP sonucu yok (carbuyer: Grande Panda ve C3 test edilmedi; euroncap.com'daki C3 Aircross sonucu 2017 önceki nesle ait). Güvenlik hava yastığı + sürüş destek kalemleriyle açılmalı.
- Fiat Topolino, Citroën Ami — dörtlü (quadricycle); Euro NCAP yıldız testi kapsamı dışında.

### Araştırıldı, bulunamadı (2026-10-22)
- renault-clio-202[1-3]-1.0-tce-90-x-tronic, renault-clio-202[4-5]-1.0-tce-90-x-tronic-makyajli .tuketim_l100km, .sifirYuz_sn — auto-data'da yalnız TCe 100 CVT var; automobile-catalog erişilemedi.
- renault-clio-2020-1.5-blue-dci-85 .tuketim_l100km, .sifirYuz_sn — auto-data değerleri dCi 115 ile birebir aynı (kopya şüphesi), topgear sayfası başka nesil bagajı veriyor; kullanılmadı.
- renault-megane-sedan-2020-1.3-tce-140-edc, -1.5-blue-dci-115-edc .tuketim_l100km — Faz I sedan EDC sayfası bulunamadı.
- renault-symbol-2018-1.5-dci-90-easy-r — yalnızca makyaj öncesi (2016) Logan Easy-R verisi var.
- fiat-egea-sedan/cross-202[1-5]-1.6-multijet-130-dct .tuketim_l100km, .sifirYuz_sn — model yılına ait resmi/teknik kaynak bulunamadı (yalnızca yasaklı siteler).

## 2026-10-26

- Önce: Toplam puanı olmayan 231 / 762 → Sonra: 208 / 762 (23 versiyon puanlandı).
- Euro NCAP (6 kayıt + ncap_yay.js ile 5 yayılım; 22 alan):
  - Lexus RX 2026 (2): 5★, 2022 (euroncap.com/en/results/lexus/rx/48753; RX 350h/450h+/500h).
  - Mercedes-Benz GLC 2026 (1): 5★, 2022 (X254; euroncap.com/en/results/mercedes-benz/glc/48755).
  - Alfa Romeo Giulia 2023 (2): 5★, 2016 (news.euroncap.com Giulia 2016; yıldız: autobiz.ie). Test 10 yıldan eski.
  - Alfa Romeo Stelvio 2023 (2): 5★, 2017 (euroncap.com/en/results/alfa-romeo/stelvio/27419; Euro NCAP basın bülteni 05.07.2017). Test 9 yıldan eski. Stelvio versiyonlarının tüketim/0-100/bagajı hâlâ eksik.
  - Nissan Navara 2021 (2): 4★, 2015 (NP300 Navara D23, tüm çift kabin; cdn.euroncap.com/en/results/nissan/navara/22037; yıldız: australiancar.reviews). Test 11 yıldan eski.
  - Mazda 2 2021 (2): 4★, 2015 (DJ nesli; news.euroncap.com Mazda 2 2015; yıldız: paultan.org). Test 11 yıldan eski.
- Diğer alanlar (Renault, Fiat + Citroën güvenlik): 27 alan, 15 versiyon
  - Renault Taliant 1.0 SCe 65 ×3: tüketim 5,7 (WLTP, autotijd.be); 1.0 TCe 90 X-Tronic ×5: tüketim 6,1 (WLTP, autotijd.be).
  - Renault Megane III (Faz III) 1.5 dCi 110 manuel 2014–2016 ×3: tüketim 4,4, 0-100 10,8, ağırlık 1215 (auto-data.net).
  - Renault Megane III Sport Tourer 1.5 dCi 110 EDC 2014–2016 ×3: tüketim 4,2, 0-100 12,1, ağırlık 1289 (auto-data.net Grandtour Faz III).
  - Citroën C3 Aircross 1.2 Hybrid 145 Max: 6 hava yastığı (Stellantis Türkiye basın bülteni) → Euro NCAP olmadan güvenlik açıldı.
  - Fiat: kalan tüm eksikler önceki listelerde (bulunamadı / Euro NCAP testi yok).
  - Bagaj yayılımı: yeni değer yok.

### Euro NCAP testi yok / bulunamadı (2026-10-26)
- Mercedes-Benz S-Serisi (W223), Mercedes-Maybach S-Serisi, BMW 7 Serisi (G70) / i7 — euroncap.com'da sonuç bulunamadı.

### Araştırıldı, bulunamadı (2026-10-26)
- renault-taliant-2021-1.0-turbo-eco-100-lpg.tuketim_l100km — autotijd yalnızca benzin/LPG ayrımsız aralık (5,7–7,0) veriyor.
- renault-fluence-201[1-2]-1.6-105-otomatik, -1.5-dci-85, -1.5-dci-105 .tuketim_l100km, .sifirYuz_sn — auto-data Fluence (2009–2012) sayfasında bu Türkiye motorları yok; fiches-auto yalnız kullanıcı ortalaması.
- renault-megane-201[4-6]-st-1.5-dci-110 — auto-data Grandtour manuel (20171) sayfası açılamadı; tekrar denenebilir. renault-megane-201[4-6]-st-1.6-dci-130 — auto-data Grandtour Faz III'te 1.6 dCi 130 yok.
- renault-clio-201[5-6]-1.5-dci-90-edc — auto-data Clio IV Faz I hatchback'te EDC yok (yalnız Grandtour ve Faz II).
- renault-megane-sedan-2021-1.0-tce-115.tuketim_l100km — auto-data sayfasında tüketim yok.
- fiat-grande-panda-1-2-mhev-*.airbag_sayisi — Stellantis Türkiye bülteninde hava yastığı sayısı yok.
- citroen-c3-aircross-1.2-hybrid-145-plus-2026.airbag_sayisi — bültende yalnız tipler var, sayı yok.

## 2026-10-27

- Önce: Toplam puanı olmayan 210 / 807 → Sonra: 202 / 807 (8 versiyon puanlandı).
- Euro NCAP (8 versiyon; ncap_yay.js ile 1 yayılım):
  - MG ZS EV 2022 (2): 5★, 2019 (44,5 kWh makyaj öncesi nesil; cdn.euroncap.com 2019 MG ZS EV veri sayfası; yıldız: MG Motor UK bülteni/insideevs). Test 7 yıldan eski. Elektrik tüketimi 18,6 kWh/100 km (auto-data.net) ×2.
  - Toyota Yaris 2026 (1): 5★, 2020 (Euro NCAP basın bülteni 18.09.2020).
  - Toyota Yaris Cross 2026 (1): 5★, 2021 (euroncap.com/en/results/toyota/yaris-cross/43819).
  - Jaecoo 7 2025 (1): 5★, 2025 (Euro NCAP Jaecoo 7 PHEV sonucu; aynı nesil, benzinli versiyona da yazıldı).
  - VW Touareg 2025 (1): 5★, 2018 (euroncap.com/en/results/vw/touareg/33478, "tüm Touaregler"). Test 8 yıldan eski.
  - KGM Korando 2026 (1): 5★, 2019 (Euro NCAP basın bülteni 04.09.2019). Test 7 yıldan eski.
  - Renault Megane Sedan 2026 Icon/Touch (2 kayıt, 1 versiyon puan açtı): 5★, 2015 (Megane IV; diğer Megane IV Sedan kayıtlarıyla aynı kaynak). 2026 kayıtlarında `nesil` alanı yok, bu yüzden ncap_yay ile eşleşmiyordu.
- Diğer alanlar (Renault, Fiat): yeni değer yok; Fiat'ın kalan eksikleri önceki listelerde. Bagaj yayılımı: yeni değer yok.
- Eklenen alan: 18.

### Euro NCAP testi yok / bu çalışmada uygulanmadı (2026-10-27)
- Mercedes-Benz GLB 2026 — yeni nesil (X244); euroncap.com'daki 2019 sonucu önceki nesle (X247) ait, yazılmadı.

### Araştırıldı, bulunamadı (2026-10-27)
- renault-kadjar-2019-1.3-tce-160-edc.tuketim_l100km — ADAC yalnız NEDC 5,6 ve WLTP CO₂ 148 veriyor; WLTP l/100 km yok (diğer makyajlı Kadjar kayıtları WLTP), auto-data sayfasında tüketim yok.
- renault-megane-201[4-6]-st-1.5-dci-110 — auto-data Grandtour Faz III manuel sayfası yine bulunamadı (yalnız EDC ve diğer gövdeler).
