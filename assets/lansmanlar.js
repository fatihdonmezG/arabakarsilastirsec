/* Lansman takvimi. Haftalık haber görevi günceller.
 * yakinda: Türkiye'ye gelmesi beklenen modeller. beklenen: 'YYYY-AA' (ay biliniyorsa) ya da 'YYYY-Ç1' (çeyrek) ya da 'YYYY';
 *   dayanak: tarihi kim söyledi ('marka' = marka/distribütör açıklaması, 'basin' = haberde yazan, marka teyidi yok).
 *   Satışa çıkınca kayıt "cikanlar"a taşınır.
 * cikanlar: Türkiye'de satışa çıkan yeni modeller (son 6 ay). tarih: satışa çıkış ya da duyuru tarihi.
 * marka/model karsilastirma.html'deki adlarla yazılırsa sayfa araç sayfasına bağlantı verir. Fiyat yazılmaz. */
window.LANSMANLAR = {
  guncelleme: '2026-10-25',
  yakinda: [
    {marka:'Fiat', model:'Grizzlyz', beklenen:'2026-12', dayanak:'basin',
     ozet:'Egea\'nın yerini alacak B-SUV. Önce 145 hp\'lik hibrit versiyon, Fastback gövdeyle birlikte gelecek. Fiat, modelin Türkiye\'de test edildiğini açıkladı.',
     kaynak:[['Akşam (AA)','https://www.aksam.com.tr/otomobil/paristen-turkiyeye-yeni-model-yagmuru/haber-1707321'],['İşçi Haber','https://www.iscihaber.net/otomobil/paris-otomobil-fuarinda-tanitilan-yeni-modeller-turkiye-pazarina-ne-zaman-girecek/272701']]},
    {marka:'Dacia', model:'Striker', beklenen:'2026-12', dayanak:'basin',
     ozet:'Dacia\'nın yeni modeli için Türkiye satışının aralıkta başlaması bekleniyor.',
     kaynak:[['Akşam (AA)','https://www.aksam.com.tr/otomobil/paristen-turkiyeye-yeni-model-yagmuru/haber-1707321'],['İşçi Haber','https://www.iscihaber.net/otomobil/paris-otomobil-fuarinda-tanitilan-yeni-modeller-turkiye-pazarina-ne-zaman-girecek/272701']]},
    {marka:'Hyundai', model:'Bayon', beklenen:'2027-Ç1', dayanak:'basin',
     ozet:'Yeni nesil Bayon Paris fuarında tanıtıldı. İzmit fabrikasında üretilecek ve hibrit seçenekle satışa çıkacak; üretim ve satışın 2027\'nin ilk çeyreğinde başlaması bekleniyor.',
     kaynak:[['NTV','https://www.ntv.com.tr/otomobil/galeri-hyundai-yeni-suv-modellerini-pariste-tanitti-1746023'],['Akşam (AA)','https://www.aksam.com.tr/otomobil/paristen-turkiyeye-yeni-model-yagmuru/haber-1707321']]},
    {marka:'Volkswagen', model:'ID. Tiguan', beklenen:'2027', dayanak:'marka',
     ozet:'ID.4 ve ID.5\'in yerini alacak elektrikli SUV. Volkswagen Avrupa satışını 2027 başı için planlıyor; Türkiye takvimi henüz açıklanmadı.',
     kaynak:[['NTV','https://www.ntv.com.tr/otomobil/galeri-bir-efsane-daha-elektrikleniyor-volkswagen-id-tiguan-icin-tarih-belli-oldu-1743932']]}
  ],
  cikanlar: [
    {marka:'Audi', model:'Q4 e-tron', tarih:'2026-10-16',
     ozet:'Yenilenen Q4 e-tron SUV ve Sportback gövdeyle, 63, 82 ve 84 kWh batarya seçenekleriyle satışta. WLTP menzil 576 km\'ye kadar çıkıyor.',
     kaynak:[['LOG','https://www.log.com.tr/yeni-audi-q4-e-tron-turkiyede-satisa-sunuldu/'],['Webtekno','https://www.webtekno.com/yeni-audi-q4-e-tron-turkiye-de-satisa-sunuldu-iste-fiyati-ve-ozellikleri-h227347.html']]},
    {marka:'Hyundai', model:'IONIQ 3', tarih:'2026-10-09',
     ozet:'Kocaeli\'de üretilen elektrikli IONIQ 3 dört versiyonla satışta. 42,2 kWh LFP bataryalı giriş versiyonu 343 km, 61 kWh bataryalı versiyonlar 435 ile 482 km arası WLTP menzil sunuyor.',
     kaynak:[['NTV','https://www.ntv.com.tr/otomobil/hyundai-piyasaya-hizli-giris-yapti-fiyati-1-milyon-799-binden-basliyor-1745590']]},
    {marka:'BYD', model:'Sealion 7', tarih:'2026-09-10',
     ozet:'BYD\'nin elektrikli SUV\'u Sealion 7 Türkiye\'de satışa sunuldu. Aynı tanıtımda küçük SUV ATTO 2 de gösterildi.',
     kaynak:[['Otonom Haber','https://otonomhaber.com/2026/09/turkiyede-iki-yeni-modelin-tanitimi-ve-fiyat-bilgileri/']]}
  ]
};
