/* Site rengi: mavi (varsayılan) ya da kırmızı. Ziyaretçi menüdeki renk düğmeleriyle seçer, seçim tarayıcıda hatırlanır.
   ?renk=kirmizi / ?renk=mavi bağlantısıyla da açılabilir. <head> içinde yüklenir; sayfa çizilmeden önce renk uygulanır. */
(function () {
  const RENKLER = [['mavi', 'Mavi', '#1E5BD8'], ['kirmizi', 'Kırmızı', '#D21F2F']];
  let renk = 'mavi';
  try { renk = localStorage.getItem('renk') || renk; } catch (e) {}
  const q = new URLSearchParams(location.search).get('renk');
  if (RENKLER.some(r => r[0] === q)) { renk = q; try { localStorage.setItem('renk', q); } catch (e) {} }
  if (!RENKLER.some(r => r[0] === renk)) renk = 'mavi';
  document.documentElement.dataset.renk = renk;

  const css = `.renk-sec{display:inline-flex;align-items:center;gap:5px;margin-left:6px;padding-left:8px;border-left:1px solid var(--line)}
.renk-sec .ad{display:none;font-size:.8rem;color:var(--muted);margin-right:4px}
.renk-sec button{width:18px;height:18px;padding:0;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px var(--line-strong);cursor:pointer}
.renk-sec button[aria-pressed="true"]{box-shadow:0 0 0 2px var(--ink)}
.renk-sec button:focus-visible{outline:2px solid var(--focus);outline-offset:3px}
@media (max-width:1180px){.top .nav .renk-sec{margin:6px 0 0;padding:12px 6px 4px;border-left:0;border-top:1px solid var(--line)}.renk-sec .ad{display:inline}.renk-sec button{width:26px;height:26px}}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function kur() {
    const nav = document.querySelector('header.top .nav');
    if (!nav || nav.querySelector('.renk-sec')) return;
    const g = document.createElement('div');
    g.className = 'renk-sec'; g.setAttribute('role', 'group'); g.setAttribute('aria-label', 'Site rengi');
    g.innerHTML = '<span class="ad">Site rengi</span>' + RENKLER.map(([k, ad, c]) =>
      `<button type="button" data-renk="${k}" title="${ad}" aria-label="${ad} renk" aria-pressed="${k === document.documentElement.dataset.renk}" style="background:${c}"></button>`).join('');
    g.addEventListener('click', e => {
      const b = e.target.closest('button[data-renk]'); if (!b) return;
      e.stopPropagation();
      document.documentElement.dataset.renk = b.dataset.renk;
      try { localStorage.setItem('renk', b.dataset.renk); } catch (x) {}
      g.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    });
    nav.appendChild(g);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur); else kur();
})();
