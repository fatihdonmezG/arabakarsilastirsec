/* Bir rotanın üzerindeki olası ücretli geçişler. İl merkezleri arası her bacak için hangi köprü, tünel ve otoyolun
   kullanılabileceğini il gruplarına göre belirler (ör. İstanbul–Ankara: Boğaz geçişi + Anadolu Otoyolu; Çanakkale Köprüsü yok).
   Sonuç bir öneridir; kullanıcı işaretleyerek ekler. */
(function () {
  const TRAKYA = ['Edirne', 'Kırklareli', 'Tekirdağ'];
  const IST = 'İstanbul';
  const KUZEYBATI = ['İstanbul', 'Kocaeli', 'Sakarya', 'Yalova', ...TRAKYA];
  const GUNEY_MARMARA = ['Bursa', 'Yalova', 'Balıkesir'];
  const EGE_IZMIR = ['İzmir', 'Manisa', 'Aydın', 'Muğla'];
  const CANAKKALE_KARSI = ['Çanakkale', 'Balıkesir', 'İzmir', 'Manisa', 'Aydın', 'Muğla', 'Denizli'];
  const ANADOLU_DOGU = ['Bolu', 'Düzce', 'Ankara', 'Kırıkkale', 'Çankırı', 'Çorum', 'Kırşehir', 'Yozgat', 'Kastamonu', 'Karabük', 'Bartın', 'Zonguldak', 'Samsun', 'Amasya', 'Tokat', 'Sivas', 'Kayseri', 'Nevşehir', 'Aksaray', 'Niğde', 'Sinop', 'Ordu', 'Giresun', 'Trabzon', 'Rize', 'Artvin', 'Gümüşhane', 'Bayburt', 'Erzincan', 'Erzurum', 'Kars', 'Ardahan', 'Iğdır', 'Ağrı', 'Malatya', 'Elazığ', 'Tunceli', 'Bingöl', 'Muş', 'Bitlis', 'Van', 'Hakkari', 'Diyarbakır', 'Batman', 'Siirt', 'Şırnak', 'Mardin', 'Adana', 'Mersin', 'Hatay', 'Osmaniye', 'Gaziantep', 'Kilis', 'Kahramanmaraş', 'Şanlıurfa', 'Adıyaman'];
  const ANKARA_KUZEYBATI = ['Ankara', 'İstanbul', 'Kocaeli', 'Sakarya', 'Düzce', 'Bolu', 'Eskişehir', 'Bilecik', 'Bursa', 'Kırıkkale', 'Çankırı', 'Zonguldak', 'Karabük', 'Bartın', ...TRAKYA];
  const GUNEYDOGU = ['Niğde', 'Adana', 'Mersin', 'Hatay', 'Osmaniye', 'Gaziantep', 'Kilis', 'Kahramanmaraş', 'Şanlıurfa', 'Adıyaman', 'Mardin', 'Diyarbakır', 'Batman', 'Siirt', 'Şırnak'];
  const ic = (l, x) => l.includes(x);
  const iki = (a, b, A, B) => (ic(A, a) && ic(B, b)) || (ic(A, b) && ic(B, a));
  function bacak(a, b) {
    const s = [];
    if (a === b) return s;
    const anadolu = x => x !== IST && !ic(TRAKYA, x);
    // Boğaz: Trakya ile Anadolu arası her zaman; İstanbul'dan Anadolu'ya ya da Trakya'ya yalnızca karşı yakadan çıkılıyorsa
    const canakYolu = iki(a, b, TRAKYA, CANAKKALE_KARSI) || iki(a, b, [IST], ['Çanakkale']);
    if (!canakYolu && ((ic(TRAKYA, a) && anadolu(b)) || (ic(TRAKYA, b) && anadolu(a)))) s.push({id: 'bogaz', not: 'Boğaz geçişi: köprülerden ya da tünelden biri'}, {id: 'kmarmara', not: 'Şehre girmeden Yavuz Sultan Selim Köprüsü ile geçerseniz'});
    else if ((a === IST && (anadolu(b) || ic(TRAKYA, b))) || (b === IST && (anadolu(a) || ic(TRAKYA, a)))) s.push({id: 'bogaz', not: 'İstanbul\'un karşı yakasından çıkıyorsanız: köprülerden ya da tünelden biri'});
    if (canakYolu) s.push({id: 'canakkale'});
    if (iki(a, b, KUZEYBATI, EGE_IZMIR)) s.push({id: 'istizm', not: 'Osmangazi Köprüsü dahil; yalnızca köprüyü kullanırsanız onu seçin', alt: 'osmangazi'});
    else if (iki(a, b, ['İstanbul', 'Kocaeli', 'Sakarya', 'Düzce', ...TRAKYA], [...GUNEY_MARMARA.filter(x => x !== 'Yalova'), 'Çanakkale', 'Bilecik', 'Kütahya'].filter(x => !(canakYolu && x === 'Çanakkale')))) s.push({id: 'osmangazi'});
    if (iki(a, b, ['İstanbul', ...TRAKYA], ANADOLU_DOGU)) s.push({id: 'anadolu', not: 'Çamlıca–Akıncı tam geçiş; yolun bir kısmını kullanırsanız ücret daha düşük olur'});
    else if (iki(a, b, ['Kocaeli', 'Sakarya'], ANADOLU_DOGU.filter(x => x !== 'Düzce' || true))) s.push({id: 'anadolu', not: 'Yolun bir kısmı; tam geçiş ücreti gösteriliyor'});
    if (iki(a, b, ANKARA_KUZEYBATI, GUNEYDOGU)) s.push({id: 'ankniğde'});
    if (iki(a, b, [IST], ['Edirne', 'Kırklareli']) || iki(a, b, ['Edirne', 'Kırklareli'], ANADOLU_DOGU.concat(KUZEYBATI.filter(x => x !== IST && !ic(TRAKYA, x))))) s.push({id: 'avrupa'});
    return s;
  }
  window.rotaGecisleri = function (iller) {
    const out = new Map();
    for (let i = 0; i < iller.length - 1; i++) for (const g of bacak(iller[i], iller[i + 1])) { const o = out.get(g.id); out.set(g.id, o ? {...o, sayi: o.sayi + 1} : {...g, sayi: 1}); }
    return [...out.values()];
  };
})();
