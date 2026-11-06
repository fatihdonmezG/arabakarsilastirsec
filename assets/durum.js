/* Bölümlerin yayın durumu tek yerden: ana sayfa duyurusu, "Yeni" ve "Yakında" etiketleri ve bölüm sayfalarındaki notlar buradan okunur.
   durum: 'yayinda' | 'hazirlaniyor'. yeni: yayına giriş tarihi; 45 gün boyunca "Yeni" etiketi gösterilir.
   Üyeliğe bağlı bölümler (forum, üyelik) assets/uye-ayar.js doluysa kendiliğinden "yayinda" olur. */
(function () {
  const uyelikAcik = () => !!(window.UYE_AYAR && window.UYE_AYAR.url && window.UYE_AYAR.anonKey);
  const B = {
    'butce.html':           { ad: 'Bütçeme göre araç bul', durum: 'yayinda', yeni: '2026-11-07' },
    'yol-maliyeti.html':    { ad: 'Rota ve yol maliyeti', durum: 'yayinda', yeni: '2026-10-28' },
    'sarj-hesaplama.html':  { ad: 'Şarj hesaplayıcı', durum: 'yayinda', yeni: '2026-10-28' },
    'gecis-ucretleri.html': { ad: 'Köprü ve otoyol', durum: 'yayinda', yeni: '2026-10-28' },
    'trafik-cezalari.html': { ad: 'Trafik cezaları', durum: 'yayinda', yeni: '2026-10-28' },
    'otv-muafiyet.html':    { ad: 'ÖTV muafiyeti', durum: 'yayinda', yeni: '2026-10-28' },
    'brosurler.html':       { ad: 'Broşürler', durum: 'yayinda', yeni: '2026-10-30' },
    'forum.html':           { ad: 'Forum', durum: () => uyelikAcik() ? 'yayinda' : 'hazirlaniyor', not: 'Kategoriler okunabilir; konu açmak ve cevap yazmak üyelikle açılacak.' },
    'uye.html':             { ad: 'Üyelik ve garajım', durum: () => uyelikAcik() ? 'yayinda' : 'hazirlaniyor' }
  };
  const gun = 864e5;
  function durum(h) { const b = B[h]; if (!b) return 'yayinda'; return typeof b.durum === 'function' ? b.durum() : b.durum; }
  function yeniMi(h) { const b = B[h]; return !!(b && b.yeni && durum(h) === 'yayinda' && (Date.now() - new Date(b.yeni + 'T00:00:00')) < 45 * gun); }
  function etiket(h) { return durum(h) === 'hazirlaniyor' ? '<span class="yeni yakinda">Yakında</span>' : yeniMi(h) ? '<span class="yeni">Yeni</span>' : ''; }
  function duyuru() {
    const yeni = Object.keys(B).filter(yeniMi).map(h => B[h].ad), hz = Object.keys(B).filter(h => durum(h) === 'hazirlaniyor' && h !== 'uye.html').map(h => B[h].ad);
    if (!yeni.length && !hz.length) return null;
    const bir = a => a.length > 1 ? a.slice(0, -1).join(', ') + ' ve ' + a[a.length - 1] : a[0];
    return { metin: (yeni.length ? (yeni.length > 2 ? `${yeni[0]}, ${yeni[1]} ve ${yeni.length - 2} bölüm daha yayında` : `${bir(yeni)} yayında`) : '') + (hz.length ? `${yeni.length ? '; ' : ''}${bir(hz)} hazırlanıyor` : ''), href: yeni.length ? 'hesaplama.html' : Object.keys(B).find(h => durum(h) === 'hazirlaniyor') };
  }
  window.BOLUM = { B, durum, yeniMi, etiket, duyuru };
})();
