-- Elite Valves: schema, RLS, storage, and seed data
-- Run this entire file in Supabase SQL Editor

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  image_url text not null default '',
  description text not null default '',
  sizes text[] not null default '{}',
  specs jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_ranges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  image_url text not null default '',
  pdf_url text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.products enable row level security;
alter table public.product_ranges enable row level security;
alter table public.certifications enable row level security;

-- Public read
drop policy if exists "Public read products" on public.products;
create policy "Public read products"
  on public.products for select
  using (true);

drop policy if exists "Public read product_ranges" on public.product_ranges;
create policy "Public read product_ranges"
  on public.product_ranges for select
  using (true);

drop policy if exists "Public read certifications" on public.certifications;
create policy "Public read certifications"
  on public.certifications for select
  using (true);

-- Authenticated write
drop policy if exists "Auth insert products" on public.products;
create policy "Auth insert products"
  on public.products for insert
  to authenticated
  with check (true);

drop policy if exists "Auth update products" on public.products;
create policy "Auth update products"
  on public.products for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Auth delete products" on public.products;
create policy "Auth delete products"
  on public.products for delete
  to authenticated
  using (true);

drop policy if exists "Auth insert product_ranges" on public.product_ranges;
create policy "Auth insert product_ranges"
  on public.product_ranges for insert
  to authenticated
  with check (true);

drop policy if exists "Auth update product_ranges" on public.product_ranges;
create policy "Auth update product_ranges"
  on public.product_ranges for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Auth delete product_ranges" on public.product_ranges;
create policy "Auth delete product_ranges"
  on public.product_ranges for delete
  to authenticated
  using (true);

drop policy if exists "Auth insert certifications" on public.certifications;
create policy "Auth insert certifications"
  on public.certifications for insert
  to authenticated
  with check (true);

drop policy if exists "Auth update certifications" on public.certifications;
create policy "Auth update certifications"
  on public.certifications for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Auth delete certifications" on public.certifications;
create policy "Auth delete certifications"
  on public.certifications for delete
  to authenticated
  using (true);

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

insert into storage.buckets (id, name, public)
values
  ('product-images', 'product-images', true),
  ('range-images', 'range-images', true),
  ('certificates', 'certificates', true)
on conflict (id) do nothing;

-- Public read for all three buckets
drop policy if exists "Public read product-images" on storage.objects;
create policy "Public read product-images"
  on storage.objects for select
  using (bucket_id in ('product-images', 'range-images', 'certificates'));

drop policy if exists "Auth upload media" on storage.objects;
create policy "Auth upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id in ('product-images', 'range-images', 'certificates'));

drop policy if exists "Auth update media" on storage.objects;
create policy "Auth update media"
  on storage.objects for update
  to authenticated
  using (bucket_id in ('product-images', 'range-images', 'certificates'));

drop policy if exists "Auth delete media" on storage.objects;
create policy "Auth delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id in ('product-images', 'range-images', 'certificates'));

-- ============================================================
-- SEED DATA (skip if already seeded)
-- ============================================================

