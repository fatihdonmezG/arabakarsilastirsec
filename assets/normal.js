/* Ortak standart kodlar: çekiş ve şanzıman yazılışları farklı olsa da aynı anlama geliyorsa aynı kodu verir.
   Karşılaştırma, "sadece farkları göster", filtreler ve detay sayfası bu kodları kullanır. */
(function () {
  function cekisKod(v) {
    const s = String(v || '').toLocaleLowerCase('tr').replace(/ı/g, 'i');
    if (!s) return null;
    if (/4x4|4wd|awd|dört|dort|4matic|quattro|xdrive|q4|all4|allgrip|e-four|tüm tekerlek|4 tekerlek|simetrik/.test(s)) return 'AWD';
    if (/arka|rwd|itiş|itis/.test(s)) return 'RWD';
    if (/ön|on(den)?\b|onden|fwd|4x2/.test(s)) return 'FWD';
    return null;
  }
  const CEKIS_AD = { FWD: 'Önden çekiş (FWD)', RWD: 'Arkadan itiş (RWD)', AWD: 'Dört çeker (AWD)' };
  function sanzimanKod(v) {
    const s = String(v || '').toLocaleLowerCase('tr').replace(/ı/g, 'i');
    if (!s) return null;
    let tip;
    if (/tek vites|tek ileri|tek hizli|tek viteslli|tek vitesli|redüktör|single/.test(s)) tip = 'TEK';
    else if (/\bamt\b|yar[iı] otomatik|otomatikleştirilmiş manuel|easy-r|dualogic/.test(s)) tip = 'AMT';
    else if (/e-?cvt|cvt|multidrive|x-tronic/.test(s)) tip = 'CVT';
    else if (/dct|dsg|çift kavramali|cift kavramali|s tronic|edc|dcs|pdk|dualogic|dkg/.test(s)) tip = 'DCT';
    else if (/manuel|düz/.test(s)) tip = 'MT';
    else if (/kademeli|otomatik|tronic|at\d|automatic|tork konvertör|geartronic|steptronic|e-tech|çok modlu/.test(s)) tip = 'AT';
    else return null;
    const m = s.match(/(\d{1,2})\s*(ileri|vites|kademe|-?speed)/) || s.match(/(\d{1,2})g-(?:e?dct|tronic)/) || s.match(/\b(?:at|dct|dsg|edct|e-dcs|cvt-|manuel)\s*(\d{1,2})\b/) || s.match(/(?:e?dct|dcs)(\d)\b/);
    const n = tip === 'TEK' ? 1 : (m ? +m[1] : null);
    return n ? tip + '-' + n : tip;
  }
  /* İki değerin aynı kabul edilip edilmeyeceği: kodlanabilen alanlarda kodlara bakılır. */
  function ayni(alan, a, b) {
    if (alan === 'cekis') { const x = cekisKod(a), y = cekisKod(b); if (x && y) return x === y; }
    if (alan === 'sanziman') {
      const x = sanzimanKod(a), y = sanzimanKod(b);
      if (x && y) { if (x === y) return true; const [tx, nx] = x.split('-'), [ty, ny] = y.split('-'); return tx === ty && (!nx || !ny); }
    }
    if (typeof a === 'string' && typeof b === 'string') return a.trim().toLocaleLowerCase('tr') === b.trim().toLocaleLowerCase('tr');
    return a === b;
  }
  window.NORMAL = { cekisKod, CEKIS_AD, sanzimanKod, ayni };
})();

/* Veri niteliği: her değerin yanında gösterilen rozet.
   tr      Türkiye resmî verisi (markanın ya da distribütörün Türkiye belgesi)
   pazar   Farklı pazar referansı (üreticinin başka ülke belgesi ya da notunda pazar farkı yazan değer)
   ort     Hesaplanan ortalama (aralığın ortası, sürücü ağırlığı düşülmüş değer, türetilmiş değer)
   bag     Bağımsız kaynak (teknik veritabanı, Euro NCAP / ANCAP, basın)
   yok     Uygulanamaz (ör. elektrikli araçta motor hacmi)
   bos     Doğrulanamadı (henüz kaynakla bulunamadı) */
