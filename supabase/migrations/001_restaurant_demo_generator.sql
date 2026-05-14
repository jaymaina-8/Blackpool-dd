create extension if not exists "pgcrypto";

create table if not exists public.restaurant_demos (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
  name text not null,
  area text not null,
  slug text not null unique,
  tagline text,
  description text,
  hero_image_url text,
  phone text not null,
  whatsapp_number text not null,
  google_maps_url text,
  instagram_url text,
  facebook_url text,
  primary_color text not null default '#171412',
  accent_color text not null default '#ea580c',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.restaurant_menu_items (
  id uuid primary key default gen_random_uuid(),
  demo_id uuid not null references public.restaurant_demos(id) on delete cascade,
  name text not null,
  description text,
  price text,
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.restaurant_gallery_images (
  id uuid primary key default gen_random_uuid(),
  demo_id uuid not null references public.restaurant_demos(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists restaurant_demos_status_idx on public.restaurant_demos(status);
create index if not exists restaurant_demos_slug_status_idx on public.restaurant_demos(slug, status);
create index if not exists restaurant_menu_items_demo_sort_idx on public.restaurant_menu_items(demo_id, sort_order);
create index if not exists restaurant_gallery_images_demo_sort_idx on public.restaurant_gallery_images(demo_id, sort_order);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_restaurant_demos_updated_at on public.restaurant_demos;
create trigger set_restaurant_demos_updated_at
before update on public.restaurant_demos
for each row execute function public.set_updated_at();

drop trigger if exists set_restaurant_menu_items_updated_at on public.restaurant_menu_items;
create trigger set_restaurant_menu_items_updated_at
before update on public.restaurant_menu_items
for each row execute function public.set_updated_at();

drop trigger if exists set_restaurant_gallery_images_updated_at on public.restaurant_gallery_images;
create trigger set_restaurant_gallery_images_updated_at
before update on public.restaurant_gallery_images
for each row execute function public.set_updated_at();

alter table public.restaurant_demos enable row level security;
alter table public.restaurant_menu_items enable row level security;
alter table public.restaurant_gallery_images enable row level security;

drop policy if exists "Authenticated staff can manage demos" on public.restaurant_demos;
create policy "Authenticated staff can manage demos"
on public.restaurant_demos for all
to authenticated
using (true)
with check (true);

drop policy if exists "Anyone can read published demos" on public.restaurant_demos;
create policy "Anyone can read published demos"
on public.restaurant_demos for select
to anon
using (status = 'published');

drop policy if exists "Authenticated staff can manage menu items" on public.restaurant_menu_items;
create policy "Authenticated staff can manage menu items"
on public.restaurant_menu_items for all
to authenticated
using (true)
with check (true);

drop policy if exists "Anyone can read published menu items" on public.restaurant_menu_items;
create policy "Anyone can read published menu items"
on public.restaurant_menu_items for select
to anon
using (
  exists (
    select 1 from public.restaurant_demos
    where restaurant_demos.id = restaurant_menu_items.demo_id
    and restaurant_demos.status = 'published'
  )
);

drop policy if exists "Authenticated staff can manage gallery images" on public.restaurant_gallery_images;
create policy "Authenticated staff can manage gallery images"
on public.restaurant_gallery_images for all
to authenticated
using (true)
with check (true);

drop policy if exists "Anyone can read published gallery images" on public.restaurant_gallery_images;
create policy "Anyone can read published gallery images"
on public.restaurant_gallery_images for select
to anon
using (
  exists (
    select 1 from public.restaurant_demos
    where restaurant_demos.id = restaurant_gallery_images.demo_id
    and restaurant_demos.status = 'published'
  )
);

insert into storage.buckets (id, name, public)
values ('restaurant-demo-images', 'restaurant-demo-images', true)
on conflict (id) do nothing;

drop policy if exists "Authenticated staff can upload restaurant demo images" on storage.objects;
create policy "Authenticated staff can upload restaurant demo images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'restaurant-demo-images');

drop policy if exists "Authenticated staff can update restaurant demo images" on storage.objects;
create policy "Authenticated staff can update restaurant demo images"
on storage.objects for update
to authenticated
using (bucket_id = 'restaurant-demo-images')
with check (bucket_id = 'restaurant-demo-images');

drop policy if exists "Anyone can read restaurant demo images" on storage.objects;
create policy "Anyone can read restaurant demo images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'restaurant-demo-images');
