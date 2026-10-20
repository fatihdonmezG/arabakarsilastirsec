/* Açık tema ana rengi: mavi (varsayılan) ya da kırmızı. ?renk=kirmizi / ?renk=mavi ile seçilir ve hatırlanır.
   Önizleme süresince sağ altta renk değiştirme düğmesi görünür. */
(function () {
  let renk = 'mavi';
  try { renk = localStorage.getItem('renk') || renk; } catch (e) {}
  const q = new URLSearchParams(location.search).get('renk');
  if (q === 'kirmizi' || q === 'mavi') { renk = q; try { localStorage.setItem('renk', q); } catch (e) {} }
  document.documentElement.dataset.renk = renk;
  function dugme() {
    const b = document.createElement('div');
    b.setAttribute('role', 'group'); b.setAttribute('aria-label', 'Tema rengi');
    b.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:90;display:flex;gap:4px;padding:4px;border-radius:99px;background:#fff;box-shadow:0 6px 20px rgba(15,26,43,.2);font:600 12px/1 system-ui,sans-serif';
    for (const [k, ad, c] of [['mavi', 'Mavi', '#1E5BD8'], ['kirmizi', 'Kırmızı', '#D21F2F']]) {
      const x = document.createElement('button');
      x.type = 'button'; x.textContent = ad; x.setAttribute('aria-pressed', String(document.documentElement.dataset.renk === k));
      x.style.cssText = `border:0;border-radius:99px;padding:8px 12px;cursor:pointer;color:${document.documentElement.dataset.renk === k ? '#fff' : '#334'};background:${document.documentElement.dataset.renk === k ? c : 'transparent'}`;
      x.onclick = () => { document.documentElement.dataset.renk = k; try { localStorage.setItem('renk', k); } catch (e) {} b.remove(); dugme(); };
      b.appendChild(x);
    }
    document.body.appendChild(b);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', dugme); else dugme();
})();
