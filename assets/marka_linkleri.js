(function () {
  const L = {
    'Renault': {
      bayi: 'https://www.renault.com.tr/yetkili-satici-bul.html',
      bakim: 'https://www.renault.com.tr/satis-sonrasi-hizmetler/dusuk-fiyat.html'
    },
    'Fiat': {
      test: 'https://www.otomobil.fiat.com.tr/araclar/test-surusu',
      bayi: 'https://www.fiat.com.tr/araclar/en-yakin-fiat',
      servis: 'https://www.fiat.com.tr/satis-sonrasi/bakim-ve-yetkili-servis-hizmetleri/hizli-servis-randevusu',
      bakim: 'https://otomobil.fiat.com.tr/satis-sonrasi/bakim-yetkili-servis/bakim-paketleri'
    },
    'Volkswagen': {
      test: 'https://binekarac.vw.com.tr/tr/formlar/test-surusu-formu.html',
      bayi: 'https://binekarac.vw.com.tr/tr/volkswagen-yetkili-satici-servisler.html',
      servis: 'https://binekarac.vw.com.tr/tr/formlar/online-servis-randevu-formu.html'
    },
    'Hyundai': {
      teklif: 'https://www.hyundai.com/tr/tr/formlar/teklif-al-formu.html',
      test: 'https://www.hyundai.com/tr/tr/formlar/test-surusu.html',
      bayi: 'https://www.hyundai.com/tr/tr/yetkili-saticilar-ve-servisler.html'
    },
    'Toyota': {
      test: 'https://testsurusu.toyota.com.tr/',
      servis: 'https://www.toyota.com.tr/satis-sonrasi-hizmetler/servis-yedek-parca/online-servis-randevusu',
      bakim: 'https://www.toyota.com.tr/satis-sonrasi-hizmetler/servis-yedek-parca/toyota-bakim-paketleri'
    },
    'Ford': {
      test: 'https://www.ford.com.tr/test-surusu',
      bayi: 'https://www.ford.com.tr/ford-bayileri',
      servis: 'https://www.ford.com.tr/servis-randevu-yeni',
      bakim: 'https://www.ford.com.tr/bakim-ve-onarimlar/bakim-paketi-hesaplama-araci'
    },
    'Peugeot': {
      teklif: 'https://talep.peugeot.com.tr/test-surusu',
      servis: 'https://talep.peugeot.com.tr/satis-sonrasi',
      bakim: 'https://www.peugeot.com.tr/satis-sonrasi/bakim.html'
    },
    'Mercedes-Benz': {
      test: 'https://www.mercedes-benz.com.tr/passengercars/mercedes-benz-cars/online-testdrive.html',
      bayi: 'https://www.mercedes-benz.com.tr/passengercars/mercedes-benz-cars/dealer-locator.html',
      servis: 'https://www.mercedes-benz.com.tr/passengercars/services/online-appointment-booking.html',
      bakim: 'https://www.mercedes-benz.com.tr/passengercars/services/maintenance.html'
    },
    'Skoda': {
      teklif: 'https://www.skoda.com.tr/satis-iletisim-formu',
      bayi: 'https://www.skoda.com.tr/yetkili-satici-ve-servisler',
      servis: 'https://www.skoda.com.tr/skoda-servis/servis-ve-bakim-randevusu',
      bakim: 'https://www.skoda.com.tr/skoda-servis/servis-ve-bakim'
    },
    'Opel': {
      bakim: 'https://www.opel.com.tr/opel-sahipleri/kontroller-periyodik-bakimlar/periyodik-bakimlar.html'
    }
  };
  const ETIKET = {
    teklif: 'Teklif al',
    test: 'Test sürüşü',
    bayi: 'Yetkili satıcı bul',
    servis: 'Servis randevusu',
    bakim: 'Bakım paketleri'
  };
  const SATIS = ['teklif', 'test', 'bayi'], SERVIS = ['servis', 'bakim'];
  const esc = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const btn = (m, t, u) => `<a class="mlink" href="${esc(u)}" target="_blank" rel="noopener nofollow">${ETIKET[t]} ↗</a>`;

  // satista: araç Türkiye'de sıfır olarak satılıyor mu. Satıştakilerde satış ve servis bağlantıları,
  // eskilerde yalnızca servis bağlantıları gösterilir. Bağlantı yoksa boş metin döner.
  window.MARKA_LINKLERI = L;
  // Karşılaştırma başlığı için kısa satır: satıştakilerde teklif/test ve satıcı, eskilerde servis ve bakım (en çok 2 bağlantı).
  window.markaLinkKisa = function (marka, satista) {
    const m = L[marka];
    if (!m) return '';
    const ts = (satista ? [m.teklif ? 'teklif' : 'test', 'bayi'] : SERVIS).filter(t => m[t]);
    return ts.length ? `<div class="hml">${ts.map(t => `<a href="${esc(m[t])}" target="_blank" rel="noopener nofollow">${ETIKET[t]} ↗</a>`).join(' · ')}</div>` : '';
  };
  window.markaLinkKutusu = function (marka, satista) {
    const m = L[marka];
    if (!m) return '';
    const sat = satista ? SATIS.filter(t => m[t]) : [];
    const ser = SERVIS.filter(t => m[t]);
    if (!sat.length && !ser.length) return '';
    const satir = (baslik, ts) => ts.length ? `<div class="mlsatir"><span class="mlbas">${baslik}</span>${ts.map(t => btn(marka, t, m[t])).join('')}</div>` : '';
    return `<b>${esc(marka)} Türkiye resmi sitesinde</b>` +
      satir('Satın alma', sat) + satir(satista ? 'Servis' : 'Bu aracın servisi', ser) +
      `<p class="mlnot">Bağlantılar markanın resmi sitesinde yeni sekmede açılır. Bu site markayla bağlantılı değildir.</p>`;
  };
})();
