alter table public.restaurant_demos
  add column if not exists restaurant_type text not null default 'Fast Casual',
  add column if not exists cta_type text not null default 'WhatsApp Order',
  add column if not exists cta_label text,
  add column if not exists cta_url text,
  add column if not exists secondary_cta_enabled boolean not null default false,
  add column if not exists secondary_cta_label text,
  add column if not exists secondary_cta_url text;

alter table public.restaurant_menu_items
  add column if not exists category text not null default 'Main Dishes',
  add column if not exists featured boolean not null default false;

alter table public.restaurant_demos
  add constraint restaurant_type_check check (restaurant_type in (
    'Grill House',
    'Cafe',
    'Wellness Cafe',
    'Rooftop Lounge',
    'Fine Dining',
    'Fast Casual',
    'Buffet',
    'Garden Restaurant',
    'Cocktail Bar',
    'Family Restaurant'
  ));

alter table public.restaurant_demos
  add constraint cta_type_check check (cta_type in (
    'WhatsApp Order',
    'Reserve Table',
    'Explore Menu',
    'Book Event',
    'Visit Us',
    'Call Now',
    'Get Directions'
  ));
