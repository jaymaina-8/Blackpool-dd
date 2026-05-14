import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  generateUniqueSlug,
  sanitizeDemoPayload,
  validateDemoPayload
} from "@/lib/demo-data";
import type { DemoPayload } from "@/lib/types";

export async function GET() {
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
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ demos: data });
}

export async function POST(request: Request) {
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

  const slug = await generateUniqueSlug(payload.name, payload.area, payload.slug);
  const demo = {
    ...sanitizeDemoPayload(payload),
    slug,
    owner_id: user.id,
    published_at: payload.status === "published" ? new Date().toISOString() : null
  };

  const { data, error } = await supabase
    .from("restaurant_demos")
    .insert(demo)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const menuRows = payload.menu_items
    .filter((item) => item.name.trim())
    .map((item, index) => ({
      demo_id: data.id,
      name: item.name.trim(),
      description: item.description?.trim() || null,
      price: item.price?.trim() || null,
      image_url: item.image_url?.trim() || null,
      sort_order: item.sort_order ?? index
    }));

  const galleryRows = payload.gallery_images
    .filter((image) => image.image_url.trim())
    .map((image, index) => ({
      demo_id: data.id,
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
