-- Araba Karşılaştır ve Seç: üyelik, garaj (en fazla 5 araç) ve yorum tabloları
-- Supabase projesinde SQL Editor'e yapıştırıp bir kez çalıştırın. Tekrar çalıştırmak güvenlidir.
--
-- Kurallar (veritabanında zorunlu tutulur, tarayıcıdaki kontroller yalnızca kolaylık içindir):
--   * Yalnızca giriş yapmış üyeler yorum yazabilir.
--   * Her üye profiline en fazla 5 model ekleyebilir (garaj).
--   * "Sahip yorumu" yalnızca garajdaki marka + model için yazılabilir; ay ve km zorunludur.
--   * Diğer araçlar için yalnızca "Sürüş izlenimi" yazılabilir (test sürüşü, kiralama, yakının aracı ...).
--   * Bir üye aynı versiyona tek yorum yazabilir. Yeni yorumlar "bekliyor" durumunda başlar;
--     yayına almak için Table Editor > yorumlar > durum = 'yayinda' yapılır.

-- 1) Profil -----------------------------------------------------------------
create table if not exists public.profiller (
  id uuid primary key references auth.users(id) on delete cascade,
  takma_ad text not null unique check (char_length(takma_ad) between 3 and 30),
  olusturma timestamptz not null default now()
);
alter table public.profiller enable row level security;
drop policy if exists "profil herkes okur" on public.profiller;
create policy "profil herkes okur" on public.profiller for select using (true);
drop policy if exists "profil sahibi gunceller" on public.profiller;
create policy "profil sahibi gunceller" on public.profiller for update using (auth.uid() = id) with check (auth.uid() = id);

-- Kayıtta takma ad, kayıt formundaki metadata'dan alınır.
create or replace function public.yeni_uye() returns trigger
language plpgsql security definer set search_path = public as $$
declare ad text := coalesce(nullif(trim(new.raw_user_meta_data->>'takma_ad'), ''), 'uye' || substr(new.id::text, 1, 6));
begin
  if exists (select 1 from public.profiller where lower(takma_ad) = lower(ad)) then
    ad := left(ad, 23) || '-' || substr(new.id::text, 1, 6);
  end if;
  insert into public.profiller (id, takma_ad) values (new.id, ad);
  return new;
end $$;
drop trigger if exists yeni_uye_tetik on auth.users;
create trigger yeni_uye_tetik after insert on auth.users for each row execute function public.yeni_uye();

-- 2) Garaj: sahip olunan modeller (en fazla 5) --------------------------------
create table if not exists public.garaj (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  marka text not null check (char_length(marka) between 1 and 40),
  model text not null check (char_length(model) between 1 and 60),
  yil int check (yil between 1990 and 2100),
  arac_id text check (char_length(arac_id) <= 120),
  olusturma timestamptz not null default now()
);
create unique index if not exists garaj_tekil on public.garaj (user_id, marka, model, coalesce(yil, 0));
alter table public.garaj enable row level security;
drop policy if exists "garaj sahibi okur" on public.garaj;
create policy "garaj sahibi okur" on public.garaj for select using (auth.uid() = user_id);
drop policy if exists "garaj sahibi ekler" on public.garaj;
create policy "garaj sahibi ekler" on public.garaj for insert with check (auth.uid() = user_id);
drop policy if exists "garaj sahibi siler" on public.garaj;
create policy "garaj sahibi siler" on public.garaj for delete using (auth.uid() = user_id);

create or replace function public.garaj_sinir() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.garaj where user_id = new.user_id) >= 5 then
    raise exception 'Garajınıza en fazla 5 araç ekleyebilirsiniz.' using errcode = 'P0001';
  end if;
  return new;
end $$;
drop trigger if exists garaj_sinir_tetik on public.garaj;
create trigger garaj_sinir_tetik before insert on public.garaj for each row execute function public.garaj_sinir();

-- 3) Yorumlar -----------------------------------------------------------------
create table if not exists public.yorumlar (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  takma_ad text,
  arac_id text not null check (char_length(arac_id) <= 120),
  marka text not null, model text not null, yil int, versiyon text,
  tur text not null check (tur in ('sahip', 'izlenim')),
  izlenim_turu text check (izlenim_turu in ('test_surusu', 'kiralama', 'yakinin_araci', 'is_araci', 'eski_sahip', 'diger')),
  puan smallint not null check (puan between 1 and 5),
  alt_puan jsonb not null default '{}'::jsonb,
  ay int check (ay between 0 and 600),
  km int check (km between 0 and 2000000),
  baslik text not null check (char_length(baslik) between 3 and 80),
  metin text not null check (char_length(metin) between 30 and 4000),
  artilar text[] not null default '{}',
  eksiler text[] not null default '{}',
  sorunlar text[] not null default '{}',
  faydali int not null default 0,
  durum text not null default 'bekliyor' check (durum in ('bekliyor', 'yayinda', 'reddedildi')),
  olusturma timestamptz not null default now(),
  unique (user_id, arac_id)
);
create index if not exists yorumlar_model on public.yorumlar (marka, model, durum);
alter table public.yorumlar enable row level security;
drop policy if exists "yayindakiler ve kendi yorumum" on public.yorumlar;
create policy "yayindakiler ve kendi yorumum" on public.yorumlar for select using (durum = 'yayinda' or auth.uid() = user_id);
drop policy if exists "uye yorum ekler" on public.yorumlar;
create policy "uye yorum ekler" on public.yorumlar for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "uye kendi yorumunu siler" on public.yorumlar;
create policy "uye kendi yorumunu siler" on public.yorumlar for delete using (auth.uid() = user_id);

