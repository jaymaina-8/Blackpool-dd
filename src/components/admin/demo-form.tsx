"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  FileSpark,
  Link2,
  MessageCircle,
  Plus,
  Save,
  Sparkles,
  Star,
  Trash2
} from "lucide-react";
import { Button, Field, inputClass, textareaClass } from "@/components/ui";
import { ImageUpload } from "@/components/admin/image-upload";
import { buildBaseSlug } from "@/lib/slug";
import { getCtaLabel, getCtaUrl } from "@/lib/whatsapp";
import type { DemoPayload, DemoWithRelations } from "@/lib/types";

type MenuDraft = DemoPayload["menu_items"][number];
type GalleryDraft = DemoPayload["gallery_images"][number];

const RESTAURANT_TYPE_PROFILES = {
  "Grill House": {
    label: "Grill House",
    primary_color: "#111827",
    accent_color: "#ef4444",
    suggested_cta: "WhatsApp Order",
    tagline: "Bold open-fire flavor for hungry crowds.",
    description: "Contrast, confidence, and fast customer action for a modern grill destination."
  },
  Cafe: {
    label: "Cafe",
    primary_color: "#1f2937",
    accent_color: "#f97316",
    suggested_cta: "Visit Us",
    tagline: "Coffee, calm, and connection in every cup.",
    description: "Warm, inviting storytelling with an easy path to visit or place an order."
  },
  "Wellness Cafe": {
    label: "Wellness Cafe",
    primary_color: "#0f172a",
    accent_color: "#38bdf8",
    suggested_cta: "Explore Menu",
    tagline: "Clean, nourishing flavors for modern wellbeing.",
    description: "Soft color balance and relaxed messaging that feels thoughtful and premium."
  },
  "Rooftop Lounge": {
    label: "Rooftop Lounge",
    primary_color: "#111827",
    accent_color: "#a855f7",
    suggested_cta: "Reserve Table",
    tagline: "Elevated evenings with skyline views.",
    description: "A sleek guest experience with reservation-first messaging and premium polish."
  },
  "Fine Dining": {
    label: "Fine Dining",
    primary_color: "#020617",
    accent_color: "#f59e0b",
    suggested_cta: "Reserve Table",
    tagline: "Curated menus for unforgettable evenings.",
    description: "Elegant spacing, luxury tone, and a refined path for high-intent guests."
  },
  "Fast Casual": {
    label: "Fast Casual",
    primary_color: "#111827",
    accent_color: "#f97316",
    suggested_cta: "WhatsApp Order",
    tagline: "Bold flavors that move fast on mobile.",
    description: "A streamlined, high-contrast layout built for quick ordering and fast conversions."
  },
  Buffet: {
    label: "Buffet",
    primary_color: "#0f172a",
    accent_color: "#22c55e",
    suggested_cta: "Explore Menu",
    tagline: "An abundant spread for easy discovery.",
    description: "Bright, organized sections with generous imagery and confident navigation."
  },
  "Garden Restaurant": {
    label: "Garden Restaurant",
    primary_color: "#064e3b",
    accent_color: "#a3e635",
    suggested_cta: "Visit Us",
    tagline: "Fresh ingredients, open air, and relaxed hospitality.",
    description: "Nature-inspired visuals and grounded messaging for slower, thoughtful decisions."
  },
  "Cocktail Bar": {
    label: "Cocktail Bar",
    primary_color: "#0f172a",
    accent_color: "#f472b6",
    suggested_cta: "Book Event",
    tagline: "Creative cocktails, elevated nights.",
    description: "Stylish, modern presentation with a strong focus on reservations and atmosphere."
  },
  "Family Restaurant": {
    label: "Family Restaurant",
    primary_color: "#111827",
    accent_color: "#fb923c",
    suggested_cta: "Call Now",
    tagline: "Friendly meals for every table.",
    description: "Approachable layout with warm messaging and clear customer pathways."
  }
};

const CTA_TYPES = [
  "WhatsApp Order",
  "Reserve Table",
  "Explore Menu",
  "Book Event",
  "Visit Us",
  "Call Now",
  "Get Directions"
] as const;

const MENU_CATEGORIES = ["Breakfast", "Main Dishes", "Cocktails", "Desserts", "Drinks"];

const emptyMenuItem = (sortOrder = 0): MenuDraft => ({
  name: "",
  description: "",
  price: "",
  image_url: "",
  sort_order: sortOrder,
  category: "Main Dishes",
  featured: false
});

