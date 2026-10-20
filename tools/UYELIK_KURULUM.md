# Üyelik ve yorum sistemini açma (Supabase, ücretsiz plan)

1. https://supabase.com adresinde hesap açın ve yeni bir proje oluşturun (bölge: Frankfurt `eu-central-1`).
2. SQL Editor > New query: `tools/supabase_kurulum.sql` dosyasının tamamını yapıştırıp **Run** deyin.
3. Authentication > URL Configuration:
   - Site URL: sitenin adresi (ör. `https://arabakarsilastirsec.netlify.app`)
   - Redirect URLs: `https://<site>/uye.html`
4. Authentication > Providers > Email: açık kalsın, "Confirm email" açık kalsın (sahte üyeliği azaltır).
5. Project Settings > API: "Project URL" ve "anon public" anahtarını `assets/uye-ayar.js` içine yazın.
   anon anahtarı tarayıcıda görünür, bu normaldir; yetkiler tablo kurallarıyla (RLS) sınırlıdır.
   `service_role` anahtarını hiçbir dosyaya yazmayın.

## Yorumları yayına alma
Yeni yorumlar `bekliyor` durumunda gelir. Table Editor > `yorumlar` tablosunda `durum` sütununu
`yayinda` (yayınla) ya da `reddedildi` yapın. Bekleyen yorumu yalnızca yazan üye görür.

## Kurallar (veritabanında zorunlu)
- Yorumu yalnızca giriş yapmış üye yazar; aynı versiyona tek yorum.
- Garaj en fazla 5 model. "Sahip yorumu" yalnızca garajdaki marka + model için; ay ve km zorunlu.
- Diğer araçlara "Sürüş izlenimi" yazılır (test sürüşü, kiralama, yakının aracı, iş aracı, eski sahip, diğer).
  Kronik sorun istatistiği yalnızca sahip yorumlarından hesaplanır.
