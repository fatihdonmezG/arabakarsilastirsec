#!/usr/bin/env node
/*
 * assets/marka_linkleri.js içindeki resmi marka bağlantılarını kontrol eder.
 * Kullanım: node tools/link_kontrol.js [--marka Renault]
 * Her bağlantıyı açar (yönlendirmeleri izler) ve durum kodunu yazar. 4xx/5xx ya da bağlantı hatası
 * olanları sonda listeler; bunlar markanın sitesinde yeniden bulunup dosyada düzeltilmeli ya da kaldırılmalıdır.
 * Not: Bazı marka siteleri otomatik istekleri 403 ile reddedebilir; 403 çıkan bağlantıyı tarayıcıda elle açıp doğrulayın.
 */
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'assets', 'marka_linkleri.js'), 'utf8');
const win = {};
new Function('window', src)(win);
const L = win.MARKA_LINKLERI;
const a = process.argv.slice(2), mi = a.indexOf('--marka'), sadece = mi >= 0 ? a[mi + 1] : null;

(async () => {
  const hata = [];
  for (const [marka, m] of Object.entries(L)) {
    if (sadece && marka !== sadece) continue;
    for (const [tur, url] of Object.entries(m)) {
      let durum;
      try {
        const ac = new AbortController(), t = setTimeout(() => ac.abort(), 20000);
        const r = await fetch(url, { redirect: 'follow', signal: ac.signal, headers: { 'User-Agent': 'Mozilla/5.0 (link kontrol)', 'Accept-Language': 'tr-TR' } });
        clearTimeout(t);
        durum = r.status + (r.url !== url ? ' → ' + r.url : '');
        if (r.status >= 400) hata.push(`${marka} ${tur}: ${r.status} ${url}`);
      } catch (e) {
        durum = 'HATA ' + (e.cause && e.cause.code || e.name);
        hata.push(`${marka} ${tur}: ${durum} ${url}`);
      }
      console.log(`${marka} | ${tur} | ${durum}`);
    }
  }
  console.log(hata.length ? `\nSorunlu ${hata.length} bağlantı:\n` + hata.join('\n') : '\nTüm bağlantılar açıldı.');
  process.exitCode = hata.length ? 1 : 0;
})();