create or replace function public.yorum_kontrol() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.user_id := auth.uid();
  if new.user_id is null then raise exception 'Yorum yazmak için giriş yapın.' using errcode = 'P0001'; end if;
  new.durum := 'bekliyor';
  new.faydali := 0;
  new.olusturma := now();
  select takma_ad into new.takma_ad from public.profiller where id = new.user_id;
  if new.tur = 'sahip' then
    if not exists (select 1 from public.garaj g where g.user_id = new.user_id and g.marka = new.marka and g.model = new.model) then
      raise exception 'Sahip yorumu yalnızca garajınızdaki modeller için yazılabilir.' using errcode = 'P0001';
    end if;
    if new.ay is null or new.km is null then
      raise exception 'Sahip yorumunda kullanım süresi ve kilometre zorunludur.' using errcode = 'P0001';
    end if;
    new.izlenim_turu := null;
  else
    if new.izlenim_turu is null then
      raise exception 'Sürüş izleniminde aracı nasıl kullandığınızı seçin.' using errcode = 'P0001';
    end if;
    new.sorunlar := '{}';            -- kronik sorun istatistiği yalnızca sahiplerin bildirimlerinden çıkar
  end if;
  new.artilar := new.artilar[1:6]; new.eksiler := new.eksiler[1:6];
  return new;
end $$;
drop trigger if exists yorum_kontrol_tetik on public.yorumlar;
create trigger yorum_kontrol_tetik before insert on public.yorumlar for each row execute function public.yorum_kontrol();

-- 4) "Faydalı" oyları -----------------------------------------------------------
create table if not exists public.faydali_oy (
  yorum_id bigint not null references public.yorumlar(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  primary key (yorum_id, user_id)
);
alter table public.faydali_oy enable row level security;
drop policy if exists "oy kendi okur" on public.faydali_oy;
create policy "oy kendi okur" on public.faydali_oy for select using (auth.uid() = user_id);
drop policy if exists "oy uye ekler" on public.faydali_oy;
create policy "oy uye ekler" on public.faydali_oy for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "oy uye geri alir" on public.faydali_oy;
create policy "oy uye geri alir" on public.faydali_oy for delete using (auth.uid() = user_id);

create or replace function public.faydali_say() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.yorumlar set faydali = (select count(*) from public.faydali_oy where yorum_id = coalesce(new.yorum_id, old.yorum_id))
   where id = coalesce(new.yorum_id, old.yorum_id);
  return null;
end $$;
drop trigger if exists faydali_tetik on public.faydali_oy;
create trigger faydali_tetik after insert or delete on public.faydali_oy for each row execute function public.faydali_say();

-- 5) Forum ---------------------------------------------------------------------
--   * Konu ve cevaplar giriş yapmış üyelerce yazılır ve hemen yayına girer.
--   * Bir üye günde en fazla 5 konu ve 60 cevap yazabilir.
--   * Üç farklı üyenin şikayet ettiği konu ya da cevap otomatik gizlenir; Table Editor'de durum = 'yayinda' yapılarak geri açılır.
create table if not exists public.forum_konular (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  takma_ad text,
  kategori text not null check (kategori in ('genel','satin-alma','elektrikli','ariza-bakim','marka-kulubu','yakit-sarj','trafik-mevzuat','lastik-aksesuar')),
  baslik text not null check (char_length(baslik) between 5 and 120),
  metin text not null check (char_length(metin) between 10 and 8000),
  marka text check (char_length(marka) <= 40),
  model text check (char_length(model) <= 60),
  cevap_sayisi int not null default 0,
  son_hareket timestamptz not null default now(),
  durum text not null default 'yayinda' check (durum in ('yayinda','gizli')),
  olusturma timestamptz not null default now()
);
create index if not exists forum_konular_liste on public.forum_konular (kategori, durum, son_hareket desc);
create index if not exists forum_konular_marka on public.forum_konular (marka, model);
alter table public.forum_konular enable row level security;
drop policy if exists "forum konu okunur" on public.forum_konular;
create policy "forum konu okunur" on public.forum_konular for select using (durum = 'yayinda' or auth.uid() = user_id);
drop policy if exists "forum konu ekler" on public.forum_konular;
create policy "forum konu ekler" on public.forum_konular for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "forum konu siler" on public.forum_konular;
create policy "forum konu siler" on public.forum_konular for delete using (auth.uid() = user_id);