(function () {
  const AD = { tr: 'Türkiye resmî verisi', pazar: 'Farklı pazar referansı', ort: 'Hesaplanan ortalama', bag: 'Bağımsız kaynak', yok: 'Uygulanamaz', bos: 'Doğrulanamadı' };
  const KISA = { tr: 'TR resmî', pazar: 'Farklı pazar', ort: 'Ortalama', bag: 'Bağımsız', yok: 'Uygulanamaz', bos: 'Doğrulanamadı' };
  const BASIN = /(otomobil\.com\.tr|log\.com\.tr|karar\.com|donanimhaber|webtekno|tamindir|ntv\.com|haberturk|dunya\.com|hurriyet|sozcu|otoguncel|yenimodelarabalar|otohaber|sabah\.com|milliyet|aa\.com\.tr|elektrikliturkiye|shiftdelete|chip\.com\.tr|motor1|autoclub|otokokpit|carwow|whatcar|autocar|topgear)/i;
  const VERITABANI = /(auto-data|ultimatespecs|autotijd|ev-database|adac\.de|alvolante|encycarpedia|autodata1|euroncap|ancap|nhtsa|iihs|greenncap|carlabelling)/i;
  const ORT = /(aralığının ortası|ortalama|ortası\b|hesaplan|çıkarıl|türetil|düşülerek|aralık ortası)/i;
  const PAZAR = /(başka pazar|farklı pazar|pazar referansı|kasa referansı|yurt ?dışı|türkiye donanımı farklı|pazarı\b|yabancı pazar|\bUK\b|Almanya|Avrupa donanımı|ABD|Avustralya|Singapur)/i;
  const EV = c => /^elektrik/i.test((c.s && c.s.yakit) || '');
  const PHEV = c => /plug|şarj edilebilir|phev/i.test((c.s && c.s.yakit) || '');
  const HIBRIT = c => /hibrit|hybrid/i.test((c.s && c.s.yakit) || '');
  const EVYOK = ['cc', 'silindir', 'besleme', 'tuketim_l100km', 'tuketim_sehir_ici', 'tuketim_sehir_disi', 'co2_gkm', 'emisyon_normu', 'depo_l', 'start_stop'];
  const ICEYOK = ['batarya_kwh', 'batarya_tipi', 'menzil_km_wltp', 'ac_sarj_dk', 'dc_hizli_sarj_dk_20_80', 'elektrik_tuketim_kwh100km'];
  const HEVYOK = ['ac_sarj_dk', 'dc_hizli_sarj_dk_20_80', 'menzil_km_wltp', 'elektrik_tuketim_kwh100km'];
  function uygulanamaz(c, k) {
    if (EV(c)) return EVYOK.includes(k);
    if (PHEV(c)) return false;
    if (HIBRIT(c)) return HEVYOK.includes(k) || (k === 'batarya_tipi' ? false : false);
    return ICEYOK.includes(k);
  }
  function host(u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } }
  function kaynakSinif(ad, url, marka) {
    ad = ad || ''; const h = host(url), path = (() => { try { return new URL(url).pathname; } catch (e) { return ''; } })();
    if (ORT.test(ad.replace(/ortalama\s+(yakıt\s+|elektrik\s+)?tüketim/gi, ''))) return 'ort';
    if (PAZAR.test(ad)) return 'pazar';
    if (VERITABANI.test(h) || VERITABANI.test(ad) || BASIN.test(h)) return 'bag';
    const sluglar = String(marka || '').toLocaleLowerCase('tr').replace(/ı/g, 'i').replace(/ë/g, 'e').split(/[^a-z0-9]+/).filter(x => x.length >= 3);
    const markaHost = sluglar.some(x => h.replace(/[^a-z0-9]/g, '').includes(x));
    const trMarka = new RegExp((sluglar.join('|') || 'xxxx'), 'i').test(ad) && /türkiye/i.test(ad);
    if ((/\.tr$/.test(h) || /^\/tr(\/|-|$)/i.test(path)) && markaHost) return 'tr';
    if (trMarka && (markaHost || /kullanıcının sağladığı PDF/i.test(ad))) return 'tr';
    if (h && (markaHost || /(stellantis|group\.renault|bmwgroup|storyboard|newsroom|\.news$|^media\.|^press\.|-dam\.|fromtheroad)/.test(h))) return 'pazar';
    return 'bag';
  }
  function nitelik(c, k) {
    const s = c.s || {}, v = s[k];
    if (v == null || v === '' || v === '-') return uygulanamaz(c, k) ? 'yok' : 'bos';
    const e = c.ekKaynak && c.ekKaynak[k];
    return e ? kaynakSinif(e.ad, e.url, c.marka) : kaynakSinif(c.kaynakAd, c.kaynakUrl, c.marka);
  }
  function rozet(c, k, kisa) {
    const n = nitelik(c, k);
    return `<span class="nit nit-${n}" title="${AD[n]}">${(kisa === false ? AD : KISA)[n]}</span>`;
  }
  /* Bir aracın verilen alanlardaki kapsamı */
  function kapsam(c, alanlar) {
    const say = { tr: 0, pazar: 0, ort: 0, bag: 0, yok: 0, bos: 0 };
    alanlar.forEach(k => say[nitelik(c, k)]++);
    const uyg = alanlar.length - say.yok, dolu = uyg - say.bos;
    return { say, uygulanabilir: uyg, dolu, oran: uyg ? dolu / uyg : 0 };
  }
  /* Puanın güvenilirliği: hesaplanan kriter ağırlığı ve veri kapsamı */
  function puanKapsam(p) {
    if (!p || p.toplam == null) return null;
    const hes = p.kriterler || [], yok = p.veriYokKriterler || [];
    const agirlik = hes.reduce((a, k) => a + (k.agirlik || 0), 0);
    const guven = agirlik >= .85 && !yok.length ? 'yuksek' : agirlik >= .65 ? 'orta' : 'dusuk';
    return { hesaplanan: hes.length, toplam: hes.length + yok.length, eksik: yok, agirlik, guven, guvenAd: { yuksek: 'Yüksek güven', orta: 'Orta güven', dusuk: 'Düşük güven' }[guven] };
  }
  Object.assign(window.NORMAL, { NITELIK_AD: AD, NITELIK_KISA: KISA, nitelik, rozet, kapsam, uygulanamaz, kaynakSinif, puanKapsam });
})();
