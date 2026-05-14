import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  generateUniqueSlug,
  sanitizeDemoPayload,
  validateDemoPayload
} from "@/lib/demo-data";
import type { DemoPayload } from "@/lib/types";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 503 }
    );
  }
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("restaurant_demos")
    .select(
      `
      *,
      restaurant_menu_items (*),
      restaurant_gallery_images (*)
    `
    )
    .eq("id", id)
    .order("sort_order", {
      referencedTable: "restaurant_menu_items",
      ascending: true
    })
    .order("sort_order", {
      referencedTable: "restaurant_gallery_images",
      ascending: true
    })
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ demo: data });
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 503 }
    );
  }
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as DemoPayload;
  const missing = validateDemoPayload(payload);

  if (missing.length) {
    return NextResponse.json(
      { error: `Missing ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const slug = await generateUniqueSlug(payload.name, payload.area, payload.slug, id);
  const demo = sanitizeDemoPayload(payload);

  const { data: existing } = await supabase
    .from("restaurant_demos")
    .select("status,published_at")
    .eq("id", id)
    .single();

  const shouldStampPublishedAt =
    payload.status === "published" && !existing?.published_at;

  const { data, error } = await supabase
    .from("restaurant_demos")
    .update({
      ...demo,
      slug,
      published_at:
        shouldStampPublishedAt ? new Date().toISOString() : existing?.published_at ?? null
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { error: deleteMenuError } = await supabase
    .from("restaurant_menu_items")
    .delete()
    .eq("demo_id", id);
  if (deleteMenuError) {
    return NextResponse.json({ error: deleteMenuError.message }, { status: 500 });
  }

  const { error: deleteGalleryError } = await supabase
    .from("restaurant_gallery_images")
    .delete()
    .eq("demo_id", id);
  if (deleteGalleryError) {
    return NextResponse.json({ error: deleteGalleryError.message }, { status: 500 });
  }

  const menuRows = payload.menu_items
    .filter((item) => item.name.trim())
    .map((item, index) => ({
      demo_id: id,
      name: item.name.trim(),
      description: item.description?.trim() || null,
      price: item.price?.trim() || null,
      image_url: item.image_url?.trim() || null,
      sort_order: item.sort_order ?? index
    }));

  const galleryRows = payload.gallery_images
    .filter((image) => image.image_url.trim())
    .map((image, index) => ({
      demo_id: id,
      image_url: image.image_url.trim(),
      alt_text: image.alt_text?.trim() || data.name,
      sort_order: image.sort_order ?? index
    }));

  if (menuRows.length) {
    const { error: menuError } = await supabase
      .from("restaurant_menu_items")
      .insert(menuRows);
    if (menuError) return NextResponse.json({ error: menuError.message }, { status: 500 });
  }

  if (galleryRows.length) {
    const { error: galleryError } = await supabase
      .from("restaurant_gallery_images")
      .insert(galleryRows);
    if (galleryError) {
      return NextResponse.json({ error: galleryError.message }, { status: 500 });
    }
  }

  return NextResponse.json({
    demo: data,
    previewUrl: `/demo/${data.slug}?preview=1`,
    publicUrl: `/demo/${data.slug}`
  });
}
