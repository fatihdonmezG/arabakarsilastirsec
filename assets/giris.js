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

  // Öne çıkan modeller: fotoğraf, çipler, üç değer (Porsche'nin model kartlarındaki sadelikte)
  const E = window.ARAC_ENERJI || [];
  const satir = id => { const r = E.find(x => x[0] === id); return r && {id: r[0], marka: r[1], model: r[2], versiyon: r[3], yil: r[4], yakit: r[5], l100: r[6], kwh100: r[7], menzil: r[9], kasa: r[15] || '', hp: r[16], sn: r[17], sanziman: r[18] || '', cekis: r[19] || ''}; };
  const foto = a => window.fotoFor ? window.fotoFor({marka: a.marka, model: a.model, yil: a.yil, s: {kasa: a.kasa}}) : null;
  const kisa = {yakit: y => /^Elektrik/i.test(y) ? 'Elektrikli' : /plug-?in/i.test(y) ? 'Şarj edilebilir hibrit' : /hibrit|hybrid/i.test(y) ? 'Hibrit' : /LPG/.test(y) ? 'Benzin/LPG' : /^Dizel/i.test(y) ? 'Dizel' : 'Benzin',
    sanz: t => /manuel/i.test(t) ? 'Manuel' : t ? 'Otomatik' : '', cekis: t => window.NORMAL ? (({AWD:'Dört çeker',RWD:'Arkadan itiş',FWD:'Önden çekiş'})[window.NORMAL.cekisKod(t)] || '') : /4x4|dört|AWD|xDrive|quattro|4MOTION/i.test(t) ? 'Dört çeker' : /arka|RWD/i.test(t) ? 'Arkadan itiş' : t ? 'Önden çekiş' : ''};
  const nf = (v, d = 0) => Number(v).toLocaleString('tr-TR', {minimumFractionDigits: d, maximumFractionDigits: d});
  const modeller = (window.ONE_CIKAN || []).map(([m, o]) => M[m] && M[m][o] && satir(M[m][o].id)).filter(Boolean);
  const degerler = a => {
    const ev = /^Elektrik/i.test(a.yakit), d = [];
    if (a.hp) d.push([nf(a.hp), 'HP', 'Güç']);
    if (a.sn) d.push([nf(a.sn, 1), 'sn', '0-100 km/sa']);
    if (ev && a.menzil) d.push([nf(a.menzil), 'km', 'WLTP menzil']); else if (a.l100) d.push([nf(a.l100, 1), 'L', '100 km tüketim']);
    return d.slice(0, 3);
  };
  if ($('cards')) $('cards').innerHTML = modeller.map(a => { const f = foto(a);
    return `<article class="mkart"><a class="mk-foto" href="arac-detay.html#${encodeURIComponent(a.id)}">${f ? `<img src="${esc(f.src)}" alt="${esc(a.marka + ' ' + a.model)}" loading="lazy" decoding="async">` : `<span class="mk-yok">${esc(a.marka)}</span>`}</a>
      <div class="mk-govde"><h3><small>${esc(a.marka)}</small>${esc(a.model)}</h3>
      <div class="mk-cip">${[kisa.yakit(a.yakit), kisa.cekis(a.cekis), kisa.sanz(a.sanziman)].filter(Boolean).map((t, i) => `<span${i === 0 ? ' class="on"' : ''}>${esc(t)}</span>`).join('')}</div>
      <dl>${degerler(a).map(([v, b, l]) => `<div><dt>${esc(l)}</dt><dd>${v}<small>${b}</small></dd></div>`).join('')}</dl>
      <p class="mk-ver">${esc(a.versiyon)} için</p>
      <div class="mk-dugme"><a class="btn primary" href="arac-detay.html#${encodeURIComponent(a.id)}">İncele</a><a class="btn" href="karsilastirma.html#k=${encodeURIComponent(a.id)}">Karşılaştır</a></div></div></article>`; }).join('');

  // Giriş sahnesi: öne çıkan modellerin fotoğrafları sırayla, arkada soluk model adı
  const sahne = $('sahne'), fotolu = modeller.filter(a => { const f = foto(a); return f && f.kesit; });
  if (sahne && fotolu.length) {
    let i = 0;
    const ciz = () => { const a = fotolu[i % fotolu.length], f = foto(a);
      sahne.href = 'arac-detay.html#' + encodeURIComponent(a.id);
      sahne.innerHTML = `<span class="gs-ad" aria-hidden="true">${esc(a.model)}</span><img src="${esc(f.src)}" alt="${esc(a.marka + ' ' + a.model)}"><span class="gs-alt"><b>${esc(a.marka)} ${esc(a.model)}</b><span>İncele →</span></span><span class="gs-nokta">${fotolu.map((_, j) => `<i${j === i % fotolu.length ? ' class="on"' : ''}></i>`).join('')}</span>`;
      sahne.classList.remove('gir'); void sahne.offsetWidth; sahne.classList.add('gir'); };
    ciz();
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(() => { if (!document.hidden) { i++; ciz(); } }, 5500);
  }

  // Çok bakılan karşılaştırmalar (karsilastirma.html hazır karşılaştırmalarından)
  const KIYAS = [
    ['Elektrikli SUV', 'Togg T10X', 'Tesla Model Y', 'togg-t10x-2026-v1-rwd-standart,tesla-model-y-2026-premium-long-range-rwd'],
    ['Kompakt sedan', 'Fiat Egea', 'Toyota Corolla', 'egea-sedan-2026-1.4-fire-95,toyota-corolla-sedan-1-5-vision-plus-2026'],
    ['Küçük hatchback', 'Renault Clio', 'Hyundai i20', 'renault-clio-evolution-plus-tce-edc-115-2026,hyundai-i20-elite-gsr-dct-2026']
  ];
  if ($('hizliKiyas')) $('hizliKiyas').innerHTML = '<span>Çok bakılanlar:</span> ' + KIYAS.map(([s, a, b, ids]) => `<a href="karsilastirma.html#k=${ids}">${esc(a)} ile ${esc(b)}</a>`).join('');

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
    ['brosurler.html', 'Broşürler', 'Resmi broşür, fiyat ve donanım listeleri', '#B91C1C', ik('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>'), 1],
    ['yorumlar.html', 'Sahip yorumları', 'Aracı kullananların deneyimi', '#9333EA', ik('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>')],
    ['forum.html', 'Forum', 'Soru sor, deneyimini paylaş', '#DB2777', ik('<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 20c0-2.2 1-4 3-4.6"/>'), 1],
    ['rehber.html', 'Araç sahibinin el kitabı', 'İkinci el, muayene, sigorta, kaza', '#4D7C0F', ik('<path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z"/><path d="M18 20a2 2 0 0 0 2-2V6"/>')]
  ];
  // Üç grup: seç, hesapla, topluluk
  const GRUP = [
    ['Araç seç', 'Karşılaştır, puanla, fırsatları gör', ['karsilastirma.html', 'araclar.html', 'sistem-puani.html', 'kampanyalar.html', 'brosurler.html']],
    ['Hesapla', 'Yol, şarj, vergi ve ceza', ['yol-maliyeti.html', 'sarj-hesaplama.html', 'gecis-ucretleri.html', 'trafik-cezalari.html', 'otv-muafiyet.html']],
    ['Topluluk ve rehber', 'Deneyimler ve pratik bilgi', ['yorumlar.html', 'forum.html', 'rehber.html']]
  ];
  const ok = '<svg class="ok" viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8 5 5 5-5 5"/></svg>';
  const g = $('ozGrid');
  if (g) {
    g.className = 'oz-gruplar';
    g.innerHTML = GRUP.map(([ad, alt, hs], gi) => `<section class="og" style="--i:${gi}" aria-label="${esc(ad)}"><div class="og-bas"><span>${gi + 1}</span><div><h3>${esc(ad)}</h3><p>${esc(alt)}</p></div></div><ul>${hs.map(h => OZ.find(x => x[0] === h)).filter(Boolean).map(([h, b, s, , i, yeni]) =>
      `<li><a class="oz" href="${h}"><span class="ik">${i}</span><b>${esc(b)}${yeni ? '<span class="yeni">Yeni</span>' : ''}</b><small>${esc(s)}</small>${ok}</a></li>`).join('')}</ul></section>`).join('');
    const ac = () => g.querySelectorAll('.og').forEach(x => x.classList.add('gorundu'));
    setTimeout(ac, 500);
    if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { ac(); io.disconnect(); } }, {threshold: .1}); io.observe(g); } else ac();
  }
})();
