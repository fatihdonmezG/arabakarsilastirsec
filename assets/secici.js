/* Sitenin kendi seçim paneli: telefonun yerel açılır listesinin yerine geçer.
   Başlık ("Marka seç", "Model seç · Honda"), marka amblemleri, arama ve sıradaki alana otomatik geçiş sağlar.
   Kullanım: Secici.bagla(selectEl, { baslik:'Marka seç', logo:true, alt:()=>'...', sonraki:()=>digerSelect })
   Alttaki <select> yerinde kalır; seçim yapılınca onun değeri değişir ve 'change' olayı tetiklenir. */
(function () {
  const css = `
:has(> .sec-btn){min-width:0}
.sec-gizli{position:absolute!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important}
.sec-btn{box-sizing:border-box;max-width:100%;min-width:0;display:flex;align-items:center;gap:10px;width:100%;min-height:46px;padding:0 36px 0 12px;font:inherit;font-size:.95rem;text-align:left;color:var(--ink);background:var(--bg) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239296A0' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") right 10px center/18px no-repeat;border:1px solid var(--line-strong);border-radius:6px;cursor:pointer;position:relative}
.sec-btn:hover,.sec-btn:focus-visible{border-color:var(--accent);outline:none}
.sec-btn .t{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sec-btn.on{border-color:var(--accent);box-shadow:inset 3px 0 0 var(--accent)}
.sec-logo{flex:none;width:28px;height:22px;object-fit:contain;filter:drop-shadow(0 0 1px rgba(255,255,255,.5))}
.sec-harf{flex:none;width:24px;height:24px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font:700 .66rem/1 var(--display,sans-serif);color:var(--on-accent,#1B1508);background:var(--accent-grad,#C9A961)}
dialog.sec-panel{box-sizing:border-box;padding:0;border:1px solid var(--line-strong);background:var(--surface);color:var(--ink);width:min(480px,calc(100% - 24px));max-height:min(78vh,640px);border-radius:16px;display:flex;flex-direction:column;overflow:hidden}
dialog.sec-panel:not([open]){display:none}
dialog.sec-panel::backdrop{background:rgba(8,9,11,.65)}
.sec-ust{display:flex;align-items:flex-start;gap:12px;padding:16px 16px 10px;border-bottom:1px solid var(--line)}
.sec-ust .adim{font-size:.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--accent-soft)}
.sec-ust h2{margin:2px 0 0;font-size:1.15rem;font-family:var(--display,sans-serif)}
.sec-ust .alt{font-size:.8rem;color:var(--muted);margin-top:2px}
.sec-kapat{margin-left:auto;flex:none;width:38px;height:38px;border-radius:10px;border:1px solid var(--line-strong);background:transparent;color:var(--ink);font-size:1.2rem;cursor:pointer}
.sec-ara{margin:10px 16px 6px;position:relative}
.sec-ara input{width:100%;height:42px;padding:0 12px 0 36px;font:inherit;font-size:.92rem;color:var(--ink);background:var(--bg);border:1px solid var(--line-strong);border-radius:10px}
.sec-ara input:focus-visible{outline:none;border-color:var(--accent)}
.sec-ara svg{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--muted)}
.sec-liste{list-style:none;margin:0;padding:6px 8px 12px;overflow-y:auto;flex:1}
.sec-liste button{display:flex;align-items:center;gap:12px;width:100%;min-height:48px;padding:6px 10px;font:inherit;font-size:.95rem;text-align:left;color:var(--ink);background:transparent;border:0;border-radius:10px;cursor:pointer}
.sec-liste button:hover,.sec-liste button:focus-visible{background:var(--surface2);outline:none}
.sec-liste button[aria-selected="true"]{background:rgba(201,169,97,.16);color:var(--accent-soft);font-weight:600}
.sec-liste button[aria-selected="true"]::after{content:"✓";margin-left:auto;color:var(--accent)}
.sec-liste .say{color:var(--muted);font-size:.8rem;font-weight:400}
.sec-bos{padding:18px;color:var(--muted);font-size:.9rem;text-align:center}
@media (max-width:640px){
  dialog.sec-panel{width:100%;max-width:none;margin:auto 0 0;max-height:82vh;border-radius:18px 18px 0 0;border-bottom:0}
  .sec-ust{padding:14px 14px 10px}
  .sec-ust::before{content:"";position:absolute;left:50%;top:6px;width:40px;height:4px;margin-left:-20px;border-radius:2px;background:var(--line-strong)}
}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const sade = s => String(s).toLocaleLowerCase('tr').replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c');
  const LOGO = () => window.MARKA_LOGO || {};
  const harf = m => String(m).split(/[\s-]+/).filter(Boolean).slice(0, 2).map(x => x[0]).join('').toLocaleUpperCase('tr');
  // "Honda (5)" → ["Honda","5"]
  const ayir = t => { const m = String(t).match(/^(.*?)\s*\((\d+)\)\s*$/); return m ? [m[1], m[2]] : [t, null]; };
  const amblem = (ad, logo) => { if (!logo) return ''; const f = LOGO()[ad]; return f ? `<img class="sec-logo" src="assets/logos/${esc(f)}" alt="" loading="lazy">` : `<span class="sec-harf" aria-hidden="true">${esc(harf(ad))}</span>`; };

  let dlg;
  function panel() {
    if (dlg) return dlg;
    dlg = document.createElement('dialog'); dlg.className = 'sec-panel'; dlg.setAttribute('aria-labelledby', 'secBaslik');
    dlg.innerHTML = `<div class="sec-ust"><div><div class="adim" id="secAdim"></div><h2 id="secBaslik"></h2><div class="alt" id="secAlt"></div></div><button type="button" class="sec-kapat" aria-label="Kapat">×</button></div>
      <div class="sec-ara" id="secAraKutu"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input type="search" id="secAra" placeholder="Ara" autocomplete="off" aria-label="Listede ara"></div>
      <ul class="sec-liste" id="secListe" role="listbox"></ul>`;
    document.body.appendChild(dlg);
    dlg.querySelector('.sec-kapat').addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });   // arka plana dokununca kapan
    return dlg;
  }

  function ac(sel, o) {
    const d = panel(), opts = [...sel.options];
    d.querySelector('#secAdim').textContent = o.adim ? o.adim() : '';
    d.querySelector('#secBaslik').textContent = o.baslik || 'Seç';
    d.querySelector('#secAlt').textContent = o.alt ? o.alt() : '';
    const ara = d.querySelector('#secAra'), kutu = d.querySelector('#secAraKutu'), ul = d.querySelector('#secListe');
    kutu.hidden = opts.length < 9; ara.value = '';
    const ciz = () => {
      const q = sade(ara.value.trim());
      const L = opts.filter(op => !q || sade(op.text).includes(q));
      ul.innerHTML = L.length ? L.map(op => { const [ad, say] = ayir(op.text); return `<li><button type="button" role="option" data-v="${esc(op.value)}" aria-selected="${op.value === sel.value}">${op.value ? amblem(ad, o.logo) : ''}<span>${esc(ad)}${say && op.value ? ` <span class="say">${say} versiyon</span>` : (say ? ` <span class="say">(${say})</span>` : '')}</span></button></li>`; }).join('')
        : '<li class="sec-bos">Sonuç yok</li>';
    };
    ara.oninput = ciz; ciz();
    ul.onclick = e => {
      const b = e.target.closest('button[data-v]'); if (!b) return;
      d.close();
      if (sel.value !== b.dataset.v) { sel.value = b.dataset.v; sel.dispatchEvent(new Event('change', { bubbles: true })); }
      const s = o.sonraki && o.sonraki();
      if (s && s._secici && s.options.length > 1) setTimeout(() => s._secici.ac(), 120);
    };
    d.showModal();
    const secili = ul.querySelector('[aria-selected="true"]');
    if (secili) secili.scrollIntoView({ block: 'center' });
    if (!kutu.hidden && window.matchMedia('(min-width:641px)').matches) ara.focus(); else (secili || ul.querySelector('button') || d).focus?.();
  }

  function bagla(sel, o = {}) {
    if (!sel) return;
    if (sel._secici) { sel._secici.o = o; sel._secici.guncelle(); return; }
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'sec-btn'; b.setAttribute('aria-haspopup', 'dialog');
    sel.insertAdjacentElement('afterend', b); sel.classList.add('sec-gizli'); sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true');
    const lbl = sel.id && document.querySelector(`label[for="${CSS.escape(sel.id)}"]`);
    const api = {
      o,
      guncelle() {
        const op = sel.options[sel.selectedIndex], [ad] = ayir(op ? op.text : '');
        b.innerHTML = `${op && op.value ? amblem(ad, api.o.logo) : ''}<span class="t">${esc(op ? ad : 'Seç')}</span>`;
        b.setAttribute('aria-label', `${lbl ? lbl.textContent + ': ' : ''}${op ? ad : 'seçilmedi'}`);
        b.classList.toggle('on', sel.classList.contains('on'));
        b.disabled = sel.disabled;
      },
      ac() { ac(sel, api.o); }
    };
    sel._secici = api; tum.add(api);
    b.addEventListener('click', () => api.ac());
    if (lbl) lbl.addEventListener('click', e => { e.preventDefault(); b.focus(); });
    new MutationObserver(() => api.guncelle()).observe(sel, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'disabled'] });
    sel.addEventListener('change', () => api.guncelle());
    api.guncelle();
  }
  const tum = new Set();
  // Değeri kodla (sel.value = ...) değiştirilen seçiciler için düğmeleri yenile
  window.Secici = { bagla, yenile() { tum.forEach(a => a.guncelle()); } };
})();
