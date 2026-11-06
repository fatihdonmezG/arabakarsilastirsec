#!/usr/bin/env node
/*
 * Arama motorları için her versiyona ve her modele ayrı, doğrudan açılabilen sayfa üretir:
 *   arac/<id>.html           versiyon sayfası (özgün açıklama, canonical, Open Graph görseli, JSON-LD Car)
 *   arac/<marka-model>.html  model sayfası (versiyon listesi)
 *   arac/index.html          bütün araç sayfalarının dizini
 *   sitemap.xml, robots.txt
 * Sayfalar karşılaştırma kaydından (tek kayıt) üretilir; veri değişince yeniden çalıştırılır.
 * Kullanım: node tools/sayfa_uret.js
 */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), SITE = 'https://arabakarsilastirsec.netlify.app';
const OUT = path.join(ROOT, 'arac');
const k = fs.readFileSync(path.join(ROOT, 'karsilastirma.html'), 'utf8');
const ks = k.indexOf('const CARS = ['), CARS = new Function(k.slice(ks, k.indexOf('\n];', ks) + 3) + ';return CARS;')();
const gs = k.indexOf('const GROUPS = ['), GROUPS = new Function(k.slice(gs, k.indexOf('\n];', gs) + 3) + ';return GROUPS;')();
function closeOf(t, i) { let d = 0; for (let p = i; p < t.length; p++) { const ch = t[p]; if (ch === '"' || ch === "'" || ch === '`') { const q = ch; p++; while (p < t.length && t[p] !== q) { if (t[p] === '\\') p++; p++; } continue; } if (ch === '{' || ch === '[') d++; else if (ch === '}' || ch === ']') { d--; if (d === 0) return p; } } }
const d = fs.readFileSync(path.join(ROOT, 'arac-detay.html'), 'utf8');
const ro = d.indexOf('{', d.indexOf('const RECALLS = {')), RECALLS = new Function('return ' + d.slice(ro, closeOf(d, ro) + 1))();
const co = d.indexOf('{', d.indexOf('const CARS = {')), DC = new Function('return ' + d.slice(co, closeOf(d, co) + 1))();
const window = {}; global.window = window;
new Function('window', fs.readFileSync(path.join(ROOT, 'assets/normal.js'), 'utf8'))(window);
new Function('window', fs.readFileSync(path.join(ROOT, 'assets/fotolar.js'), 'utf8'))(window);
new Function('window', fs.readFileSync(path.join(ROOT, 'assets/puanlar.js'), 'utf8'))(window);
const N = window.NORMAL, P = window.PUANLAR || {};
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const nf = (v, dd) => typeof v === 'number' ? v.toLocaleString('tr-TR', { minimumFractionDigits: dd ?? ((String(v).split('.')[1] || '').length), maximumFractionDigits: dd ?? ((String(v).split('.')[1] || '').length) }) : String(v);
const slug = s => String(s).toLocaleLowerCase('tr').replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/ë/g, 'e').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const EV = c => /^elektrik/i.test(c.s.yakit || '');
const mutlak = u => /^https?:/.test(u) ? u : SITE + '/' + u.replace(/^\.?\//, '');
const yerel = u => /^https?:/.test(u) ? u : '../' + u.replace(/^\.?\//, '');
const fiyatGoster = c => c.yil === 2026 && !c.durum && typeof c.s.liste_fiyati_tl === 'number';
const modelSlug = c => slug(c.marka + ' ' + c.model);
const deger = (c, k, u) => { const v = c.s[k]; if (k === 'cekis' && N.cekisKod(v)) return N.CEKIS_AD[N.cekisKod(v)]; if (typeof v === 'number') return (/_yili$/.test(k) ? String(v) : nf(v)) + (u ? ' ' + u : ''); return String(v); };
function aciklama(c) {
  const s = c.s, p = [];
  if (s.guc_hp) p.push(`${s.guc_hp} HP`);
  if (s.sifirYuz_sn) p.push(`0-100 km/sa ${nf(s.sifirYuz_sn)} sn`);
  if (EV(c)) { if (s.menzil_km_wltp) p.push(`WLTP menzil ${s.menzil_km_wltp} km`); if (s.batarya_kwh) p.push(`${nf(s.batarya_kwh)} kWh batarya`); }
  else if (s.tuketim_l100km) p.push(`${nf(s.tuketim_l100km)} l/100 km`);
  if (s.bagaj_l) p.push(`${s.bagaj_l} L bagaj`);
  if (s.ncap_yildiz) p.push(`Euro NCAP ${s.ncap_yildiz} yıldız${s.ncap_test_yili ? ' (' + s.ncap_test_yili + ')' : ''}`);
  let t = `${c.marka} ${c.model} ${c.versiyon} (${c.yil}): ${p.join(', ')}.`;
  if (fiyatGoster(c)) t += ` Liste fiyatı ${nf(s.liste_fiyati_tl)} TL.`;
  if (c.durum) t += ' Satıştan kalkmış model; teknik veriler arşiv amaçlı.';
  t += ' Kaynaklı teknik veriler, sistem puanı ve rakiplerle karşılaştırma.';
  return t.replace(/: \./, '.');
}
function jsonld(c, url, img) {
  const s = c.s, o = { '@context': 'https://schema.org', '@type': 'Car', name: `${c.marka} ${c.model} ${c.versiyon}`, url, brand: { '@type': 'Brand', name: c.marka }, model: c.model, vehicleModelDate: String(c.yil), description: aciklama(c) };
  if (img) o.image = img;
  if (s.kasa) o.bodyType = s.kasa;
  if (s.yakit) o.fuelType = s.yakit;
  if (s.sanziman) o.vehicleTransmission = s.sanziman;
  const ck = N.cekisKod(s.cekis); if (ck) o.driveWheelConfiguration = { FWD: 'https://schema.org/FrontWheelDriveConfiguration', RWD: 'https://schema.org/RearWheelDriveConfiguration', AWD: 'https://schema.org/AllWheelDriveConfiguration' }[ck];
  if (s.koltuk) o.seatingCapacity = s.koltuk;
  if (s.kapi) o.numberOfDoors = s.kapi;
  if (s.guc_hp || s.cc) o.vehicleEngine = { '@type': 'EngineSpecification', ...(s.guc_hp ? { enginePower: { '@type': 'QuantitativeValue', value: s.guc_hp, unitCode: 'BHP' } } : {}), ...(s.cc ? { engineDisplacement: { '@type': 'QuantitativeValue', value: s.cc, unitCode: 'CMQ' } } : {}), ...(s.tork_nm ? { torque: { '@type': 'QuantitativeValue', value: s.tork_nm, unitCode: 'NU' } } : {}) };
  if (s.bagaj_l) o.cargoVolume = { '@type': 'QuantitativeValue', value: s.bagaj_l, unitCode: 'LTR' };
  if (s.hiz_kmh) o.speed = { '@type': 'QuantitativeValue', maxValue: s.hiz_kmh, unitCode: 'KMH' };
  if (s.sifirYuz_sn) o.accelerationTime = { '@type': 'QuantitativeValue', value: s.sifirYuz_sn, unitCode: 'SEC', valueReference: '0-100 km/h' };
  if (!EV(c) && s.tuketim_l100km) o.fuelConsumption = { '@type': 'QuantitativeValue', value: s.tuketim_l100km, unitText: 'L/100 km' };
  if (fiyatGoster(c)) o.offers = { '@type': 'Offer', price: s.liste_fiyati_tl, priceCurrency: 'TRY', availability: 'https://schema.org/InStock', description: 'Marka liste fiyatı; kampanya ve bayiye göre değişebilir.' };
  return JSON.stringify(o).replace(/</g, '\\u003c');
}
const BAS = (title, desc, url, img, ekHead = '') => `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Araba Karşılaştır ve Seç">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(url)}">
${img ? `<meta property="og:image" content="${esc(img)}">\n<meta name="twitter:card" content="summary_large_image">` : '<meta name="twitter:card" content="summary">'}
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/site.css">
<link rel="stylesheet" href="../assets/tema-acik.css">
<link rel="stylesheet" href="../assets/ortak.css">
<style>
.sa{padding-block:22px 40px}.sa .kirinti{font-size:.82rem;color:var(--muted)}.sa .kirinti a{color:inherit}
.sa h1{font-size:clamp(1.6rem,3.4vw,2.4rem);margin-top:8px;max-width:none}.sa .ozet{margin-top:10px;color:var(--muted);max-width:75ch}
.sa .ust{display:grid;gap:18px;margin-top:18px}@media(min-width:860px){.sa .ust{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);align-items:center}}
.sa .foto{background:var(--surface);border-radius:20px;padding:12px;text-align:center}.sa .foto img{width:100%;max-height:330px;object-fit:contain}.sa .foto small{display:block;font-size:.68rem;color:var(--muted);margin-top:6px}
.sa .kutu{background:var(--surface);border-radius:20px;padding:16px 18px}.sa .kutu h2{font-size:1.05rem;margin-bottom:8px}
.sa dl{margin:0;display:grid}.sa dl div{display:flex;justify-content:space-between;gap:12px;padding:6px 0;border-bottom:1px solid var(--line);font-size:.9rem}.sa dt{color:var(--muted)}.sa dd{margin:0;text-align:right;font-weight:500}
.sa .gruplar{display:grid;gap:14px;margin-top:18px}@media(min-width:860px){.sa .gruplar{grid-template-columns:1fr 1fr}}
.sa .bos{font-size:.8rem;color:var(--muted);margin-top:8px;line-height:1.7}.sa .eylem{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
.sa .eylem a{display:inline-flex;padding:10px 16px;border-radius:12px;font-weight:600;text-decoration:none;border:1px solid var(--line);background:var(--surface);color:var(--ink)}.sa .eylem a.ana{background:var(--vurgu,#1E5BD8);color:#fff;border-color:transparent}
.sa ul.liste{margin:6px 0 0;padding-left:18px;font-size:.88rem}.sa ul.liste li{margin:3px 0}.sa .kaynak{font-size:.78rem;color:var(--muted);word-break:break-word}
.sa table{width:100%;border-collapse:collapse;font-size:.88rem}.sa th,.sa td{text-align:left;padding:7px 6px;border-bottom:1px solid var(--line)}.sa td.n{text-align:right}
</style>
${ekHead}
</head>
<body class="ic-sayfa">
<header class="top"><div class="wrap"><a class="brand" href="../index.html"><span class="brandmark">A</span>Araba Karşılaştır ve Seç</a>
<nav class="nav" aria-label="Ana menü"><a href="../araclar.html">Tüm araçlar</a><a href="../kampanyalar.html">Kampanyalar</a><a href="../haberler.html">Haberler</a><a href="../hesaplama.html">Hesaplama</a><a href="../forum.html">Forum</a></nav></div></header>
`;
const SON = `<footer><div class="wrap"><p class="kaynak">Değerler resmi belgelerden ve bağımsız kaynaklardan derlenir; her satırın yanında verinin niteliği yazar. Satın almadan önce yetkili satıcıdan teyit edin. <a href="index.html">Bütün araç sayfaları</a></p></div></footer>
<script src="../assets/uye-ayar.js"></script><script src="../assets/tema.js"></script><script src="../assets/menu.js"></script>
</body></html>`;
if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) if (f.endsWith('.html')) fs.unlinkSync(path.join(OUT, f));
fs.mkdirSync(OUT, { recursive: true });
const modeller = {};
CARS.forEach(c => (modeller[modelSlug(c)] ??= []).push(c));
const urls = [];
for (const c of CARS) {
  const url = `${SITE}/arac/${c.id}`, f = window.fotoFor(c), img = f && f.src ? mutlak(f.src) : null, imgYerel = f && f.src ? yerel(f.src) : null;
  const title = `${c.marka} ${c.model} ${c.versiyon} (${c.yil}) teknik özellikleri${fiyatGoster(c) ? ' ve fiyatı' : ''} | Araba Karşılaştır ve Seç`;
  const desc = aciklama(c), p = P[c.id], pk = N.puanKapsam(p);
  const alanlar = GROUPS.flatMap(g => g.rows.map(r => r[0])), kp = N.kapsam(c, alanlar);
  const grup = GROUPS.map(g => {
    const dolu = g.rows.filter(([kk]) => c.s[kk] != null && c.s[kk] !== '');
    const bos = g.rows.filter(([kk]) => c.s[kk] == null || c.s[kk] === '');
    const dg = bos.filter(([kk]) => !N.uygulanamaz(c, kk)), uy = bos.filter(([kk]) => N.uygulanamaz(c, kk));
    if (!dolu.length && !dg.length) return '';
    return `<section class="kutu"><h2>${esc(g.name)}</h2>${dolu.length ? `<dl>${dolu.map(([kk, l, u]) => `<div><dt>${esc(l)}</dt><dd>${esc(deger(c, kk, u))}${N.rozet(c, kk)}</dd></div>`).join('')}</dl>` : ''}${dg.length ? `<p class="bos"><span class="nit nit-bos">Doğrulanamadı</span> ${dg.map(x => esc(x[1])).join(', ')}</p>` : ''}${uy.length ? `<p class="bos"><span class="nit nit-yok">Uygulanamaz</span> ${uy.map(x => esc(x[1])).join(', ')}</p>` : ''}</section>`;
  }).join('');
  const rec = RECALLS[c.id], dc = DC[c.id] || {};
  const recHtml = Array.isArray(rec) ? (rec.length ? `<ul class="liste">${rec.slice(0, 8).map(r => `<li>${esc(r.tarih || r.yil || '')} ${esc(r.baslik || r.parca || r.ozet || '')}</li>`).join('')}</ul>` : '<p class="bos">Resmi kayıtlarda bu versiyonu kapsayan geri çağırma bulunmadı.</p>') : '<p class="bos">Geri çağırma araştırması henüz yapılmadı.</p>';
  const artilar = (dc.gucluYanlar || []).slice(0, 5), eksiler = (dc.dikkatEdilecekler || []).slice(0, 5);
  const kardes = modeller[modelSlug(c)].filter(x => x.id !== c.id).slice(0, 20);
  const rakip = CARS.filter(x => x.id !== c.id && !x.durum && x.yil === c.yil && x.s.kasa === c.s.kasa && x.marka !== c.marka && N.cekisKod(x.s.cekis) === N.cekisKod(c.s.cekis)).slice(0, 1)[0];
  const kaynaklar = [...new Map([[c.kaynakUrl, c.kaynakAd], ...Object.values(c.ekKaynak || {}).map(e => [e.url, e.ad])]).entries()].filter(([u]) => u).slice(0, 12);
  const html = BAS(title, desc, url, img, `<script type="application/ld+json">${jsonld(c, url, img)}</script>`) + `<main class="wrap sa">
<p class="kirinti"><a href="../index.html">Ana sayfa</a> / <a href="${modelSlug(c)}.html">${esc(c.marka + ' ' + c.model)}</a> / ${esc(c.versiyon)}</p>
<h1>${esc(c.marka)} ${esc(c.model)} ${esc(c.versiyon)} <small style="font-weight:400;color:var(--muted)">(${c.yil})</small></h1>
<p class="ozet">${esc(desc)}</p>
<div class="ust">
  <figure class="foto" style="margin:0">${imgYerel ? `<img src="${esc(imgYerel)}" alt="${esc(c.marka + ' ' + c.model)}" loading="eager"><small>${window.fotoKredi ? window.fotoKredi(f) : ''}</small>` : `<p class="bos">Bu model için henüz fotoğrafımız yok.</p>`}</figure>
  <div class="kutu"><h2>Özet</h2><dl>
    ${p && p.toplam != null ? `<div><dt>Sistem puanı</dt><dd>${nf(p.toplam, 1)} / 10 ${pk ? `<span class="guv guv-${pk.guven}">${pk.guvenAd}</span>` : ''}</dd></div>` : ''}
    ${fiyatGoster(c) ? `<div><dt>Liste fiyatı</dt><dd>${nf(c.s.liste_fiyati_tl)} TL</dd></div>` : ''}
    ${c.durum ? `<div><dt>Durum</dt><dd>Satıştan kalktı</dd></div>` : ''}
    <div><dt>Veri kapsamı</dt><dd>${kp.uygulanabilir} uygulanabilir satırın ${kp.dolu} tanesi dolu</dd></div>
  </dl>${pk ? `<p class="bos">${pk.toplam} kriterin ${pk.hesaplanan} tanesi hesaplandı (ağırlığın %${Math.round(pk.agirlik * 100)}'i)${pk.eksik.length ? `; veri olmayan: ${esc(pk.eksik.join(', '))}` : ''}.</p>` : ''}
  <div class="eylem"><a class="ana" href="../arac-detay.html#${encodeURIComponent(c.id)}">Tam detay sayfası</a>${rakip ? `<a href="../karsilastirma.html#k=${encodeURIComponent(c.id)},${encodeURIComponent(rakip.id)}">${esc(rakip.marka + ' ' + rakip.model)} ile karşılaştır</a>` : `<a href="../karsilastirma.html#k=${encodeURIComponent(c.id)}">Karşılaştır</a>`}</div></div>
</div>
${artilar.length || eksiler.length ? `<div class="gruplar">${artilar.length ? `<section class="kutu"><h2>Öne çıkanlar</h2><ul class="liste">${artilar.map(x => `<li>${esc(x.metin)}</li>`).join('')}</ul></section>` : ''}${eksiler.length ? `<section class="kutu"><h2>Dikkat edilecekler</h2><ul class="liste">${eksiler.map(x => `<li>${esc(x.metin)}</li>`).join('')}</ul></section>` : ''}</div>` : ''}
<div class="gruplar">${grup}</div>
<div class="gruplar"><section class="kutu"><h2>Geri çağırmalar</h2>${recHtml}</section>
${kardes.length ? `<section class="kutu"><h2>${esc(c.marka + ' ' + c.model)} için diğer versiyonlar</h2><ul class="liste">${kardes.map(x => `<li><a href="${x.id}.html">${esc(x.versiyon)} (${x.yil})</a></li>`).join('')}</ul></section>` : ''}</div>
<section class="kutu" style="margin-top:18px"><h2>Kaynaklar</h2><ul class="liste kaynak">${kaynaklar.map(([u, a]) => `<li><a href="${esc(u)}" rel="nofollow noopener" target="_blank">${esc(a || u)}</a></li>`).join('')}</ul></section>
</main>
` + SON;
  fs.writeFileSync(path.join(OUT, c.id + '.html'), html);
  urls.push(url);
}
for (const [ms, list] of Object.entries(modeller)) {
  const c0 = list.slice().sort((a, b) => b.yil - a.yil)[0], url = `${SITE}/arac/${ms}`, f = window.fotoFor(c0), img = f && f.src ? mutlak(f.src) : null;
  const yillar = [...new Set(list.map(x => x.yil))].sort((a, b) => b - a);
  const desc = `${c0.marka} ${c0.model}: ${list.length} versiyon (${yillar.length > 1 ? yillar[yillar.length - 1] + '–' + yillar[0] : yillar[0]}). Her versiyonun kaynaklı teknik özellikleri, sistem puanı${list.some(fiyatGoster) ? ', liste fiyatı' : ''} ve rakip karşılaştırması.`;
  const html = BAS(`${c0.marka} ${c0.model} versiyonları ve teknik özellikleri | Araba Karşılaştır ve Seç`, desc, url, img) + `<main class="wrap sa">
<p class="kirinti"><a href="../index.html">Ana sayfa</a> / <a href="index.html">Araç sayfaları</a> / ${esc(c0.marka + ' ' + c0.model)}</p>
<h1>${esc(c0.marka + ' ' + c0.model)}</h1><p class="ozet">${esc(desc)}</p>
<section class="kutu" style="margin-top:18px"><table><thead><tr><th>Versiyon</th><th>Yıl</th><th class="n">Güç</th><th class="n">${EV(c0) ? 'Menzil' : 'Tüketim'}</th><th class="n">Puan</th>${list.some(fiyatGoster) ? '<th class="n">Liste fiyatı</th>' : ''}</tr></thead><tbody>
${list.sort((a, b) => b.yil - a.yil).map(x => `<tr><td><a href="${x.id}.html">${esc(x.versiyon)}</a>${x.durum ? ' <small>(satıştan kalktı)</small>' : ''}</td><td>${x.yil}</td><td class="n">${x.s.guc_hp ? x.s.guc_hp + ' HP' : '<span class="nit nit-bos">Doğrulanamadı</span>'}</td><td class="n">${EV(x) ? (x.s.menzil_km_wltp ? x.s.menzil_km_wltp + ' km' : '–') : (x.s.tuketim_l100km ? nf(x.s.tuketim_l100km) + ' l' : '–')}</td><td class="n">${P[x.id] && P[x.id].toplam != null ? nf(P[x.id].toplam, 1) : '–'}</td>${list.some(fiyatGoster) ? `<td class="n">${fiyatGoster(x) ? nf(x.s.liste_fiyati_tl) + ' TL' : ''}</td>` : ''}</tr>`).join('')}
</tbody></table></section></main>
` + SON;
  fs.writeFileSync(path.join(OUT, ms + '.html'), html);
  urls.push(url);
}
const markalar = {}; Object.entries(modeller).forEach(([ms, l]) => (markalar[l[0].marka] ??= []).push([ms, l[0].model, l.length]));
fs.writeFileSync(path.join(OUT, 'index.html'), BAS('Bütün araç sayfaları | Araba Karşılaştır ve Seç', `Türkiye'de satılan ve satılmış ${Object.keys(markalar).length} markanın ${Object.keys(modeller).length} modeli ve ${CARS.length} versiyonu için ayrı teknik özellik sayfaları.`, `${SITE}/arac/`, null) + `<main class="wrap sa"><h1>Bütün araç sayfaları</h1><div class="gruplar">${Object.keys(markalar).sort((a, b) => a.localeCompare(b, 'tr')).map(m => `<section class="kutu"><h2>${esc(m)}</h2><ul class="liste">${markalar[m].sort((a, b) => a[1].localeCompare(b[1], 'tr')).map(([ms, mo, n]) => `<li><a href="${ms}.html">${esc(m + ' ' + mo)}</a> <small>${n} versiyon</small></li>`).join('')}</ul></section>`).join('')}</div></main>` + SON);
urls.push(`${SITE}/arac/`);
const ana = fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).map(f => f === 'index.html' ? `${SITE}/` : `${SITE}/${f.replace(/\.html$/, '')}`);
const bugun = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...ana, ...urls].map(u => `<url><loc>${u}</loc><lastmod>${bugun}</lastmod></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /tools/\nDisallow: /research/\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`Sayfa üretildi: ${CARS.length} versiyon, ${Object.keys(modeller).length} model, dizin; sitemap ${ana.length + urls.length} adres.`);
