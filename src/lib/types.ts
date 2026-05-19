export type DemoStatus = "draft" | "published";

export type RestaurantDemo = {
  id: string;
  owner_id: string | null;
  name: string;
  area: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  hero_image_url: string | null;
  phone: string;
  whatsapp_number: string;
  google_maps_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  primary_color: string;
  accent_color: string;
  restaurant_type: string;
  cta_type: string;
  cta_label: string | null;
  cta_url: string | null;
  secondary_cta_enabled: boolean;
  secondary_cta_label: string | null;
  secondary_cta_url: string | null;
  status: DemoStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type MenuItem = {
  id: string;
  demo_id: string;
  name: string;
  description: string | null;
  price: string | null;
  image_url: string | null;
  category: string;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type GalleryImage = {
  id: string;
  demo_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type DemoWithRelations = RestaurantDemo & {
  restaurant_menu_items: MenuItem[];
  restaurant_gallery_images: GalleryImage[];
};

export type DemoPayload = {
  name: string;
  area: string;
  slug?: string;
  tagline?: string;
  description?: string;
  hero_image_url?: string;
  phone: string;
  whatsapp_number: string;
  google_maps_url?: string;
  instagram_url?: string;
  facebook_url?: string;
  primary_color?: string;
  accent_color?: string;
  restaurant_type: string;
  cta_type: string;
  cta_label?: string;
  cta_url?: string;
  secondary_cta_enabled: boolean;
  secondary_cta_label?: string;
  secondary_cta_url?: string;
  status: DemoStatus;
  menu_items: Array<{
    id?: string;
    name: string;
    description?: string;
    price?: string;
    image_url?: string;
    sort_order: number;
    category?: string;
    featured?: boolean;
  }>;
  gallery_images: Array<{
    id?: string;
    image_url: string;
    alt_text?: string;
    sort_order: number;
  }>;
};
