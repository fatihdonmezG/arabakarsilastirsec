/* Hesaplama sayfalarının fiyat ve tarife verisi. Her değerin kaynağı ve tarihi yanında.
   Güncellerken tarih alanını da değiştirin. */
window.HESAP_VERI = {
  // Pompa fiyatları, TL/litre
  yakit: {
    tarih: '2026-11-03',
    // Benzin (Kurşunsuz 95) ve motorin (EcoForce): Opet il merkezi tavsiye fiyatları, 81 il. LPG: Opet satmadığı için 4 il, 02.11.2026.
    kaynaklar: [
      {ad: 'Opet akaryakıt fiyatları (il merkezi, resmi)', url: 'https://www.opet.com.tr/akaryakit-fiyatlari'},
      {ad: 'TV5, 2 Kasım 2026 LPG fiyatları', url: 'https://www.tv5.com.tr/benzine-zam-ya-da-indirim-var-mi-iste-2-kasim-2026-guncel-benzin-motorin-ve-lpg-fiyatlari'}
    ],
    iller: {
      'Adana': {benzin: 82.35, dizel: 102.43, lpg: null},
      'Adıyaman': {benzin: 82.69, dizel: 102.8, lpg: null},
      'Afyonkarahisar': {benzin: 82.62, dizel: 102.85, lpg: null},
      'Ağrı': {benzin: 83.06, dizel: 103.17, lpg: null},
      'Aksaray': {benzin: 82.42, dizel: 102.5, lpg: null},
      'Amasya': {benzin: 82.11, dizel: 102.18, lpg: null},
      'Ankara': {benzin: 81.51, dizel: 101.6, lpg: 41.29},
      'Antalya': {benzin: 82.76, dizel: 102.91, lpg: null},
      'Ardahan': {benzin: 82.58, dizel: 102.7, lpg: null},
      'Artvin': {benzin: 82.41, dizel: 102.51, lpg: null},
      'Aydın': {benzin: 82.01, dizel: 102.14, lpg: null},
      'Balıkesir': {benzin: 82.11, dizel: 102.23, lpg: null},
      'Bartın': {benzin: 81.83, dizel: 101.73, lpg: null},
      'Batman': {benzin: 82.99, dizel: 103.18, lpg: null},
      'Bayburt': {benzin: 82.28, dizel: 102.39, lpg: null},
      'Bilecik': {benzin: 81.48, dizel: 101.35, lpg: null},
      'Bingöl': {benzin: 83.08, dizel: 103.27, lpg: null},
      'Bitlis': {benzin: 83.13, dizel: 103.33, lpg: null},
      'Bolu': {benzin: 81.6, dizel: 101.47, lpg: null},
      'Burdur': {benzin: 82.57, dizel: 102.75, lpg: null},
      'Bursa': {benzin: 81.6, dizel: 101.49, lpg: null},
      'Çanakkale': {benzin: 82.17, dizel: 102.27, lpg: null},
      'Çankırı': {benzin: 81.92, dizel: 102.01, lpg: null},
      'Çorum': {benzin: 82.12, dizel: 102.18, lpg: null},
      'Denizli': {benzin: 82.27, dizel: 102.42, lpg: null},
      'Diyarbakır': {benzin: 82.98, dizel: 103.18, lpg: null},
      'Düzce': {benzin: 81.44, dizel: 101.32, lpg: null},
      'Edirne': {benzin: 81.64, dizel: 101.75, lpg: null},
      'Elazığ': {benzin: 83.13, dizel: 103.31, lpg: null},
      'Erzincan': {benzin: 82.52, dizel: 102.63, lpg: null},
      'Erzurum': {benzin: 82.57, dizel: 102.69, lpg: null},
      'Eskişehir': {benzin: 81.79, dizel: 101.68, lpg: null},
      'Gaziantep': {benzin: 82.49, dizel: 102.56, lpg: null},
      'Giresun': {benzin: 82.33, dizel: 102.45, lpg: null},
      'Gümüşhane': {benzin: 82.29, dizel: 102.39, lpg: null},
      'Hakkari': {benzin: 83.14, dizel: 103.33, lpg: null},
      'Hatay': {benzin: 82.25, dizel: 102.35, lpg: null},
      'Iğdır': {benzin: 83.06, dizel: 103.16, lpg: null},
      'Isparta': {benzin: 82.62, dizel: 102.81, lpg: null},
      'İstanbul (Anadolu)': {benzin: 80.36, dizel: 100.41, lpg: 40.6},
      'İstanbul (Avrupa)': {benzin: 80.51, dizel: 100.53, lpg: 41.2},
      'İzmir': {benzin: 81.8, dizel: 101.91, lpg: 41.2},
      'Kahramanmaraş': {benzin: 82.47, dizel: 102.59, lpg: null},
      'Karabük': {benzin: 81.85, dizel: 101.74, lpg: null},
      'Karaman': {benzin: 82.4, dizel: 102.5, lpg: null},
      'Kars': {benzin: 82.58, dizel: 102.69, lpg: null},
      'Kastamonu': {benzin: 82.22, dizel: 102.28, lpg: null},
      'Kayseri': {benzin: 82.52, dizel: 102.61, lpg: null},
      'Kırıkkale': {benzin: 81.82, dizel: 101.9, lpg: null},
      'Kırklareli': {benzin: 81.63, dizel: 101.73, lpg: null},
      'Kırşehir': {benzin: 81.86, dizel: 101.96, lpg: null},
      'Kilis': {benzin: 82.22, dizel: 102.33, lpg: null},
      'Kocaeli': {benzin: 80.96, dizel: 100.85, lpg: null},
      'Konya': {benzin: 82.53, dizel: 102.76, lpg: null},
      'Kütahya': {benzin: 82.47, dizel: 102.36, lpg: null},
      'Malatya': {benzin: 82.69, dizel: 102.79, lpg: null},
      'Manisa': {benzin: 81.88, dizel: 101.98, lpg: null},
      'Mardin': {benzin: 83, dizel: 103.19, lpg: null},
      'Mersin': {benzin: 82.34, dizel: 102.42, lpg: null},
      'Muğla': {benzin: 82.28, dizel: 102.41, lpg: null},
      'Muş': {benzin: 83.13, dizel: 103.31, lpg: null},
      'Nevşehir': {benzin: 82.42, dizel: 102.52, lpg: null},
      'Niğde': {benzin: 82.34, dizel: 102.43, lpg: null},
      'Ordu': {benzin: 82.13, dizel: 102.18, lpg: null},
      'Osmaniye': {benzin: 82.23, dizel: 102.34, lpg: null},
      'Rize': {benzin: 82.27, dizel: 102.37, lpg: null},
      'Sakarya': {benzin: 81.28, dizel: 101.15, lpg: null},
      'Samsun': {benzin: 82.1, dizel: 102.17, lpg: null},
      'Siirt': {benzin: 83.03, dizel: 103.22, lpg: null},
      'Sinop': {benzin: 82.16, dizel: 102.23, lpg: null},
      'Sivas': {benzin: 82.52, dizel: 102.59, lpg: null},
      'Şanlıurfa': {benzin: 82.67, dizel: 102.77, lpg: null},
      'Şırnak': {benzin: 83.11, dizel: 103.31, lpg: null},
      'Tekirdağ': {benzin: 81.23, dizel: 101.33, lpg: null},
      'Tokat': {benzin: 82.16, dizel: 102.23, lpg: null},
      'Trabzon': {benzin: 82.26, dizel: 102.36, lpg: null},
      'Tunceli': {benzin: 83.11, dizel: 103.27, lpg: null},
      'Uşak': {benzin: 82.28, dizel: 102.39, lpg: null},
      'Van': {benzin: 83.1, dizel: 103.23, lpg: null},
      'Yalova': {benzin: 81.24, dizel: 101.13, lpg: null},
      'Yozgat': {benzin: 82.2, dizel: 102.29, lpg: null},
      'Zonguldak': {benzin: 81.79, dizel: 101.68, lpg: null}
    },
    dagitici: [ // İstanbul Avrupa, 02.11.2026
      {ad: 'Petrol Ofisi', benzin: 80.40, dizel: 100.50, lpg: 41.20},
      {ad: 'Opet', benzin: 80.41, dizel: 100.43, lpg: null},
      {ad: 'Shell', benzin: 80.50, dizel: 100.50, lpg: 42.16},
      {ad: 'Aytemiz', benzin: 80.41, dizel: 100.44, lpg: 41.31},
      {ad: 'TotalEnergies', benzin: 80.50, dizel: 100.40, lpg: null}
    ]
  },
  // Şarj operatörleri, TL/kWh. Aralıklarda hesap orta değerle yapılır.
  sarj: [
    {ad: 'Trugo', ac: 9.95, dc: [12.00, 14.98], tarih: '2026-11-02', kaynak: 'trugo.com.tr/price (resmi)', url: 'https://www.trugo.com.tr/price'},
    {ad: 'ZES', ac: 10.99, dc: [12.99, 16.49], tarih: '2026-11-02', kaynak: 'zes.net fiyatlandırma (resmi)', url: 'https://zes.net/tr/fiyatlandirma'},
    {ad: 'Eşarj', ac: 9.90, dc: [9.90, 14.90], tarih: '2026-11-02', kaynak: 'doviz.com Yakıt & Şarj', url: 'https://www.doviz.com/yakit-sarj'},
    {ad: 'Astor Şarj', ac: 9.89, dc: [13.99, 13.99], tarih: '2026-11-02', kaynak: 'doviz.com Yakıt & Şarj', url: 'https://www.doviz.com/yakit-sarj'}
  ],
  // Konut elektriği, vergiler dahil TL/kWh (KDV hariç 2,92 ve 4,32 TL; %5 BTV, %1 enerji fonu, %10 KDV eklenerek)
  ev: {
    kademe1: 3.40, kademe2: 5.04, sinir_kwh_ay: 240,
    tarih: '2026-04-04', kaynak: 'EPDK 2026 2. çeyrek mesken tarifesi (akillitarife.com derlemesi)', url: 'https://akillitarife.com/enerji/rehber/tarife/elektrik',
    not: 'Tarife üç ayda bir değişebilir. Ekim 2026 haberlerinde 250 kWh için yaklaşık 820 TL fatura verilmesi bu birim fiyatla uyumlu. Faturanızdaki birim fiyatı yazarsanız hesap ona göre yapılır.'
  },
  // Köprü, tünel ve otoyol ücretleri, 1. sınıf (otomobil), KDV dahil, tek yön
  gecis: {
    tarih: '2026-07-01',
    kalemler: [
      {id: 'temmuz15', ad: '15 Temmuz Şehitler Köprüsü', tur: 'kopru', tl: 59, gecerli: '2026-01-01', not: 'Avrupa → Asya yönünde ücretli', kaynak: 'KGM tarifesi (yolcu360 derlemesi)', url: 'https://yolcu360.com/blog/kopru-ve-otoyol-ucretleri/'},
      {id: 'fsm', ad: 'Fatih Sultan Mehmet Köprüsü', tur: 'kopru', tl: 59, gecerli: '2026-01-01', not: 'Avrupa → Asya yönünde ücretli', kaynak: 'KGM tarifesi (yolcu360 derlemesi)', url: 'https://yolcu360.com/blog/kopru-ve-otoyol-ucretleri/'},
      {id: 'yss', ad: 'Yavuz Sultan Selim Köprüsü', tur: 'kopru', tl: 110, gecerli: '2026-07-01', kaynak: 'KGM duyurusu (Takvim, 30.06.2026)', url: 'https://www.takvim.com.tr/ekonomi/2026/06/30/kopru-ve-otoyol-gecis-ucretleri-guncellendi'},
      {id: 'osmangazi', ad: 'Osmangazi Köprüsü', tur: 'kopru', tl: 1170, gecerli: '2026-07-01', kaynak: 'KGM duyurusu (Takvim, 30.06.2026)', url: 'https://www.takvim.com.tr/ekonomi/2026/06/30/kopru-ve-otoyol-gecis-ucretleri-guncellendi'},
      {id: 'canakkale', ad: '1915 Çanakkale Köprüsü', tur: 'kopru', tl: 1170, gecerli: '2026-07-01', kaynak: 'KGM duyurusu (Takvim, 30.06.2026)', url: 'https://www.takvim.com.tr/ekonomi/2026/06/30/kopru-ve-otoyol-gecis-ucretleri-guncellendi'},
      {id: 'avrasya', ad: 'Avrasya Tüneli (gündüz)', tur: 'tunel', tl: 330, gecerli: '2026-07-01', not: 'Gece tarifesi 165 TL', kaynak: 'Nöbetçi Gazete, 01.07.2026', url: 'https://www.nobetcigazete.com/otoyol-kopru-ve-tunel-gecis-ucretlerine-zam-yapildi-iste-1-temmuz-2026-itibariyla-yeni-tarifeler'},
      {id: 'avrasyagece', ad: 'Avrasya Tüneli (gece)', tur: 'tunel', tl: 165, gecerli: '2026-07-01', kaynak: 'Nöbetçi Gazete, 01.07.2026', url: 'https://www.nobetcigazete.com/otoyol-kopru-ve-tunel-gecis-ucretlerine-zam-yapildi-iste-1-temmuz-2026-itibariyla-yeni-tarifeler'},
      {id: 'istizm', ad: 'İstanbul–İzmir Otoyolu, tam geçiş (Osmangazi dahil)', tur: 'otoyol', tl: 2525, gecerli: '2026-07-01', kaynak: 'İş Bankası blog, 23.07.2026', url: 'https://www.isbank.com.tr/blog/2026-kopru-ve-otoyol-ucretleri'},
      {id: 'ankniğde', ad: 'Ankara–Niğde Otoyolu, tam geçiş', tur: 'otoyol', tl: 925, gecerli: '2026-07-01', kaynak: 'KGM duyurusu (Takvim, 30.06.2026)', url: 'https://www.takvim.com.tr/ekonomi/2026/06/30/kopru-ve-otoyol-gecis-ucretleri-guncellendi'},
      {id: 'anadolu', ad: 'Anadolu Otoyolu, Çamlıca–Akıncı (Ankara)', tur: 'otoyol', tl: 338, gecerli: '2026-01-01', kaynak: 'İş Bankası blog, 23.07.2026', url: 'https://www.isbank.com.tr/blog/2026-kopru-ve-otoyol-ucretleri'},
      {id: 'avrupa', ad: 'Avrupa Otoyolu, Mahmutbey–Edirne', tur: 'otoyol', tl: 168, gecerli: '2026-01-01', kaynak: 'İş Bankası blog, 23.07.2026', url: 'https://www.isbank.com.tr/blog/2026-kopru-ve-otoyol-ucretleri'},
      {id: 'kmarmara', ad: 'Kuzey Marmara Otoyolu, Kınalı–Fatih', tur: 'otoyol', tl: 220, gecerli: '2026', kaynak: 'İş Bankası blog, 23.07.2026', url: 'https://www.isbank.com.tr/blog/2026-kopru-ve-otoyol-ucretleri'}
    ],
    resmi: {ad: 'KGM otoyol ve köprü ücret tarifeleri', url: 'https://www.kgm.gov.tr/'}
  },
  // 7574 sayılı Kanun ile değişen trafik cezaları (RG 27.02.2026, sayı 33181)
  ceza: {
    kanun: '7574 sayılı Karayolları Trafik Kanununda Değişiklik Yapılmasına Dair Kanun',
    rg: '27.02.2026, sayı 33181',
    kaynaklar: [
      {ad: 'Resmî Gazete, 27.02.2026, 7574 sayılı Kanun metni', url: 'https://www.resmigazete.gov.tr/eskiler/2026/02/20260227-0.htm'},
      {ad: 'TBB, 7574 sayılı Kanun karşılaştırma tablosu', url: 'https://www.tbb.gov.tr/sites/default/files/attachments/2026-02/karayollari-tk-karsilastirma-tablosu.pdf'},
      {ad: 'TŞOF, 7574 sayılı Kanun metni özeti', url: 'https://www.tsof.org.tr/2026/11/11.pdf'}
    ],
    gruplar: [
      {ad: 'Hız (madde 51), yerleşim yeri içi', satir: [
        ['6–10 km/s fazla', 2000], ['11–15 km/s fazla', 4000], ['16–20 km/s fazla', 6000], ['21–25 km/s fazla', 8000], ['26–35 km/s fazla', 12000],
        ['36–45 km/s fazla', 15000], ['46–55 km/s fazla', 20000, 'Ehliyete 30 gün el konur'], ['56–65 km/s fazla', 25000, 'Ehliyete 60 gün el konur'], ['66 km/s ve üzeri', 30000, 'Ehliyete 90 gün el konur']]},
      {ad: 'Hız (madde 51), yerleşim yeri dışı', satir: [
        ['11–15 km/s fazla', 2000], ['16–20 km/s fazla', 4000], ['21–25 km/s fazla', 6000], ['26–30 km/s fazla', 8000], ['31–40 km/s fazla', 12000],
        ['41–50 km/s fazla', 15000], ['51–60 km/s fazla', 20000, 'Ehliyete 30 gün el konur'], ['61–70 km/s fazla', 25000, 'Ehliyete 60 gün el konur'], ['71 km/s ve üzeri', 30000, 'Ehliyete 90 gün el konur']]},
      {ad: 'Kırmızı ışık (madde 47), bir yıl içindeki tekrarlar', satir: [
        ['1. ihlal', 5000], ['2. ihlal', 10000], ['3. ihlal', 15000, 'Ehliyete 30 gün el konur'], ['4. ihlal', 20000, 'Ehliyete 60 gün el konur'],
        ['5. ihlal', 30000, 'Ehliyete 90 gün el konur'], ['6. ihlal', 80000, 'Ehliyet iptal'], ['Dur ihtarına uymayıp kaçmak', 200000, 'Ehliyet ve araç 60 gün']]},
      {ad: 'Alkol ve uyuşturucu (madde 48)', satir: [
        ['0,50 promil üstü, ilk kez', 25000, 'Ehliyete 6 ay el konur'], ['5 yıl içinde 2. kez', 50000, 'Ehliyete 2 yıl el konur'], ['5 yıl içinde 3. kez ve sonrası', 150000, 'Ehliyete 5 yıl el konur'],
        ['Uyuşturucu ya da uyarıcı madde etkisinde', 150000, 'Ehliyet iptal, ayrıca ceza davası'], ['Teste girmeyi reddetmek', 150000, 'Ehliyete 5 yıl el konur']]},
      {ad: 'Sürücü belgesi (madde 36)', satir: [
        ['Ehliyetsiz araç kullanmak', 40000], ['Ehliyetine el konulmuşken ya da iptal edilmişken kullanmak', 200000], ['Aracını ehliyetsiz kişiye veren sahibi', 40000]]},
      {ad: 'Plaka (madde 23)', satir: [
        ['Standarda uymayan plaka', 4000, 'Araç düzeltilene kadar trafikten men'], ['Plakayı okunamaz hale getirmek', 140000, 'Araç 30 gün trafikten men'],
        ['Plakasız araç kullanmak', 46000, 'Ehliyet ve araç 30 gün'], ['Sahte ya da başka araca ait plaka', 140000, 'Ehliyet ve araç 30 gün']]},
      {ad: 'Seyir halinde (madde 46, 55, 67, 73, 78)', satir: [
        ['Cep telefonu, ilk kez', 5000], ['Cep telefonu, bir yılda 2. kez', 10000], ['Cep telefonu, bir yılda 3. kez ve sonrası', 20000, 'Ehliyete 30 gün el konur'],
        ['Emniyet kemeri takmamak', 2500, 'Bir yılda 4. kezde ehliyete el konur'], ['15 yaş altı çocuğu güvenlik sistemi olmadan taşımak', 5000],
        ['Ambulans ya da itfaiyeye yol vermemek', 46000, 'Ehliyet ve araç 30 gün'], ['Diğer geçiş üstünlüğü olan araçlara yol vermemek', 15000], ['Otoyolda ya da şehirlerarası bölünmüş yolda ters yön', 90000, 'Ehliyet ve araç 60 gün'],
        ['Konvoyla yol kapatmak', 90000, 'Ehliyet ve araç 60 gün'], ['Saldırmak amacıyla takip etmek ya da araçtan inmek', 180000, 'Ehliyet ve araç 60 gün'],
        ['Drift ve tehlikeli manevra (madde 67/1-d)', 140000, 'Ehliyet ve araç 60 gün']]},
      {ad: 'Diğer', satir: [
        ['Kış lastiği kuralına uymamak', 6000], ['Kurala aykırı ses, görüntü ya da ekran cihazı', 21000, 'Araç 30 gün trafikten men'], ['Gürültü yapan izinsiz değişiklik (sürücüye)', 16000, 'Araç 30 gün trafikten men'], ['İzinsiz teknik değişiklik (işletene)', 5000, 'Araç uygun hale gelene kadar men'],
        ['Radar dedektörü bulundurmak', 185000, 'Cihaz müsadere edilir'], ['Trafik ihlalini sosyal medyada paylaşmak ya da övmek', 25000],
        ['İzinsiz yarışa katılmak', 46000, 'Ehliyete 2 yıl el konur'], ['Kazalı yerden izinsiz ayrılmak (maddi hasarlı)', 46000]]}
    ],
    indirim: 'Ceza tebliğden itibaren 15 gün içinde ödenirse %25 indirim uygulanır (5326 sayılı Kabahatler Kanunu madde 17/6).',
    itiraz: 'Tebliğden itibaren 15 gün içinde sulh ceza hâkimliğine başvurulabilir (5326 sayılı Kabahatler Kanunu madde 27).'
  },
  // Engelli ÖTV istisnası
  otv: {
    sinir: 2873900, yil: 2026,
    sinir_kaynak: {ad: 'PwC Türkiye, KDV ve ÖTV Bülteni 2026/2 (ÖTV Kanunu 7/2 ve 7/6)', url: 'https://www.pwc.com.tr/tr/hizmetlerimiz/vergi/dolayli-vergi/bultenler/kdv-otv-bultenleri/2026/yeniden-degerleme-oranina-gore-2026-yili-maktu.html'},
    marka_kaynak: {ad: 'Fiat Türkiye, Engelsiz Otomobil sayfası', url: 'https://www.fiat.com.tr/engelsiz-otomobil'},
    teblig_kaynak: {ad: 'Kadim Hukuk, Engelli raporu ile ÖTV muafiyetli araç alımı (17 Seri No.lu ÖTV Tebliği)', url: 'https://kadimhukuk.com.tr/makale/engelli-raporu-ile-otv-muafiyetli-arac-alimi/'},
    uretim_kaynak: {ad: 'Otometre, 2026\'da Türkiye\'de üretilen otomobiller', url: 'https://www.otometre.com/2026/01/2026da-turkiyede-uretilen-ve-uretilecek.html'},
    // Türkiye'de üretilen modeller [marka, model, fabrika, kasa şartı]. Yerlilik oranı %40 şartını marka/bayi teyit eder.
    yerli: [
      ['Togg', 'T10X', 'Togg, Gemlik'], ['Togg', 'T10F', 'Togg, Gemlik'],
      ['Fiat', 'Egea', 'Tofaş, Bursa'], ['Fiat', 'Egea Cross', 'Tofaş, Bursa'], ['Fiat', 'Doblo', 'Tofaş, Bursa'],
      ['Opel', 'Combo', 'Tofaş, Bursa'], ['Citroën', 'Berlingo', 'Tofaş, Bursa'], ['Peugeot', 'Partner', 'Tofaş, Bursa'], ['Peugeot', 'Rifter', 'Tofaş, Bursa'],
      ['Renault', 'Clio', 'Oyak Renault, Bursa'], ['Renault', 'Clio (6. nesil)', 'Oyak Renault, Bursa'], ['Renault', 'Duster', 'Oyak Renault, Bursa'], ['Renault', 'Boreal', 'Oyak Renault, Bursa'],
      ['Renault', 'Megane', 'Karsan, Bursa', 'Sedan'],
      ['Hyundai', 'i20', 'Hyundai Assan, İzmit'], ['Hyundai', 'Bayon', 'Hyundai Assan, İzmit'],
      ['Toyota', 'Corolla', 'Toyota Otomotiv, Sakarya', 'Sedan'], ['Toyota', 'C-HR', 'Toyota Otomotiv, Sakarya']
    ]
  }
};
