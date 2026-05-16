-- Repair public demo reads for the current schema.
--
-- The production app stores publication state in restaurant_demos.status,
-- not in an is_published boolean. Public reads should expose only rows whose
-- status is 'published'; authenticated staff can continue to preview drafts.

alter table public.restaurant_demos enable row level security;
alter table public.restaurant_menu_items enable row level security;
alter table public.restaurant_gallery_images enable row level security;

drop policy if exists "Public can view published demos" on public.restaurant_demos;
drop policy if exists "Anyone can read published demos" on public.restaurant_demos;
create policy "Public can view published demos"
on public.restaurant_demos
for select
to anon
using (status = 'published');

drop policy if exists "Public can view published menu items" on public.restaurant_menu_items;
drop policy if exists "Anyone can read published menu items" on public.restaurant_menu_items;
create policy "Public can view published menu items"
on public.restaurant_menu_items
for select
to anon
using (
  exists (
    select 1
    from public.restaurant_demos
    where restaurant_demos.id = restaurant_menu_items.demo_id
      and restaurant_demos.status = 'published'
  )
);

drop policy if exists "Public can view published gallery images" on public.restaurant_gallery_images;
drop policy if exists "Anyone can read published gallery images" on public.restaurant_gallery_images;
create policy "Public can view published gallery images"
on public.restaurant_gallery_images
for select
to anon
using (
  exists (
    select 1
    from public.restaurant_demos
    where restaurant_demos.id = restaurant_gallery_images.demo_id
      and restaurant_demos.status = 'published'
  )
);

create index if not exists restaurant_demos_slug_status_idx
on public.restaurant_demos(slug, status);
