/* Telefon ve tablette üst menü: hamburger düğmesi + açılır panel. "Karşılaştır" düğmesi çubukta kalır. */
(function () {
  function kur() {
    const top = document.querySelector('header.top'), nav = top && top.querySelector('.nav');
    if (!nav || top.querySelector('.menu-btn')) return;
    const wrap = nav.parentElement;
    if (!nav.id) nav.id = 'siteMenu';
    const cta = nav.querySelector('a.cta');
    if (cta) { const c = cta.cloneNode(true); c.classList.add('cta-mobil'); c.removeAttribute('aria-current'); wrap.insertBefore(c, nav); }
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'menu-btn'; b.setAttribute('aria-controls', nav.id); b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-label', 'Menüyü aç');
    b.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path class="m1" d="M4 7h16"/><path class="m2" d="M4 12h16"/><path class="m3" d="M4 17h16"/></svg>';
    wrap.insertBefore(b, nav);
    const kapat = () => { top.classList.remove('menu-acik'); b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-label', 'Menüyü aç'); };
    b.addEventListener('click', e => {
      e.stopPropagation();
      const acik = top.classList.toggle('menu-acik');
      b.setAttribute('aria-expanded', String(acik)); b.setAttribute('aria-label', acik ? 'Menüyü kapat' : 'Menüyü aç');
    });
    document.addEventListener('click', e => { if (top.classList.contains('menu-acik') && !nav.contains(e.target)) kapat(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && top.classList.contains('menu-acik')) { kapat(); b.focus(); } });
    nav.addEventListener('click', e => { if (e.target.closest('a')) kapat(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur); else kur();
})();

/* Alt bilgi: her sayfada aynı bağlantı sütunları. Sayfanın kendi notu altta kalır. */
(function () {
  const S = [
    ['Araçlar', [['araclar.html', 'Tüm araçlar'], ['karsilastirma.html', 'Karşılaştır'], ['sistem-puani.html', 'Sistem puanı'], ['brosurler.html', 'Broşürler'], ['kampanyalar.html', 'Kampanyalar']]],
    ['Hesaplama', [['yol-maliyeti.html', 'Rota ve yol maliyeti'], ['sarj-hesaplama.html', 'Şarj hesaplayıcı'], ['gecis-ucretleri.html', 'Köprü ve otoyol'], ['trafik-cezalari.html', 'Trafik cezaları'], ['otv-muafiyet.html', 'ÖTV muafiyeti'], ['mtv-hesaplama.html', 'MTV']]],
    ['Gündem', [['haberler.html', 'Haberler'], ['lansmanlar.html', 'Lansmanlar'], ['incelemeler.html', 'İncelemeler'], ['oduller.html', 'Ödüller'], ['piyasa.html', 'Pazar verisi']]],
    ['Topluluk ve rehber', [['yorumlar.html', 'Sahip yorumları'], ['forum.html', 'Forum'], ['rehber.html', 'El kitabı'], ['ehliyet.html', 'Ehliyet'], ['sozluk.html', 'Teknik sözlük']]]
  ];
  function kur() {
    const f = document.querySelector('footer');
    if (!f || f.querySelector('.alt-menu')) return;
    if (f.closest('main')) document.body.insertBefore(f, f.closest('main').nextSibling);
    let w = f.querySelector(':scope > .wrap');
    if (!w) { w = document.createElement('div'); w.className = 'wrap'; while (f.firstChild) w.appendChild(f.firstChild); f.appendChild(w); }
    const m = document.createElement('div');
    m.className = 'alt-menu';
    m.innerHTML = '<div class="am-marka"><b><i>A</i>Araba Karşılaştır ve Seç</b><p>Türkiye\'de satılan otomobilleri resmi kaynaklarıyla karşılaştıran bağımsız site. Araç satmıyoruz.</p></div>' +
      S.map(([b, l]) => `<nav aria-label="${b}"><h4>${b}</h4><ul>${l.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul></nav>`).join('');
    w.insertBefore(m, w.firstChild);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur); else kur();
})();
