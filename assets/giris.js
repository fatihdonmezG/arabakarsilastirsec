/* Ana sayfa girişi: canlı sayılar, hızlı arama, çok bakılan karşılaştırmalar ve özellik kutucukları.
   assets/modeller.js (MODELLER, VERI_OZET) ve assets/kampanyalar.js'ten sonra yüklenir. */
(function () {
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const sayi = v => Number(v).toLocaleString('tr-TR');
  const M = window.MODELLER || {}, O = window.VERI_OZET || {};
  const bugun = new Date().toISOString().slice(0, 10);
  const kamp = ((window.KAMPANYALAR || {}).liste || []).filter(k => !k.bitis || k.bitis >= bugun);

  // Canlı sayılar
  if ($('sayilar')) $('sayilar').innerHTML = [
    [O.marka, 'marka'], [O.model, 'model'], [O.versiyon, `versiyon, ${sayi(O.satista || 0)} tanesi satışta`], kamp.length ? [kamp.length, 'güncel kampanya'] : [O.versiyon - (O.satista || 0), 'eski model versiyonu']
  ].filter(x => x[0] != null).map(([v, t]) => `<div><b data-hedef="${v}">0</b><span>${esc(t)}</span></div>`).join('');
  const say = () => document.querySelectorAll('#sayilar b[data-hedef]').forEach(b => {
    const h = +b.dataset.hedef, t0 = performance.now(), d = 900;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { b.textContent = sayi(h); return; }
    const adim = t => { const p = Math.min(1, (t - t0) / d); b.textContent = sayi(Math.round(h * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(adim); };
    requestAnimationFrame(adim);
  });
  say();
  if ($('kapsamSay') && O.marka) $('kapsamSay').textContent = `${O.marka} marka, ${sayi(O.versiyon)} versiyon`;

  // Hızlı arama: marka + model
  const liste = [];
  Object.keys(M).forEach(m => Object.keys(M[m]).forEach(o => liste.push({m, o, id: M[m][o].id, y: M[m][o].yillar, q: (m + ' ' + o).toLocaleLowerCase('tr')})));
  const inp = $('hizliAra'), kutu = $('hizliOneri');
  let aktif = -1, sonuc = [];
  const ciz = () => {
    const q = inp.value.trim().toLocaleLowerCase('tr');
    if (!q) { kutu.classList.remove('acik'); return; }
    const p = q.split(/\s+/);
    sonuc = liste.filter(x => p.every(t => x.q.includes(t))).sort((a, b) => (b.q.startsWith(q) - a.q.startsWith(q)) || a.q.localeCompare(b.q, 'tr')).slice(0, 12);
    aktif = -1;
    kutu.innerHTML = sonuc.length ? sonuc.map(x => `<a role="option" href="arac-detay.html#${encodeURIComponent(x.id)}"><span><b>${esc(x.m)}</b> ${esc(x.o)}</span><small>${x.y.length > 1 ? x.y[x.y.length - 1] + '–' + x.y[0] : x.y[0]}</small></a>`).join('') : '<div class="yok">Bu adla bir model bulamadık. Tüm araçlar sayfasında filtrelerle arayabilirsiniz.</div>';
    kutu.classList.add('acik');
  };
  if (inp) {
    inp.addEventListener('input', ciz);
    inp.addEventListener('focus', ciz);
    inp.addEventListener('keydown', e => {
      const a = kutu.querySelectorAll('a');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); aktif = Math.max(0, Math.min(a.length - 1, aktif + (e.key === 'ArrowDown' ? 1 : -1))); a.forEach((x, i) => x.classList.toggle('on', i === aktif)); }
      else if (e.key === 'Enter') { const h = a[aktif < 0 ? 0 : aktif]; if (h) { e.preventDefault(); location.href = h.href; } }
      else if (e.key === 'Escape') kutu.classList.remove('acik');
    });
    document.addEventListener('click', e => { if (!e.target.closest('.ara')) kutu.classList.remove('acik'); });
  }

  // Çok bakılan karşılaştırmalar (karsilastirma.html hazır karşılaştırmalarından)
  const KIYAS = [
    ['Elektrikli SUV', 'Togg T10X', 'Tesla Model Y', 'togg-t10x-2026-v1-rwd-standart,tesla-model-y-2026-premium-long-range-rwd'],
    ['Kompakt sedan', 'Fiat Egea', 'Toyota Corolla', 'egea-sedan-2026-1.4-fire-95,toyota-corolla-sedan-1-5-vision-plus-2026'],
    ['Küçük hatchback', 'Renault Clio', 'Hyundai i20', 'renault-clio-evolution-plus-tce-edc-115-2026,hyundai-i20-elite-gsr-dct-2026']
  ];
  if ($('hizliKiyas')) $('hizliKiyas').innerHTML = KIYAS.map(([s, a, b, ids]) => `<a href="karsilastirma.html#k=${ids}"><span>${esc(a)} <i>VS</i> ${esc(b)}</span><small style="color:var(--muted)">${esc(s)}</small></a>`).join('');

  // Özellik kutucukları
  const ik = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const OZ = [
    ['karsilastirma.html', 'Yan yana karşılaştır', '4 araca kadar 74 başlıkta, farkları vurgulayarak', '#1E5BD8', ik('<path d="M4 6h16M4 12h10M4 18h6"/>')],
    ['araclar.html', 'Bütün araçlar', `${O.marka || ''} marka, filtrele ve sırala`.trim(), '#0E7490', ik('<rect x="3" y="4" width="7" height="7" rx="1.5"/><rect x="14" y="4" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>')],
    ['sistem-puani.html', 'Sistem puanı', 'Her araç aynı ölçekle 10 üzerinden', '#7C3AED', ik('<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/>')],
    ['yol-maliyeti.html', 'Rota ve yol maliyeti', 'Benzin, dizel ve elektrikle yolculuk masrafı', '#E11D48', ik('<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h8.5a3.5 3.5 0 0 0 0-7h-9a3.5 3.5 0 0 1 0-7H16"/>'), 1],
    ['sarj-hesaplama.html', 'Şarj hesaplayıcı', 'Süre ve maliyet; evde ve istasyonda', '#2563EB', ik('<rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 11v2M11 9l-2 3h4l-2 3"/>'), 1],
    ['kampanyalar.html', 'Kampanyalar', kamp.length ? `${kamp.length} güncel kredi, indirim ve takas fırsatı` : 'Kredi, indirim ve takas fırsatları', '#15803D', ik('<path d="M20 12 12 20l-8-8V4h8z"/><circle cx="8.5" cy="8.5" r="1.5"/>')],
    ['gecis-ucretleri.html', 'Köprü ve otoyol', '2026 geçiş ücretleri, tarihleriyle', '#0F766E', ik('<path d="M2 18h20M4 18V9M20 18V9M2 9c4-4 16-4 20 0M8 18v-6M12 18v-7M16 18v-6"/>'), 1],
    ['trafik-cezalari.html', 'Trafik cezaları', '7574 sayılı Kanun ile yeni tutarlar', '#C2410C', ik('<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>'), 1],
    ['otv-muafiyet.html', 'ÖTV muafiyetli araçlar', '2026 sınırı ve uygun yerli modeller', '#B45309', ik('<circle cx="12" cy="4.5" r="2"/><path d="M10 8h4l-1 6h4l2 6M11 14a5 5 0 1 0 5 5"/>'), 1],
    ['yorumlar.html', 'Sahip yorumları', 'Aracı kullananların deneyimi', '#9333EA', ik('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>')],
    ['forum.html', 'Forum', 'Soru sor, deneyimini paylaş', '#DB2777', ik('<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 20c0-2.2 1-4 3-4.6"/>'), 1],
    ['rehber.html', 'Araç sahibinin el kitabı', 'İkinci el, muayene, sigorta, kaza', '#4D7C0F', ik('<path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z"/><path d="M18 20a2 2 0 0 0 2-2V6"/>')]
  ];
  const g = $('ozGrid');
  if (g) {
    g.innerHTML = OZ.map(([h, b, s, k, i, yeni], n) => `<a class="oz" href="${h}" style="--k:${k};--i:${n}"><span class="ik">${i}</span><b>${esc(b)}${yeni ? ' <span class="yeni">Yeni</span>' : ''}</b><small>${esc(s)}</small></a>`).join('');
    const ac = () => g.querySelectorAll('.oz').forEach(x => x.classList.add('gorundu'));
    setTimeout(ac, 1500);
    if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { ac(); io.disconnect(); } }, {threshold: .1}); io.observe(g); } else ac();
  }
})();