-- Clear and reseed only when empty (safe for first run)
do $$
begin
  if (select count(*) from public.products) = 0 then
    insert into public.products (name, category, image_url, description, sizes, specs, sort_order) values
    (
      'Floating Ball Valve',
      'Valves',
      '/images/flanged-ball-valve.png',
      'High-performance floating ball valve designed for high-pressure industrial applications.',
      array['2 inch','3 inch','4 inch','5 inch','6 inch','8 inch','10 inch','12 inch'],
      '{"BrandName":"Elite Valves","Material":"Stainless Steel","Pressure":"Normal","Temperature":"-20°C to 200°C"}'::jsonb,
      1
    ),
    (
      'Wedge Gate Valve',
      'Valves',
      '/images/gate-valve.png',
      'Heavy-duty wedge gate valve engineered for oil and gas pipelines.',
      array['2 inch','3 inch','4 inch','5 inch','6 inch','8 inch','10 inch','12 inch'],
      '{"BrandName":"Elite Valves","Material":"Stainless Steel","Pressure":"Normal","Temperature":"-20°C to 200°C"}'::jsonb,
      2
    ),
    (
      'Butterfly Valve',
      'Valves',
      '/images/butterfly-valve.png',
      'Heavy-duty butterfly valve engineered for oil and gas pipelines.',
      array['2 inch','3 inch','4 inch','5 inch','6 inch','8 inch','10 inch','12 inch'],
      '{"BrandName":"Elite Valves","Material":"Stainless Steel","Pressure":"Normal","Temperature":"-20°C to 200°C"}'::jsonb,
      3
    ),
    (
      'Globe Valve',
      'Valves',
      '/images/globe-valve.png',
      'Heavy-duty globe valve engineered for oil and gas pipelines.',
      array['2 inch','3 inch','4 inch','5 inch','6 inch','8 inch','10 inch','12 inch'],
      '{"BrandName":"Elite Valves","Material":"Stainless Steel","Pressure":"Normal","Temperature":"-20°C to 200°C"}'::jsonb,
      4
    ),
    (
      'Pipes',
      'Pipes',
      '/images/pipes.png',
      'Heavy-duty pipes engineered for oil and gas pipelines.',
      array['2 inch','4 inch','6 inch'],
      '{"Material":"Stainless Steel","PressureRating":"ANSI 300","Temperature":"-20°C to 200°C","Connection":"Flanged","Operation":"Manual / Actuated"}'::jsonb,
      5
    ),
    (
      'MS Bend ( SCH 40-20)',
      'Valves&Pipes Fittings',
      '/images/ms-bend.png',
      'Heavy-duty Ms Bend engineered for oil and gas pipelines.',
      array['2 inch','4 inch','6 inch'],
      '{"Material":"Stainless Steel","PressureRating":"ANSI 300","Temperature":"-20°C to 200°C","Connection":"Flanged","Operation":"Manual / Actuated"}'::jsonb,
      6
    ),
    (
      'Ms Elbow (90-45 degre ) SCH 40-20',
      'Valves&Pipes Fittings',
      '/images/ms-elbow.png',
      'Heavy-duty Ms Elbow engineered for oil and gas pipelines.',
      array['2 inch','4 inch','6 inch'],
      '{"Material":"Stainless Steel","PressureRating":"ANSI 300","Temperature":"-20°C to 200°C","Connection":"Flanged","Operation":"Manual / Actuated"}'::jsonb,
      7
    ),
    (
      'MS Tee ( SCH 40-20)',
      'Valves&Pipes Fittings',
      '/images/ms-tee.png',
      'Heavy-duty Ms Tee engineered for oil and gas pipelines.',
      array['2 inch','4 inch','6 inch'],
      '{"Material":"Stainless Steel","PressureRating":"ANSI 300","Temperature":"-20°C to 200°C","Connection":"Flanged","Operation":"Manual / Actuated"}'::jsonb,
      8
    ),
    (
      'Ferrule Fitting',
      'Ferrule Fitting',
      '/images/ferrule-fit.png',
      'Heavy-duty Ferrule fitting engineered for oil and gas pipelines.',
      array['2 inch','4 inch','6 inch'],
      '{"Material":"Stainless Steel","PressureRating":"ANSI 300","Temperature":"-20°C to 200°C","Connection":"Flanged","Operation":"Manual / Actuated"}'::jsonb,
      9
    );
  end if;

  if (select count(*) from public.product_ranges) = 0 then
    insert into public.product_ranges (name, image_url, sort_order) values
      ('Valves', '/productrange/lgvalve.png', 1),
      ('Valves&Pipes Fittings', '/productrange/fitting.png', 2),
      ('Ferrule Fitting', '/images/ferrule-fit.png', 3),
      ('Pipes', '/productrange/pipe.png', 4);
  end if;

  if (select count(*) from public.certifications) = 0 then
    insert into public.certifications (title, image_url, pdf_url, sort_order) values
      (
        'Letter of Authorization IMGV',
        '/certificates/LETTEROFAUTHORIZATIONIMGV.png',
        '/certificates/LETTER OF AUTHORIZATION IMGV.pdf',
        1
      ),
      (
        'Letter of Authorization TFW',
        '/certificates/LETTEROFAUTHORIZATIONTFW.png',
        '/certificates/LETTER OF AUTHORIZATION TFW.pdf',
        2
      );
  end if;
end $$;
