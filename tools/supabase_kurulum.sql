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
