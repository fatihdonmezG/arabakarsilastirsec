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

## 2026-10-28

- Önce: Toplam puanı olmayan 206 / 820 → Sonra: 195 / 820 (11 versiyon puanlandı).
- Euro NCAP (7 kayıt + ncap_yay.js ile 1 eşleme + 5 yayılım; 16 alan):
  - Range Rover Velar 2026 (1): 5★, 2017 (Euro NCAP basın bülteni 04.10.2017). Test 9 yıldan eski.
  - Mitsubishi Space Star 2026 (1): 4★, 2013 (aynı nesil A05A, 2019 makyajlı; cdn.euroncap.com 2013 Space Star/Mirage belgesi). Test 13 yıldan eski.
  - Mazda MX-5 ND 2023 roadster + RF (2 kayıt, roadster puan açtı): 4★, 2015 (caradvice). Test 11 yıldan eski. RF'nin tüketim ve 0-100/ağırlığı hâlâ eksik.
  - Mercedes-AMG C-Serisi Sedan 2026 (1): 5★, 2022 — `--esle` ile C-Serisi Sedan (W206) sonucundan.
  - Fiat Fiorino Combi (makyajlı) 2020–2022 (6): 3★, 2010 — Euro NCAP Citroën Nemo Combi 2010 (aynı platform/gövde ikizi; sicurauto.it). Test 16 yıldan eski.
  - Audi Q8 2026 (1, puan açılmadı): 5★, 2019 (euroncap.com/en/results/audi/q8/39673; süresi doldu). Tüketim ve 0-100/ağırlık hâlâ eksik.
  - Land Rover Discovery 2026 (1, puan açılmadı): 5★, 2017 (euroncap.com/en/results/land+rover/discovery/26434; süresi doldu). Bagaj hâlâ eksik.
- Diğer alanlar (Fiat; Renault'nun kalan tüm eksikleri önceki "bulunamadı" listelerinde): 4 alan
  - Fiat Fiorino Combi 1.3 MultiJet 95 ×3: ağırlık 1090 kg (auto-data.net, makyajlı 2016 minivan).
  - Fiat 500L 2015 1.6 MultiJet 105: tüketim 4,5 (cars-data.com).
  - Bagaj yayılımı: Fiorino Combi 360 L → 1.4 Fire 77 ×3.
- Eklenen alan: 20 (+ 3 bagaj yayılımı).

### Euro NCAP testi yok (2026-10-28)
- Toyota Camry XV70 (2021) — drivingelectric: Euro NCAP Camry'yi test etmedi (yalnız ANCAP/ASEAN NCAP).
- BYD Han — Euro NCAP'te sonuç yok (2022'de yalnız Atto 3, sonra Tang/Seal U test edildi).
- Mercedes-Benz GLC Coupé (X254) — Euro NCAP GLC 2022 sonucu yalnız 5 kapılı SUV'yi kapsıyor; coupé için yazılmadı.

### Araştırıldı, bulunamadı (2026-10-28)
- audi-a8-l-2026-55-tfsi-quattro-340.ncap_yildiz — euroncap.com'da A8 (D5) sonucu bulunamadı.
- fiat-fiorino-combi-202[0-2]-1.3-multijet-95.sifirYuz_sn — auto-data sayfasında yok (ağırlık yazıldı).

## 2026-10-29

