import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DemoPayload, DemoStatus, DemoWithRelations } from "@/lib/types";
import { buildBaseSlug, slugify } from "@/lib/slug";

const demoSelect = `
  *,
  restaurant_menu_items (*),
  restaurant_gallery_images (*)
`;

export async function requireUser() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
}

export async function canPreviewDemos() {
  const user = await requireUser();
  return Boolean(user);
}

export async function getDemos() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("restaurant_demos")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getDemoById(id: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("restaurant_demos")
    .select(demoSelect)
    .eq("id", id)
    .order("sort_order", {
      referencedTable: "restaurant_menu_items",
      ascending: true
    })
    .order("sort_order", {
      referencedTable: "restaurant_gallery_images",
      ascending: true
    })
    .single<DemoWithRelations>();

  if (error) return null;
  return data;
}

export async function getDemoBySlug(
  slug: string,
  { includeDrafts = false }: { includeDrafts?: boolean } = {}
) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) notFound();
  let query = supabase
    .from("restaurant_demos")
    .select(demoSelect)
    .eq("slug", slug)
    .order("sort_order", {
      referencedTable: "restaurant_menu_items",
      ascending: true
    })
    .order("sort_order", {
      referencedTable: "restaurant_gallery_images",
      ascending: true
    });

  if (!includeDrafts) query = query.eq("status", "published");

  const { data, error } = await query.single<DemoWithRelations>();
  if (error || !data) notFound();
  return data;
}

export async function getPublishedDemoBySlug(slug: string, includeDraft = false) {
  return getDemoBySlug(slug, { includeDrafts: includeDraft });
}

export async function generateUniqueSlug(
  name: string,
  area: string,
  requestedSlug?: string,
  ignoreId?: string
) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured.");
  const base = slugify(requestedSlug || "") || buildBaseSlug(name, area) || "restaurant-demo";
  let candidate = base;
  let suffix = 2;

  while (true) {
    let query = supabase
      .from("restaurant_demos")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    if (!data || data.id === ignoreId) return candidate;
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

export function sanitizeDemoPayload(payload: DemoPayload) {
  return {
    name: payload.name.trim(),
    area: payload.area.trim(),
    tagline: payload.tagline?.trim() || null,
    description: payload.description?.trim() || null,
    hero_image_url: payload.hero_image_url?.trim() || null,
    phone: payload.phone.trim(),
    whatsapp_number: payload.whatsapp_number.trim(),
    google_maps_url: payload.google_maps_url?.trim() || null,
    instagram_url: payload.instagram_url?.trim() || null,
    facebook_url: payload.facebook_url?.trim() || null,
    primary_color: payload.primary_color || "#171412",
    accent_color: payload.accent_color || "#ea580c",
    status: payload.status as DemoStatus
  };
}

export function validateDemoPayload(payload: DemoPayload) {
  const missing = [];
  if (!payload.name?.trim()) missing.push("restaurant name");
  if (!payload.area?.trim()) missing.push("area");
  if (!payload.phone?.trim()) missing.push("phone number");
  if (!payload.whatsapp_number?.trim()) missing.push("WhatsApp number");
  if (!["draft", "published"].includes(payload.status)) missing.push("valid status");
  return missing;
}
