/* Hesaplama sayfalarının ortak yardımcıları. assets/arac_enerji.js ve assets/hesap_veri.js'ten sonra yüklenir. */
(function () {
  const H = window.H = {};
  H.$ = id => document.getElementById(id);
  H.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  H.sayi = (v, d = 0) => Number(v).toLocaleString('tr-TR', {minimumFractionDigits: d, maximumFractionDigits: d});
  H.tl = (v, d = 0) => H.sayi(v, d) + ' TL';
  H.sure = dk => { dk = Math.round(dk); const s = Math.floor(dk / 60), d = dk % 60; return s ? `${s} sa ${d ? d + ' dk' : ''}`.trim() : `${d} dk`; };
  H.tarih = iso => { const [y, a, g] = String(iso).split('-'); return g ? `${+g}.${a}.${y}` : iso; };
  H.oku = (id, yedek) => { const v = parseFloat(String(H.$(id).value).replace(',', '.')); return isFinite(v) ? v : yedek; };

  // Yakıt türü: benzin | dizel | elektrik | lpg | hibrit | phev
  H.tur = y => { y = y || ''; if (/^Elektrik/i.test(y)) return 'elektrik'; if (/plug-?in/i.test(y)) return 'phev'; if (/LPG/.test(y)) return 'lpg'; if (/hibrit|hybrid|e-POWER/i.test(y)) return 'hibrit'; if (/^Dizel/i.test(y)) return 'dizel'; return 'benzin'; };
  H.TUR_AD = {benzin: 'Benzin', dizel: 'Dizel', elektrik: 'Elektrik', lpg: 'Benzin/LPG', hibrit: 'Hibrit', phev: 'Şarj edilebilir hibrit'};
  H.yk = t => `<span class="yk ${t}">${H.TUR_AD[t]}</span>`;

  // Araç kayıtları
  const A = (window.ARAC_ENERJI || []).map(r => ({id: r[0], marka: r[1], model: r[2], versiyon: r[3], yil: r[4], yakit: r[5], l100: r[6], kwh100: r[7], batarya: r[8], menzil: r[9], dc: r[10], ac: r[11], depo: r[12], fiyat: r[13], satista: !!r[14], kasa: r[15] || ''}));
  A.forEach(a => { a.tur = H.tur(a.yakit); if (a.tur === 'elektrik' && !a.kwh100 && a.batarya && a.menzil) { a.kwh100 = +(a.batarya / a.menzil * 100).toFixed(1); a.kwhTahmin = true; } });
  H.ARACLAR = A;
  H.arac = id => A.find(a => a.id === id);
  const norm = s => s.toLocaleLowerCase('tr').replace(/[^a-z0-9çğıöşü]+/g, ' ').trim();
  A.forEach(a => { a._q = norm(`${a.marka} ${a.model} ${a.versiyon} ${a.yil}`); });

  // Araç arama kutusu: H.aracAra(kutuElementi, {filtre, secince})
  H.aracAra = (kutu, o = {}) => {
    kutu.classList.add('arac-ara');
    kutu.innerHTML = `<input type="search" placeholder="${H.esc(o.yer || 'Marka, model ya da versiyon yazın')}" autocomplete="off" aria-label="Araç ara"><div class="liste" role="listbox"></div>`;
    const inp = kutu.querySelector('input'), liste = kutu.querySelector('.liste');
    let sonuc = [], aktif = -1;
    const ciz = () => {
      const q = norm(inp.value), parca = q.split(' ').filter(Boolean);
      sonuc = A.filter(a => (!o.filtre || o.filtre(a)) && parca.every(p => a._q.includes(p)));
      sonuc.sort((x, y) => (y.satista - x.satista) || (y.yil - x.yil));
      sonuc = sonuc.slice(0, 40); aktif = -1;
      liste.innerHTML = sonuc.length ? sonuc.map((a, i) => `<button type="button" role="option" data-i="${i}"><span><b>${H.esc(a.marka)} ${H.esc(a.model)}</b> ${H.esc(a.versiyon)}</span><small>${a.yil} · ${H.TUR_AD[a.tur]}</small></button>`).join('') : '<div class="yok">Eşleşen araç yok. Tüketimi elle girebilirsiniz.</div>';
      kutu.classList.add('acik');
    };
    const sec = i => { const a = sonuc[i]; if (!a) return; kutu.classList.remove('acik'); inp.value = ''; o.secince && o.secince(a); };
    inp.addEventListener('input', ciz);
    inp.addEventListener('focus', ciz);
    inp.addEventListener('keydown', e => {
      const b = liste.querySelectorAll('button');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); aktif = Math.max(0, Math.min(b.length - 1, aktif + (e.key === 'ArrowDown' ? 1 : -1))); b.forEach((x, i) => x.classList.toggle('on', i === aktif)); b[aktif] && b[aktif].scrollIntoView({block: 'nearest'}); }
      else if (e.key === 'Enter') { e.preventDefault(); sec(aktif < 0 ? 0 : aktif); }
      else if (e.key === 'Escape') kutu.classList.remove('acik');
    });
    liste.addEventListener('mousedown', e => { const b = e.target.closest('button[data-i]'); if (b) { e.preventDefault(); sec(+b.dataset.i); } });
    document.addEventListener('click', e => { if (!kutu.contains(e.target)) kutu.classList.remove('acik'); });
  };
  H.seciliKart = a => `<div class="secili-arac"><div class="ad"><b>${H.esc(a.marka)} ${H.esc(a.model)}</b><small>${a.yil} · ${H.esc(a.versiyon)}</small></div>${H.yk(a.tur)}<button type="button" data-kaldir aria-label="Aracı kaldır">×</button></div>`;

  // Şarj operatörü fiyatı (aralıkta orta değer)
  H.dcFiyat = op => (op.dc[0] + op.dc[1]) / 2;

  // Basit görünürlük animasyonu
  H.gorununce = (el, fn) => {
    if (!('IntersectionObserver' in window)) return fn();
    const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { fn(); io.disconnect(); } }), {threshold: .2});
    io.observe(el);
  };
})();