const emptyGalleryImage = (sortOrder = 0): GalleryDraft => ({
  image_url: "",
  alt_text: "",
  sort_order: sortOrder
});

export function DemoForm({
  mode,
  demo
}: {
  mode: "create" | "edit";
  demo?: DemoWithRelations;
}) {
  const router = useRouter();
  const [payload, setPayload] = useState<DemoPayload>(() => ({
    name: demo?.name || "",
    area: demo?.area || "",
    slug: demo?.slug || "",
    tagline: demo?.tagline || "",
    description: demo?.description || "",
    hero_image_url: demo?.hero_image_url || "",
    phone: demo?.phone || "",
    whatsapp_number: demo?.whatsapp_number || "",
    google_maps_url: demo?.google_maps_url || "",
    instagram_url: demo?.instagram_url || "",
    facebook_url: demo?.facebook_url || "",
    primary_color: demo?.primary_color || "#171412",
    accent_color: demo?.accent_color || "#ea580c",
    restaurant_type: demo?.restaurant_type || "Fast Casual",
    cta_type: demo?.cta_type || "WhatsApp Order",
    cta_label: demo?.cta_label || "",
    cta_url: demo?.cta_url || "",
    secondary_cta_enabled: demo?.secondary_cta_enabled ?? false,
    secondary_cta_label: demo?.secondary_cta_label || "",
    secondary_cta_url: demo?.secondary_cta_url || "",
    status: demo?.status || "draft",
    menu_items: demo?.restaurant_menu_items?.length
      ? demo.restaurant_menu_items.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description || "",
          price: item.price || "",
          image_url: item.image_url || "",
          category: item.category || "Main Dishes",
          featured: item.featured ?? false,
          sort_order: item.sort_order
        }))
      : [emptyMenuItem()],
    gallery_images: demo?.restaurant_gallery_images?.length
      ? demo.restaurant_gallery_images.map((image) => ({
          id: image.id,
          image_url: image.image_url,
          alt_text: image.alt_text || "",
          sort_order: image.sort_order
        }))
      : [emptyGalleryImage()]
  }));
  const [heroPrompt, setHeroPrompt] = useState("");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const suggestedSlug = useMemo(
    () => buildBaseSlug(payload.name, payload.area),
    [payload.name, payload.area]
  );

  const previewSlug = payload.slug || suggestedSlug;
  const previewCtaLabel = payload.cta_label || getCtaLabel(payload.cta_type);
  const previewCtaUrl = payload.cta_url ||
    getCtaUrl(
      payload.cta_type,
      payload.whatsapp_number,
      payload.name || "Restaurant",
      payload.area || "your area",
      payload.google_maps_url || undefined,
      previewSlug
    );

  const previewOrigin = typeof window !== "undefined" ? window.location.origin : "https://example.com";

  function updateField<K extends keyof DemoPayload>(key: K, value: DemoPayload[K]) {
    setPayload((current) => ({ ...current, [key]: value }));
  }

  function updateMenu(index: number, item: Partial<MenuDraft>) {
    setPayload((current) => ({
      ...current,
      menu_items: current.menu_items.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, ...item } : entry
      )
    }));
  }

  function updateGallery(index: number, image: Partial<GalleryDraft>) {
    setPayload((current) => ({
      ...current,
      gallery_images: current.gallery_images.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, ...image } : entry
      )
    }));
  }

  function applyRestaurantType(type: string) {
    const profile = RESTAURANT_TYPE_PROFILES[type] || RESTAURANT_TYPE_PROFILES["Fast Casual"];
    setPayload((current) => {
      const defaultPalette = current.primary_color === "#171412" && current.accent_color === "#ea580c";
      const paletteMatchesCurrent = Object.values(RESTAURANT_TYPE_PROFILES).some(
        (profileOption) =>
          profileOption.primary_color === current.primary_color &&
          profileOption.accent_color === current.accent_color
      );

      return {
        ...current,
        restaurant_type: type,
        primary_color: defaultPalette || paletteMatchesCurrent ? profile.primary_color : current.primary_color,
        accent_color: defaultPalette || paletteMatchesCurrent ? profile.accent_color : current.accent_color,
        cta_type:
          current.cta_type === RESTAURANT_TYPE_PROFILES[current.restaurant_type]?.suggested_cta ||
          current.cta_type === "WhatsApp Order"
            ? profile.suggested_cta
            : current.cta_type,
        tagline: current.tagline || profile.tagline,
        description: current.description || profile.description
      };
    });
  }

  function setCtaType(value: string) {
    const labelSuggestion = getCtaLabel(value);
    const urlSuggestion = getCtaUrl(
      value,
      payload.whatsapp_number,
      payload.name || "Restaurant",
      payload.area || "your area",
      payload.google_maps_url || undefined,
      previewSlug
    );

    setPayload((current) => ({
      ...current,
      cta_type: value,
      cta_label:
        !current.cta_label || current.cta_label === getCtaLabel(current.cta_type)
          ? labelSuggestion
          : current.cta_label,
      cta_url:
        !current.cta_url || current.cta_url === getCtaUrl(
          current.cta_type,
          current.whatsapp_number,
          current.name || "Restaurant",
          current.area || "your area",
          current.google_maps_url || undefined,
          previewSlug
        )
          ? urlSuggestion
          : current.cta_url
    }));
  }

  function moveMenuItem(index: number, targetIndex: number) {
    setPayload((current) => {
      if (targetIndex < 0 || targetIndex >= current.menu_items.length) return current;
      const items = [...current.menu_items];
      const [moved] = items.splice(index, 1);
      items.splice(targetIndex, 0, moved);
      return { ...current, menu_items: items.map((item, order) => ({ ...item, sort_order: order })) };
    });
  }

  function duplicateMenuItem(index: number) {
    setPayload((current) => {
      const clone = { ...current.menu_items[index], sort_order: current.menu_items.length };
      return {
        ...current,
        menu_items: [...current.menu_items, clone]
      };
    });
  }

  function removeMenuItem(index: number) {
    setPayload((current) => ({
      ...current,
      menu_items: current.menu_items.filter((_, itemIndex) => itemIndex !== index)
    }));
  }

  function moveGalleryImage(index: number, targetIndex: number) {
    setPayload((current) => {
      if (targetIndex < 0 || targetIndex >= current.gallery_images.length) return current;
      const items = [...current.gallery_images];
      const [moved] = items.splice(index, 1);
      items.splice(targetIndex, 0, moved);
      return { ...current, gallery_images: items.map((item, order) => ({ ...item, sort_order: order })) };
    });
  }

  function generateTagline() {
    const suggestion = `${payload.name || "Your restaurant"} brings ${payload.restaurant_type.toLowerCase()} energy to ${payload.area || "your neighborhood"}.`;
    updateField("tagline", suggestion);
  }

  function generateDescription() {
    const profile = RESTAURANT_TYPE_PROFILES[payload.restaurant_type] || RESTAURANT_TYPE_PROFILES["Fast Casual"];
    updateField(
      "description",
      payload.description || `${profile.description} The page is designed to convert with a strong hero, quick CTA, and easy contact flow.`
    );
  }

  function generatePalette() {
    const profile = RESTAURANT_TYPE_PROFILES[payload.restaurant_type] || RESTAURANT_TYPE_PROFILES["Fast Casual"];
    updateField("primary_color", profile.primary_color);
    updateField("accent_color", profile.accent_color);
  }

  function generateHeroPrompt() {
    setHeroPrompt(
      `Hero image prompt: cinematic ${payload.restaurant_type.toLowerCase()} atmosphere, premium plating, soft contrast, warm details, mobile-first premium restaurant landing page.`
    );
  }

  async function saveDemo(status: DemoPayload["status"]) {
    setSaving(true);
    setError("");
    setSuccess("");

    const body: DemoPayload = {
      ...payload,
      status,
      slug: payload.slug || suggestedSlug,
      menu_items: payload.menu_items.map((item, index) => ({
        ...item,
        sort_order: index
      })),
      gallery_images: payload.gallery_images.map((image, index) => ({
        ...image,
        sort_order: index
      }))
    };

    const response = await fetch(mode === "edit" ? `/api/demos/${demo?.id}` : "/api/demos", {
      method: mode === "edit" ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const result = (await response.json()) as {
      error?: string;
      demo?: { id: string; slug: string };
    };

    setSaving(false);
    if (!response.ok || !result.demo) {
      setError(result.error || "Could not save demo");
      return;
    }

    setSuccess(status === "published" ? "Demo published." : "Draft saved.");
    if (mode === "create" && result.demo) {
      router.push(`/admin/demos/${result.demo.id}/edit`);
    } else {
      router.refresh();
    }
  }

  function copyPreviewLink() {
    const previewUrl = `${previewOrigin}/demo/${previewSlug}?preview=1`;
    void navigator.clipboard.writeText(previewUrl).then(() => setSuccess("Preview link copied."));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
      <div className="space-y-6">
        <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-ink/50">
                Demo generator
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl">
                Build restaurant demos faster.
              </h1>
              <p className="mt-3 text-sm leading-6 text-ink/70">
                A workspace designed for speed, clarity, and premium launch quality. Focus on key decisions, not raw form fields.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button type="button" variant="secondary" onClick={() => generateTagline()}>
                <Star size={16} />
                Suggest tagline
              </Button>
              <Button type="button" variant="secondary" onClick={() => generateDescription()}>
                <Sparkles size={16} />
                Suggest description
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-ink">Basics</h2>
              <p className="mt-1 text-sm text-ink/60">
                Restaurant profile, brand direction, and page tone.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold text-ink/70">
                {payload.restaurant_type}
              </span>
              <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold text-ink/70">
                {payload.cta_type}
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            <Field label="Restaurant type" hint="Choose a business persona and let the workspace suggest the right tone.">
              <select
                className={inputClass}
                value={payload.restaurant_type}
                onChange={(event) => applyRestaurantType(event.target.value)}
              >
                {Object.keys(RESTAURANT_TYPE_PROFILES).map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </Field>
            <Field label="Primary CTA" hint="The main action your visitors should take.">
              <select
                className={inputClass}
                value={payload.cta_type}
                onChange={(event) => setCtaType(event.target.value)}
              >
                {CTA_TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            <Field label="CTA label" hint="Suggested labels update based on the CTA type.">
              <input
                className={inputClass}
                value={payload.cta_label}
                placeholder={getCtaLabel(payload.cta_type)}
                onChange={(event) => updateField("cta_label", event.target.value)}
              />
            </Field>
            <Field label="CTA URL" hint="Leave blank for an automatic link based on the CTA type.">
              <input
                className={inputClass}
                value={payload.cta_url}
                onChange={(event) => updateField("cta_url", event.target.value)}
                placeholder={previewCtaUrl}
              />
            </Field>
          </div>
        </section>

        <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-ink">Branding & automation</h2>
              <p className="mt-1 text-sm text-ink/60">
                Control color, tone, and AI helpers for faster iteration.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <Button type="button" variant="secondary" onClick={() => generatePalette()}>
                <FileSpark size={16} />
                Palette
              </Button>
              <Button type="button" variant="secondary" onClick={() => generateHeroPrompt()}>
                <Link2 size={16} />
                Prompt
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            <ColorField
              label="Primary color"
              value={payload.primary_color || "#171412"}
              onChange={(value) => updateField("primary_color", value)}
            />
            <ColorField
              label="Accent color"
              value={payload.accent_color || "#ea580c"}
              onChange={(value) => updateField("accent_color", value)}
            />
          </div>

          <div className="mt-6 grid gap-4">
            <Field label="Hero prompt" hint="Use this copy to generate a stronger hero image.">
              <textarea
                className={textareaClass}
                value={heroPrompt}
                onChange={(event) => setHeroPrompt(event.target.value)}
                placeholder="Generate a premium hero image prompt for your restaurant landing page."
              />
            </Field>
          </div>
        </section>

        <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-ink">Gallery</h2>
              <p className="mt-1 text-sm text-ink/60">
                Upload visuals, preview thumbnails, and keep images organized.
              </p>
            </div>
            <Button type="button" variant="secondary" onClick={() => setHeroPrompt("")}>Clear prompt</Button>
          </div>

          <div className="mt-6 grid gap-4">
            {payload.gallery_images.map((image, index) => (
              <div key={index} className="rounded-3xl border border-ink/10 bg-paper p-4 shadow-sm">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-black text-ink">Image {index + 1}</h3>
                    <p className="text-xs text-ink/60">Reorder gallery images for the best flow.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="ghost" onClick={() => moveGalleryImage(index, index - 1)} disabled={index === 0}>
                      <ChevronUp size={16} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => moveGalleryImage(index, index + 1)}
                      disabled={index === payload.gallery_images.length - 1}
                    >
                      <ChevronDown size={16} />
                    </Button>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Image URL">
                    <div className="grid gap-2">
                      <input
                        className={inputClass}
                        value={image.image_url}
                        onChange={(event) => updateGallery(index, { image_url: event.target.value })}
                      />
                      <ImageUpload
                        folder={`${payload.slug || suggestedSlug || "restaurant"}/gallery`}
                        onUploaded={(url) => updateGallery(index, { image_url: url })}
                      />
                    </div>
                  </Field>
                  <Field label="Alt text">
                    <input
                      className={inputClass}
                      value={image.alt_text}
                      onChange={(event) => updateGallery(index, { alt_text: event.target.value })}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside className="space-y-6">
        <section className="sticky top-6 rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink/50">Live preview</p>
              <h2 className="mt-2 text-xl font-black text-ink">Quick workspace preview</h2>
            </div>

            <div className="grid gap-3 rounded-3xl border border-ink/10 bg-ink/5 p-4">
              <div className="flex items-center gap-2">
                <Button type="button" variant={previewMode === "desktop" ? "primary" : "secondary"} onClick={() => setPreviewMode("desktop")}>Desktop</Button>
                <Button type="button" variant={previewMode === "mobile" ? "primary" : "secondary"} onClick={() => setPreviewMode("mobile")}>Mobile</Button>
              </div>
              <div className="rounded-3xl border border-ink/10 bg-white p-4">
                <div className="mb-4 rounded-3xl bg-ink px-4 py-3 text-sm font-black text-white" style={{ backgroundColor: payload.primary_color }}>
                  {previewMode === "desktop" ? "Desktop preview" : "Mobile preview"}
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-ink/50">Hero</p>
                    <h3 className="mt-2 text-lg font-black text-ink">{payload.name || "Restaurant name"}</h3>
                    <p className="mt-2 text-sm text-ink/60">{payload.tagline || "Premium restaurant launch copy in a clean, high-contrast layout."}</p>
                  </div>
                  <a
                    href={previewCtaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-black text-white"
                    style={{ backgroundColor: payload.accent_color }}
                  >
                    <MessageCircle size={16} />
                    {previewCtaLabel}
                  </a>
                </div>
              </div>
            </div>

            <div className="grid gap-3 rounded-3xl border border-ink/10 bg-paper p-4 text-sm text-ink/70">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-ink">Preview link</span>
                <span className="rounded-full bg-ink/5 px-2 py-1 text-xs text-ink/80">{payload.status}</span>
              </div>
              <p className="break-words text-sm text-ink/70">{`${previewOrigin}/demo/${previewSlug}`}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <Button type="button" variant="secondary" onClick={copyPreviewLink}>
                  <Copy size={16} />
                  Copy link
                </Button>
                <a
                  href={`/demo/${previewSlug}?preview=1`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-black"
                >
                  <Eye size={16} />
                  Open preview
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink/50">Publish</p>
              <h2 className="mt-2 text-xl font-black text-ink">Ready to launch</h2>
            </div>
            <div className="grid gap-3">
              <div className="rounded-3xl border border-ink/10 bg-paper p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-ink/50">Page slug</p>
                <p className="mt-1 text-sm font-semibold text-ink">{previewSlug}</p>
              </div>
              <div className="rounded-3xl border border-ink/10 bg-paper p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-ink/50">Quick actions</p>
                <div className="mt-3 grid gap-2">
                  <Button type="button" variant="secondary" onClick={() => generateTagline()}>
                    <Star size={16} />
                    Regenerate tagline
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => generatePalette()}>
                    <Sparkles size={16} />
                    Refresh palette
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </aside>

      <div className="sticky bottom-0 z-20 -mx-4 border-t border-ink/10 bg-white/95 px-4 py-4 shadow-[0_-12px_30px_rgba(23,20,18,0.08)] backdrop-blur sm:rounded-none lg:rounded-b-3xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-ink/60">Preview path</p>
            <p className="text-sm font-black text-ink">/demo/{previewSlug}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-4">
            <Button type="button" variant="secondary" onClick={() => saveDemo("draft")} disabled={saving}>
              <Save size={16} />
              Save draft
            </Button>
            <Button type="button" variant="secondary" onClick={copyPreviewLink}>
              <Copy size={16} />
              Copy link
            </Button>
            <a
              href={`/demo/${previewSlug}?preview=1`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-black"
            >
              <Eye size={16} />
              Open preview
            </a>
            <Button type="button" onClick={() => saveDemo("published")} disabled={saving}>
              <Save size={16} />
              Publish demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="grid grid-cols-[3.5rem_1fr] gap-2">
        <input
          className="h-11 w-14 rounded-md border border-ink/15 bg-white p-1"
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <input
          className={inputClass}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </Field>
  );
}
