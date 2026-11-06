/* Üst menü: masaüstünde beş ana bağlantı; diğer bölümler, site rengi ve üyelik "Menü" panelinde. Telefonda yalnızca Menü ve Karşılaştır. */
window.SITE_HARITA = [
  ['Araçlar', [['araclar.html', 'Tüm araçlar'], ['butce.html', 'Bütçeme göre bul'], ['arac/index.html', 'Araç sayfaları A-Z'], ['karsilastirma.html', 'Karşılaştır'], ['sistem-puani.html', 'Sistem puanı'], ['brosurler.html', 'Broşürler'], ['kampanyalar.html', 'Kampanyalar']]],
  ['Hesaplama', [['hesaplama.html', 'Bütün hesaplamalar'], ['yol-maliyeti.html', 'Rota ve yol maliyeti'], ['sarj-hesaplama.html', 'Şarj hesaplayıcı'], ['gecis-ucretleri.html', 'Köprü ve otoyol'], ['trafik-cezalari.html', 'Trafik cezaları'], ['otv-muafiyet.html', 'ÖTV muafiyeti'], ['mtv-hesaplama.html', 'MTV']]],
  ['Gündem', [['haberler.html', 'Haberler'], ['lansmanlar.html', 'Lansmanlar'], ['incelemeler.html', 'İncelemeler'], ['oduller.html', 'Ödüller'], ['piyasa.html', 'Pazar verisi']]],
  ['Topluluk ve rehber', [['yorumlar.html', 'Sahip yorumları'], ['forum.html', 'Forum'], ['rehber.html', 'El kitabı'], ['ehliyet.html', 'Ehliyet'], ['sozluk.html', 'Teknik sözlük']]]
];
window.SITE_KOK = /\/arac\//.test(location.pathname) ? '../' : '';
(function () {
  const ANA = ['araclar.html', 'kampanyalar.html', 'haberler.html', 'hesaplama.html', 'forum.html'];
  const sayfa = (location.pathname.split('/').pop() || 'index.html');
  function kur() {
    const top = document.querySelector('header.top'), nav = top && top.querySelector('.nav');
    if (!nav || top.querySelector('.ust-sag')) return;
    nav.querySelectorAll('a').forEach(a => {
      const h = (a.getAttribute('href') || '').split('#')[0];
      if (!a.classList.contains('cta') && !a.classList.contains('uye-link') && !ANA.includes(h)) a.classList.add('ikincil');
    });
    const sag = document.createElement('div');
    sag.className = 'ust-sag';
    sag.innerHTML = '<button type="button" class="menu-ac" aria-expanded="false" aria-controls="menuPanel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg><span>Menü</span></button><a class="kiyas" href="' + window.SITE_KOK + 'karsilastirma.html">Karşılaştır</a>';
    nav.parentElement.appendChild(sag);
    const panel = document.createElement('div');
    panel.className = 'menu-panel'; panel.id = 'menuPanel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Site menüsü');
    panel.innerHTML = '<div class="wrap">' + window.SITE_HARITA.map(([b, l]) => `<nav aria-label="${b}"><h4>${b}</h4><ul>${l.map(([h, t]) => `<li><a href="${window.SITE_KOK + h}"${h === sayfa ? ' aria-current="page"' : ''}>${t}</a></li>`).join('')}</ul></nav>`).join('') + '<div class="mp-alt"><a href="' + window.SITE_KOK + 'uye.html">Üyelik ve garajım</a><a href="' + window.SITE_KOK + 'index.html">Ana sayfa</a></div></div>';
    const perde = document.createElement('div'); perde.className = 'menu-perde';
    document.body.appendChild(perde); document.body.appendChild(panel);
    // Renk seçici: geniş ekranda üst çubukta, dar ekranda menü panelinde
    const dar = window.matchMedia('(max-width:640px)');
    const yerlestir = () => { const r = top.querySelector('.renk-sec') || panel.querySelector('.renk-sec'); if (!r) return; if (dar.matches) panel.querySelector('.mp-alt').prepend(r); else sag.prepend(r); };
    yerlestir(); dar.addEventListener ? dar.addEventListener('change', yerlestir) : dar.addListener(yerlestir);
    const btn = sag.querySelector('.menu-ac');
    const ac = v => { panel.classList.toggle('acik', v); perde.classList.toggle('acik', v); btn.setAttribute('aria-expanded', String(v)); btn.querySelector('span').textContent = v ? 'Kapat' : 'Menü'; };
    btn.addEventListener('click', e => { e.stopPropagation(); ac(!panel.classList.contains('acik')); });
    perde.addEventListener('click', () => ac(false));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('acik')) { ac(false); btn.focus(); } });
    // tema.js renk seçiciyi sonradan eklerse yerine taşı
    new MutationObserver(() => { if (nav.querySelector('.renk-sec')) yerlestir(); }).observe(nav, {childList: true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur); else kur();
})();

/* Alt bilgi: her sayfada aynı bağlantı sütunları. Sayfanın kendi notu altta kalır. */
(function () {
  const S = window.SITE_HARITA;
  function kur() {
    const f = document.querySelector('footer');
    if (!f || f.querySelector('.alt-menu')) return;
    if (f.closest('main')) document.body.insertBefore(f, f.closest('main').nextSibling);
    let w = f.querySelector(':scope > .wrap');
    if (!w) { w = document.createElement('div'); w.className = 'wrap'; while (f.firstChild) w.appendChild(f.firstChild); f.appendChild(w); }
    const m = document.createElement('div');
    m.className = 'alt-menu';
    m.innerHTML = '<div class="am-marka"><b><i>A</i>Araba Karşılaştır ve Seç</b><p>Türkiye\'de satılan otomobilleri resmi kaynaklarıyla karşılaştıran bağımsız site. Araç satmıyoruz.</p></div>' +
      S.map(([b, l]) => `<nav aria-label="${b}"><h4>${b}</h4><ul>${l.map(([h, t]) => `<li><a href="${(window.SITE_KOK || '') + h}">${t}</a></li>`).join('')}</ul></nav>`).join('');
    w.insertBefore(m, w.firstChild);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur); else kur();
})();
