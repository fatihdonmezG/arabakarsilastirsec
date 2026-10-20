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
