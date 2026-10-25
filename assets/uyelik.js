/* Üyelik, garaj ve yorum işlemleri (Supabase). Ayar: assets/uye-ayar.js  Şema: tools/supabase_kurulum.sql
   Sayfalar yalnızca window.Uyelik üzerinden çalışır. */
(function () {
  const AYAR = window.UYE_AYAR || {};
  const LIB = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';
  const acik = !!(window.UYE_MOCK || (AYAR.url && AYAR.anonKey));
  let istemci = null, yukleniyor = null, profilOnbellek = null;
  const dinleyiciler = [];

  const HATALAR = [
    [/invalid login credentials/i, 'E-posta ya da şifre hatalı.'],
    [/user already registered|already been registered/i, 'Bu e-posta ile zaten üye olunmuş. Giriş yapmayı deneyin.'],
    [/email not confirmed/i, 'E-posta adresiniz henüz doğrulanmadı. Gelen kutunuzdaki bağlantıya tıklayın.'],
    [/password should be at least|weak password/i, 'Şifre en az 8 karakter olmalı.'],
    [/rate limit|too many/i, 'Çok fazla deneme yapıldı. Biraz sonra tekrar deneyin.'],
    [/duplicate key.*yorumlar|yorumlar_user_id_arac_id/i, 'Bu versiyon için zaten bir yorumunuz var.'],
    [/duplicate key.*garaj|garaj_tekil/i, 'Bu araç zaten garajınızda.'],
    [/failed to fetch|network/i, 'Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edin.'],
  ];
  const turkce = e => {
    const m = String((e && (e.message || e.error_description)) || e || 'Bilinmeyen hata');
    for (const [re, tr] of HATALAR) if (re.test(m)) return tr;
    return m;
  };
  const kontrol = r => { if (r && r.error) throw new Error(turkce(r.error)); return r ? r.data : null; };

  function yukle() {
    if (window.UYE_MOCK) return Promise.resolve(window.UYE_MOCK);
    if (!acik) return Promise.reject(new Error('Üyelik henüz açılmadı.'));
    if (istemci) return Promise.resolve(istemci);
    if (!yukleniyor) yukleniyor = new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = LIB; s.async = true;
      s.onload = () => {
        istemci = window.supabase.createClient(AYAR.url, AYAR.anonKey, { auth: { persistSession: true, autoRefreshToken: true } });
        istemci.auth.onAuthStateChange(() => { profilOnbellek = null; dinleyiciler.forEach(f => { try { f(); } catch (e) {} }); });
        res(istemci);
      };
      s.onerror = () => rej(new Error('Üyelik servisi yüklenemedi.'));
      document.head.appendChild(s);
    });
    return yukleniyor;
  }

  const U = {
    acik,
    turkce,
    async oturum() {
      if (!acik) return null;
      const c = await yukle();
      if (c.oturum) return c.oturum();                         // test ortamı
      const { data } = await c.auth.getSession();
      const user = data && data.session && data.session.user;
      if (!user) return null;
      if (!profilOnbellek || profilOnbellek.id !== user.id) {
        const p = await c.from('profiller').select('id,takma_ad').eq('id', user.id).maybeSingle();
        profilOnbellek = p.data || { id: user.id, takma_ad: (user.user_metadata || {}).takma_ad || 'Üye' };
      }
      return { id: user.id, email: user.email, takma_ad: profilOnbellek.takma_ad };
    },
    async kayit(email, sifre, takma_ad) {
      const c = await yukle();
      if (c.kayit) return c.kayit(email, sifre, takma_ad);
      const r = await c.auth.signUp({ email, password: sifre, options: { data: { takma_ad }, emailRedirectTo: location.origin + location.pathname } });
      const d = kontrol(r);
      return { dogrulamaGerekli: !d.session };
    },
    async giris(email, sifre) {
      const c = await yukle();
      if (c.giris) return c.giris(email, sifre);
      kontrol(await c.auth.signInWithPassword({ email, password: sifre }));
    },
    async sifreSifirla(email) {
      const c = await yukle();
      if (c.sifreSifirla) return c.sifreSifirla(email);
      kontrol(await c.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname + '#yeni-sifre' }));
    },
    async sifreGuncelle(sifre) {
      const c = await yukle();
      if (c.sifreGuncelle) return c.sifreGuncelle(sifre);
      kontrol(await c.auth.updateUser({ password: sifre }));
    },
    async takmaAdGuncelle(ad) {
      const c = await yukle(), o = await U.oturum();
      if (c.takmaAdGuncelle) return c.takmaAdGuncelle(ad);
      kontrol(await c.from('profiller').update({ takma_ad: ad }).eq('id', o.id));
      profilOnbellek = null;
    },
    async cikis() {
      const c = await yukle();
      if (c.cikis) return c.cikis();
      await c.auth.signOut();
    },
    async garaj() {
      const c = await yukle();
      if (c.garaj) return c.garaj();
      return kontrol(await c.from('garaj').select('id,marka,model,yil,arac_id').order('olusturma'));
    },
    async garajEkle(a) {
      const c = await yukle();
      if (c.garajEkle) return c.garajEkle(a);
      kontrol(await c.from('garaj').insert({ marka: a.marka, model: a.model, yil: a.yil || null, arac_id: a.arac_id || null }));
    },
    async garajSil(id) {
      const c = await yukle();
      if (c.garajSil) return c.garajSil(id);
      kontrol(await c.from('garaj').delete().eq('id', id));
    },
    async yorumlar(marka, model) {
      const c = await yukle();
      if (c.yorumlar) return c.yorumlar(marka, model);
      return kontrol(await c.from('yorumlar').select('*').eq('marka', marka).eq('model', model).order('olusturma', { ascending: false }).limit(500));
    },
    async sonYorumlar(f) {
      // Bütün araçlar için yayındaki yorumlar (yorumlar sayfası). f: {marka, model, tur, sira: 'yeni'|'faydali', sayfa, adet}
      f = f || {}; const c = await yukle();
      if (c.sonYorumlar) return c.sonYorumlar(f);
      const adet = f.adet || 20, bas = (f.sayfa || 0) * adet;
      let q = c.from('yorumlar').select('id,takma_ad,arac_id,marka,model,yil,versiyon,tur,izlenim_turu,puan,alt_puan,ay,km,baslik,metin,artilar,eksiler,sorunlar,faydali,olusturma', { count: 'exact' }).eq('durum', 'yayinda');
      if (f.marka) q = q.eq('marka', f.marka);
      if (f.model) q = q.eq('model', f.model);
      if (f.tur) q = q.eq('tur', f.tur);
      q = f.sira === 'faydali' ? q.order('faydali', { ascending: false }).order('olusturma', { ascending: false }) : q.order('olusturma', { ascending: false });
      const r = await q.range(bas, bas + adet - 1);
      return { satirlar: kontrol(r) || [], toplam: r.count || 0 };
    },
    async yorumGonder(y) {
      const c = await yukle();
      if (c.yorumGonder) return c.yorumGonder(y);
      kontrol(await c.from('yorumlar').insert(y));
    },
    async yorumSil(id) {
      const c = await yukle();
      if (c.yorumSil) return c.yorumSil(id);
      kontrol(await c.from('yorumlar').delete().eq('id', id));
    },
    async benimYorumlarim() {
      const c = await yukle(), o = await U.oturum();
      if (c.benimYorumlarim) return c.benimYorumlarim();
      return kontrol(await c.from('yorumlar').select('id,arac_id,marka,model,yil,versiyon,tur,baslik,durum,olusturma').eq('user_id', o.id).order('olusturma', { ascending: false }));
    },
    async oylarim() {
      const c = await yukle();
      if (c.oylarim) return c.oylarim();
      return new Set((kontrol(await c.from('faydali_oy').select('yorum_id')) || []).map(x => x.yorum_id));
    },
    async faydali(id, ver) {
      const c = await yukle();
      if (c.faydali) return c.faydali(id, ver);
      if (ver) kontrol(await c.from('faydali_oy').insert({ yorum_id: id }));
      else kontrol(await c.from('faydali_oy').delete().eq('yorum_id', id));
    },
    degisti(f) { dinleyiciler.push(f); if (window.UYE_MOCK && window.UYE_MOCK.dinle) window.UYE_MOCK.dinle(f); },
  };
  window.Uyelik = U;

  // Üst menüye "Giriş yap" / takma ad bağlantısı
  function menu() {
    const nav = document.querySelector('header .nav');
    if (!nav || (!acik && !/uye\.html$/.test(location.pathname))) return;
    let a = nav.querySelector('a.uye-link');
    if (!a) {
      a = document.createElement('a');
      a.className = 'uye-link';
      a.href = 'uye.html';
      const cta = nav.querySelector('a.cta');
      nav.insertBefore(a, cta || null);
    }
    if (/uye\.html$/.test(location.pathname)) a.setAttribute('aria-current', 'page');
    a.textContent = 'Giriş yap';
    if (!acik) return;
    U.oturum().then(o => { if (o) { a.textContent = o.takma_ad; a.title = 'Profilim ve garajım'; } }).catch(() => {});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', menu); else menu();
  U.degisti(menu);
})();