- Önce: Toplam puanı olmayan 199 / 827 → Sonra: 195 / 827 (4 versiyon puanlandı).
- Euro NCAP (5 kayıt, 10 alan; ncap_yay.js ile 1 detay yayılımı — Mercedes-AMG C63 S E Performance, önceki C-Serisi eşlemesinden):
  - Lexus LBX 2026 (1): 5★, 2024 (cdn.euroncap.com 2024 LBX veri sayfası "tüm LBX'ler"; yıldız: Lexus Avrupa duyurusu).
  - Citroën Berlingo 2026 (1): 4★, 2018 (euroncap.com Berlingo 33738, Rifter testi; derecelendirme 01.01.2025'te süresi doldu; yıldız: Euro NCAP 24.10.2018 duyurusu). Test 8 yıldan eski.
  - Opel Combo 2026 (1): 4★, 2018 (news.euroncap.com Opel/Vauxhall Combo 2018). Test 8 yıldan eski.
  - Mini Cooper 5 Kapı 2026 (1): 5★, 2025 (MINI basın bülteni 08.09.2025: benzinli Cooper C/S/JCW; test 3 kapılı gövdeyle, 5 kapılı aynı neslin gövde türevi). Cabrio'ya yazılmadı (gövde yapısı farklı, kaynak kapsamıyor).
  - Audi Q7 2026 (1, puan açılmadı): 5★, 2015 (4M; Euro NCAP basın bülteni 02.09.2015). Test 11 yıldan eski. Tüketim hâlâ eksik.
- Diğer alanlar: Renault ve Fiat'ın kalan tüm eksikleri önceki "bulunamadı / Euro NCAP testi yok" listelerinde; sıradaki markalar Aston Martin ve Rolls-Royce (yalnız hava yastığı sayısı + 1 sürüş destek kalemi gerekli) denendi, kaynaklar çeliştiği için yazılmadı. Bagaj yayılımı: yeni değer yok.
- Eklenen alan: 10.

### Euro NCAP testi yok (2026-10-29)
- Hyundai Accent Blue (RB, 2018) — yalnız ANCAP/Latin NCAP sonuçları var; Euro NCAP sonucu yok. Güvenlik hava yastığı + sürüş destek kalemleriyle açılmalı.
- Mini Cooper Cabrio (F67) — Euro NCAP 2025 sonucu yalnız 3 kapılı benzinliyi kapsıyor.
- Mercedes-Benz S-Serisi (W223) — tekrar kontrol edildi, sonuç bulunamadı.

### Araştırıldı, bulunamadı (2026-10-29)
- rolls-royce-*.airbag_sayisi — carexpert (makyaj öncesi, 8) ile carsales Ghost Series II MY26 (6) çelişiyor; resmi kaynak yok.
- aston-martin-db12-*.airbag_sayisi — carexpert DB12 2025 (8) ile carsales DB12 S MY26 (7) çelişiyor; resmi kaynak yok.
- audi-q7-2026-45-tfsi-quattro-sline.tuketim_l100km — autotijd'de 45 TFSI yok; auto-data değeri (10,7) WLTP olduğu belirsiz.
- land-rover-discovery-2026-dynamic-hse-d350.bagaj_l, land-rover-range-rover-2026-autobiography-p460e.bagaj_l — parkers tek değer veriyor (172 / 1.093 L), hangi koltuk düzeni olduğu belirsiz.

## 2026-10-30

- Önce: Toplam puanı olmayan 198 / 830 → Sonra: 190 / 830 (8 versiyon puanlandı).
- Euro NCAP (2 kayıt + ncap_yay.js ile 1 yayılım; 6 alan):
  - Isuzu D-Max 2026 (2): 5★, 2022 (Euro NCAP D-MAX Crew Cab 2022 sonucu; 2020 testinin diz hava yastığı iyileştirmesiyle güncellenmiş hâli, news.euroncap.com).
  - DS 7 2026 (1): 5★, 2017 (euroncap.com/fr/results/ds/7+crossback/28749 "tüm DS 7 Crossback'ler"; yıldız: Stellantis basın bülteni 30.11.2017). Test 9 yıldan eski.
- Diğer alanlar (Renault ve Fiat'ın kalan tüm eksikleri önceki "bulunamadı / Euro NCAP testi yok" listelerinde; sıradaki Citroën ve Bentley işlendi): 5 alan
  - Citroën ë-C3 Plus/Max ×2: 6 hava yastığı (Stellantis Türkiye basın bülteni).
  - Citroën C3 Aircross 1.2 Hybrid 145 Plus, ë-C3 Aircross ×2: 6 hava yastığı (Citroën Almanya fiyat listesi 06/2024, tüm donanımlarda standart).
  - Bagaj yayılımı: yeni değer yok.
- Eklenen alan: 11.

### Euro NCAP testi yok (2026-10-30)
- Honda Prelude (2026) — carexpert.co.uk: "Eylül 2026 itibarıyla Euro NCAP tarafından değerlendirilmedi".
- Mercedes-Benz GLC (Elektrikli, EQ teknolojili) — carexpert.co.uk: "Ağustos 2026 itibarıyla değerlendirilmedi".
- Leapmotor T03 — carexpert.co.uk: Euro NCAP testi yok (Eylül 2026'daki Leapmotor sonucu B05'e ait).
- Land Rover Discovery Sport PHEV (P300e) — Euro NCAP 2022 sonucu (5★) yalnız dizel/benzinli versiyonları kapsıyor; P300e için "ek test gerekli" yazıyor. PHEV kaydına yazılmadı.

### Araştırıldı, bulunamadı (2026-10-30)
- bentley-*.airbag_sayisi — carsales Bentayga 2026 (8, ama 6 tip sayıyor) ile carexpert Bentayga 2026 (6) çelişiyor; resmi kaynak yok.
- maserati-grecale-2025-*.(sürüş destek kalemleri) — Grecale dijital kataloğunda (AT) donanım listesi yok; İngilizce katalog açılamadı.
- mercedes-benz-glc-coupe-2026-glc180-amg.airbag_sayisi — yalnız ABD/ANCAP kaynakları, Türkiye/Avrupa sayısı bulunamadı.

## 2026-10-31

- Önce: Toplam puanı olmayan 198 / 842 → Sonra: 195 / 842 (3 versiyon puanlandı).
- Euro NCAP: yeni sonuç yok. Kalan nesil gruplarının tamamı Euro NCAP'te test edilmemiş ya da önceki listelerde (aşağıya eklenenler).
- Euro NCAP'siz güvenlik (hava yastığı + sürüş destek) ile açılanlar: 7 alan, 3 versiyon
  - Toyota Camry 2021 Hybrid Passion: otonom acil fren, ACC, şerit takip (LTA), kör nokta (BSM), yokuş kalkış (HAC) — Toyota Türkiye Camry 2021 Teknik ve Donanım Özellikleri (tek donanım sütunu).
  - Forthing T5 EVO Executive ve Sport Edition: 6 hava yastığı (forthing.com.tr/t5-evo "6 hava yastığı ile tam koruma"; tablo bu iki donanımda tüm hava yastıklarını gösteriyor).
  - Bagaj yayılımı: yeni değer yok.
- Eklenen alan: 7.

### Euro NCAP testi yok (2026-10-31)
- KGM Torres ve Torres EVX — thecarexpert.co.uk: "Euro NCAP tarafından değerlendirilmedi" (Şubat/Mart 2026).
- Porsche 911 (992) — thecarexpert.co.uk: 911 serisi hiç test edilmedi (Ekim 2025). Porsche Panamera — autoexpress: Euro NCAP sonucu yok.
- Mercedes-Benz GLS (X167) — thecarexpert.co.uk (Temmuz 2025); autoexpress yalnız GLE'nin test edildiğini söylüyor (GLE sonucu GLS'ye yazılmadı).
- BMW X7 — thecarexpert.co.uk (Şubat 2026). Audi e-tron GT — thecarexpert.co.uk (Mayıs 2025).
- Voyah Free / Dream — euroncap.com'da yalnız Voyah Courage sonucu var.

### Araştırıldı, bulunamadı (2026-10-31)
- forthing-t5evo-2026-premium.airbag_sayisi — tablo sürücü, yolcu ve ön yan hava yastığı gösteriyor ama sayı yazmıyor (sayfanın "6" sayımı tablo satırlarıyla tutarsız; sayı türetilmedi).
- forthing-m4utour-2026-*.airbag_sayisi, .agirlik_kg, .bagaj_l — forthing.com.tr/m4 sayfasında sayı, ağırlık ve bagaj yok.
- hyundai-elantra-202[3-4]-*.airbag_sayisi, kia-cerato-2024-*.airbag_sayisi — Hyundai 2023 broşürü, motor1/donanımhaber ve Kia Türkiye haberi yalnız tipleri (sürücü, yolcu, yan, perde) veriyor; sayı yok.
- byd-han-executive-380kw-2025.airbag_sayisi — BYD Türkiye teknik broşürü (23.06.2025) yalnız tipleri veriyor (ön, sürücü dizi, ön yan, perde).
- honda-prelude-2026-2-0-ehev-advance.airbag_sayisi — Honda Türkiye sayfalarında sayı yok.
- cadillac-*/chevrolet-*/gmc-*.airbag_sayisi — gmsv-turoto.com.tr model sayfalarında hava yastığı bilgisi yok.
- opel-frontera-*.airbag_sayisi — Opel Türkiye fiyat listesi sayfası ve basın bülteninde yok; tüm modeller PDF'i açılamadı.
- skywell-et5-lr-2026-*.airbag_sayisi, .elektrik_tuketim_kwh100km — autotalli: WLTP tüketim "ei ilmoitettu", hava yastığı yok.
- fiat-fullback-2016-*.ncap_yildiz — L200 ikizliğini ve Euro NCAP sonucunu birlikte veren erişilebilir kaynak bulunamadı.

## 2026-10-31 (2. çalışma)

- Önce: Toplam puanı olmayan 195 / 842 → Sonra: 185 / 842 (10 versiyon puanlandı).
- Euro NCAP: yeni sonuç yok. Kalan nesil gruplarının tamamı Euro NCAP'te test edilmemiş (aşağıya eklenenler) ya da önceki listelerde.
- Diğer alanlar (Renault ve Fiat'ın kalan tüm eksikleri önceki listelerde; sıradaki çözülebilir markalar işlendi): 20 alan, 12 versiyon
  - VW Golf 1.5 TSI 116 manuel: 0-100 9,9, ağırlık 1229; Golf 1.5 eTSI 150 DSG: 0-100 8,4, ağırlık 1301; Golf R: bagaj 341 L (auto-data.net Golf VIII makyajlı).
  - VW Passat Variant B9 1.5 eTSI 150 DSG (R-Line + Impression): 0-100 9,2; R-Line ağırlık 1572 (auto-data.net).
  - Alpine A290 GT Performance / GTS (220 ch): 0-100 6,4 (Alpine Fransa broşürü); A390 GT: 0-100 4,8, ağırlık 2124 (Alpine Belçika broşürü).
  - Volvo EX30 Cross Country: tüketim 18,7 kWh/100 km, bagaj 318 L (auto-data.net).
  - Tesla Model Y Premium Long Range RWD (4680, 74 kWh): 14,0 kWh/100 km (EV Database WLTP 225 Wh/mil).
  - Subaru Crosstrek e-Boxer: 0-100 10,8, ağırlık 1597, bagaj 315 L (Subaru UK teknik özellikler; CO₂ Türkiye ile aynı).
  - Subaru Solterra e-Xtreme: 0-100 6,9, ağırlık 2088 (Subaru TR teknik föy) — bagaj eksik olduğundan puan açılmadı.
  - Bagaj yayılımı: yeni değer yok.
- Eklenen alan: 20.

### Euro NCAP testi yok (2026-10-31, 2. çalışma)
- Opel Frontera (2025) — thecarexpert.co.uk: "Şubat 2026 itibarıyla değerlendirilmedi" (Vauxhall Frontera).
- Fiat Grande Panda — thecarexpert.co.uk: "Ağustos 2026 itibarıyla değerlendirilmedi".
- KGM Actyon — thecarexpert.co.uk: "Şubat 2026 itibarıyla değerlendirilmedi".
- Lexus LM — thecarexpert.co.uk: "Mart 2026 itibarıyla test edilmedi".
- BMW X6 (G06) — Auto Express: Euro NCAP güncel X6'yı test etmedi (yalnız X5).

### Araştırıldı, bulunamadı (2026-10-31, 2. çalışma)
- subaru-solterra-2025-e-xtreme-awd.bagaj_l, subaru-solterra-2025-e-xcellent-awd.bagaj_l — TR teknik föyde üç donanım için yalnız iki değer (452 / 441 L) var; hangi donanıma ait olduğu belirsiz. (452 yazılsaydı bagaj_yay e-Xcellent'e de yayardı.)
