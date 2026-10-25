/* Marka amblemleri (assets/logos). Karşılaştırma ve seçim panellerinde kullanılır. */
window.MARKA_LOGO = {
  'Alfa Romeo':'alfa-romeo-logo.svg','BYD':'byd-logo.svg','Chery':'chery-logo.png','Citroën':'citroen-logo.svg',
  'Cupra':'cupra-logo.svg','Dacia':'dacia-logo.svg','Fiat':'fiat-logo.svg','Ford':'ford-logo.png','Honda':'honda-logo.png',
  'Hyundai':'hyundai-logo.svg','Jaecoo':'jaecoo-logo.svg','Jeep':'jeep-logo.svg','Kia':'kia-logo.svg','MG':'mg-logo.png',
  'Mitsubishi':'mitsubishi-logo.svg','Nissan':'nissan-logo.svg','Omoda':'omoda-logo.png','Opel':'opel-logo.svg',
  'Peugeot':'peugeot-logo.svg','Renault':'renault-logo.svg','Seat':'seat-logo.svg','Skoda':'skoda-logo.svg',
  'Suzuki':'suzuki-logo.svg','Togg':'togg-logo.svg','Toyota':'toyota-logo.svg','Volkswagen':'volkswagen-logo.svg','Volvo':'volvo-logo.svg'
};

/* Fotoğrafı olmayan araçlar için amblem kartı: ortada marka amblemi (yoksa marka adı), altında model ve versiyon.
   Kullanım: el.innerHTML = window.amblemKart(c)  — kapsayıcının boyutunu doldurur. */
(function () {
  const css = `.amblem-kart{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6%;width:100%;height:100%;min-height:120px;padding:6% 8%;box-sizing:border-box;background:#fff;color:#1F2937;text-align:center;container-type:inline-size}
.amblem-kart .ak-logo{display:flex;align-items:center;justify-content:center;width:100%;height:42%;min-height:44px}
.amblem-kart .ak-logo img{max-width:58%;max-height:100%;object-fit:contain}
.amblem-kart .ak-marka{font-family:var(--display,sans-serif);font-weight:800;font-size:clamp(1rem,9cqi,2.2rem);letter-spacing:.14em;text-transform:uppercase;color:#1F2937}
.amblem-kart .ak-ad{font-family:var(--display,sans-serif);font-weight:700;font-size:clamp(.78rem,5.2cqi,1.15rem);line-height:1.3;color:#2B3442;max-width:100%;overflow-wrap:anywhere}
.amblem-kart .ak-alt{display:block;font-weight:500;font-size:.82em;color:#6B7280;margin-top:2px}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  window.amblemKart = function (c, opt) {
    opt = opt || {};
    const f = (window.MARKA_LOGO || {})[c.marka];
    const logo = f ? `<img src="assets/logos/${esc(f)}" alt="${esc(c.marka)} amblemi" loading="lazy" decoding="async">` : `<span class="ak-marka">${esc(c.marka)}</span>`;
    const alt = opt.versiyonYok ? '' : `<span class="ak-alt">${esc(c.yil)} · ${esc(c.versiyon)}</span>`;
    return `<div class="amblem-kart" role="img" aria-label="${esc(c.marka + ' ' + c.model)}: fotoğraf henüz eklenmedi"><div class="ak-logo">${logo}</div><div class="ak-ad">${esc(c.model)}${alt}</div></div>`;
  };
})();