create table if not exists public.forum_cevaplar (
  id bigint generated always as identity primary key,
  konu_id bigint not null references public.forum_konular(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  takma_ad text,
  metin text not null check (char_length(metin) between 2 and 5000),
  durum text not null default 'yayinda' check (durum in ('yayinda','gizli')),
  olusturma timestamptz not null default now()
);
create index if not exists forum_cevaplar_konu on public.forum_cevaplar (konu_id, olusturma);
alter table public.forum_cevaplar enable row level security;
drop policy if exists "forum cevap okunur" on public.forum_cevaplar;
create policy "forum cevap okunur" on public.forum_cevaplar for select using (durum = 'yayinda' or auth.uid() = user_id);
drop policy if exists "forum cevap ekler" on public.forum_cevaplar;
create policy "forum cevap ekler" on public.forum_cevaplar for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "forum cevap siler" on public.forum_cevaplar;
create policy "forum cevap siler" on public.forum_cevaplar for delete using (auth.uid() = user_id);

create or replace function public.forum_konu_kontrol() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.user_id := auth.uid();
  if new.user_id is null then raise exception 'Konu açmak için giriş yapın.' using errcode = 'P0001'; end if;
  if (select count(*) from public.forum_konular where user_id = new.user_id and olusturma > now() - interval '1 day') >= 5 then
    raise exception 'Günde en fazla 5 konu açabilirsiniz.' using errcode = 'P0001';
  end if;
  select takma_ad into new.takma_ad from public.profiller where id = new.user_id;
  new.durum := 'yayinda'; new.cevap_sayisi := 0; new.olusturma := now(); new.son_hareket := now();
  return new;
end $$;
drop trigger if exists forum_konu_tetik on public.forum_konular;
create trigger forum_konu_tetik before insert on public.forum_konular for each row execute function public.forum_konu_kontrol();

create or replace function public.forum_cevap_kontrol() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.user_id := auth.uid();
  if new.user_id is null then raise exception 'Cevap yazmak için giriş yapın.' using errcode = 'P0001'; end if;
  if not exists (select 1 from public.forum_konular where id = new.konu_id and durum = 'yayinda') then
    raise exception 'Bu konu kapalı.' using errcode = 'P0001';
  end if;
  if (select count(*) from public.forum_cevaplar where user_id = new.user_id and olusturma > now() - interval '1 day') >= 60 then
    raise exception 'Günde en fazla 60 cevap yazabilirsiniz.' using errcode = 'P0001';
  end if;
  select takma_ad into new.takma_ad from public.profiller where id = new.user_id;
  new.durum := 'yayinda'; new.olusturma := now();
  return new;
end $$;
drop trigger if exists forum_cevap_tetik on public.forum_cevaplar;
create trigger forum_cevap_tetik before insert on public.forum_cevaplar for each row execute function public.forum_cevap_kontrol();

create or replace function public.forum_cevap_say() returns trigger
language plpgsql security definer set search_path = public as $$
declare k bigint := coalesce(new.konu_id, old.konu_id);
begin
  update public.forum_konular set
    cevap_sayisi = (select count(*) from public.forum_cevaplar where konu_id = k and durum = 'yayinda'),
    son_hareket = greatest(olusturma, coalesce((select max(olusturma) from public.forum_cevaplar where konu_id = k and durum = 'yayinda'), olusturma))
  where id = k;
  return null;
end $$;
drop trigger if exists forum_cevap_say_tetik on public.forum_cevaplar;
create trigger forum_cevap_say_tetik after insert or delete or update of durum on public.forum_cevaplar for each row execute function public.forum_cevap_say();

create table if not exists public.forum_sikayet (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  konu_id bigint references public.forum_konular(id) on delete cascade,
  cevap_id bigint references public.forum_cevaplar(id) on delete cascade,
  sebep text not null check (sebep in ('reklam','hakaret','yaniltici','kisisel-bilgi','diger')),
  olusturma timestamptz not null default now(),
  check ((konu_id is null) <> (cevap_id is null))
);
create unique index if not exists forum_sikayet_tekil on public.forum_sikayet (user_id, coalesce(konu_id, 0), coalesce(cevap_id, 0));
alter table public.forum_sikayet enable row level security;
drop policy if exists "sikayet uye ekler" on public.forum_sikayet;
create policy "sikayet uye ekler" on public.forum_sikayet for insert to authenticated with check (auth.uid() = user_id);

create or replace function public.forum_sikayet_isle() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.konu_id is not null and (select count(distinct user_id) from public.forum_sikayet where konu_id = new.konu_id) >= 3 then
    update public.forum_konular set durum = 'gizli' where id = new.konu_id;
  end if;
  if new.cevap_id is not null and (select count(distinct user_id) from public.forum_sikayet where cevap_id = new.cevap_id) >= 3 then
    update public.forum_cevaplar set durum = 'gizli' where id = new.cevap_id;
  end if;
  return null;
end $$;
drop trigger if exists forum_sikayet_tetik on public.forum_sikayet;
create trigger forum_sikayet_tetik after insert on public.forum_sikayet for each row execute function public.forum_sikayet_isle();
