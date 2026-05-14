"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Plus, Save, Trash2 } from "lucide-react";
import { Button, Field, inputClass, textareaClass } from "@/components/ui";
import { ImageUpload } from "@/components/admin/image-upload";
import { buildBaseSlug } from "@/lib/slug";
import type { DemoPayload, DemoWithRelations } from "@/lib/types";

type MenuDraft = DemoPayload["menu_items"][number];
type GalleryDraft = DemoPayload["gallery_images"][number];

const emptyMenuItem = (sortOrder = 0): MenuDraft => ({
  name: "",
  description: "",
  price: "",
  image_url: "",
  sort_order: sortOrder
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
    status: demo?.status || "draft",
    menu_items: demo?.restaurant_menu_items?.length
      ? demo.restaurant_menu_items.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description || "",
          price: item.price || "",
          image_url: item.image_url || "",
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const suggestedSlug = useMemo(
    () => buildBaseSlug(payload.name, payload.area),
    [payload.name, payload.area]
  );

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

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const body: DemoPayload = {
      ...payload,
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

    setSuccess("Demo saved.");
    router.refresh();
    if (mode === "create") router.push(`/admin/demos/${result.demo.id}/edit`);
  }

  return (
    <form className="grid gap-5 sm:gap-6" onSubmit={submit}>
      <Panel title="Restaurant details">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Restaurant name">
            <input
              className={inputClass}
              value={payload.name}
              onChange={(event) => updateField("name", event.target.value)}
              required
            />
          </Field>
          <Field label="Area / city">
            <input
              className={inputClass}
              value={payload.area}
              onChange={(event) => updateField("area", event.target.value)}
              required
            />
          </Field>
          <Field label="Slug" hint={`Suggested: ${suggestedSlug || "restaurant-area"}`}>
            <input
              className={inputClass}
              value={payload.slug}
              placeholder={suggestedSlug}
              onChange={(event) => updateField("slug", event.target.value)}
            />
          </Field>
          <Field label="Publish state">
            <select
              className={inputClass}
              value={payload.status}
              onChange={(event) =>
                updateField("status", event.target.value as DemoPayload["status"])
              }
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>
          <Field label="Tagline">
            <input
              className={inputClass}
              value={payload.tagline}
              onChange={(event) => updateField("tagline", event.target.value)}
              placeholder="Fresh grills, fast WhatsApp ordering."
            />
          </Field>
          <Field label="Hero image URL">
            <div className="grid gap-2">
              <input
                className={inputClass}
                value={payload.hero_image_url}
                onChange={(event) => updateField("hero_image_url", event.target.value)}
              />
              <ImageUpload
                folder={payload.slug || suggestedSlug || "restaurant"}
                onUploaded={(url) => updateField("hero_image_url", url)}
              />
            </div>
          </Field>
        </div>
        <Field label="Short description">
          <textarea
            className={textareaClass}
            value={payload.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="A concise sales-focused description for the demo page."
          />
        </Field>
      </Panel>

      <Panel title="Contact and conversion">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Phone number">
            <input
              className={inputClass}
              value={payload.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              required
            />
          </Field>
          <Field label="WhatsApp number">
            <input
              className={inputClass}
              value={payload.whatsapp_number}
              onChange={(event) => updateField("whatsapp_number", event.target.value)}
              required
            />
          </Field>
          <Field label="Google Maps URL">
            <input
              className={inputClass}
              value={payload.google_maps_url}
              onChange={(event) => updateField("google_maps_url", event.target.value)}
            />
          </Field>
          <Field label="Instagram URL">
            <input
              className={inputClass}
              value={payload.instagram_url}
              onChange={(event) => updateField("instagram_url", event.target.value)}
            />
          </Field>
          <Field label="Facebook URL">
            <input
              className={inputClass}
              value={payload.facebook_url}
              onChange={(event) => updateField("facebook_url", event.target.value)}
            />
          </Field>
        </div>
      </Panel>

      <Panel title="Branding">
        <div className="grid gap-4 md:grid-cols-2">
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
      </Panel>

      <Panel
        title="Featured menu"
        action={
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              updateField("menu_items", [
                ...payload.menu_items,
                emptyMenuItem(payload.menu_items.length)
              ])
            }
          >
            <Plus size={16} />
            Add item
          </Button>
        }
      >
        <div className="grid gap-4">
          {payload.menu_items.map((item, index) => (
            <div key={index} className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h4 className="font-bold text-ink">Menu item {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    updateField(
                      "menu_items",
                      payload.menu_items.filter((_, itemIndex) => itemIndex !== index)
                    )
                  }
                >
                  <Trash2 size={16} />
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Name">
                  <input
                    className={inputClass}
                    value={item.name}
                    onChange={(event) => updateMenu(index, { name: event.target.value })}
                  />
                </Field>
                <Field label="Price">
                  <input
                    className={inputClass}
                    value={item.price}
                    onChange={(event) => updateMenu(index, { price: event.target.value })}
                    placeholder="KES 850"
                  />
                </Field>
                <Field label="Image URL">
                  <div className="grid gap-2">
                    <input
                      className={inputClass}
                      value={item.image_url}
                      onChange={(event) =>
                        updateMenu(index, { image_url: event.target.value })
                      }
                    />
                    <ImageUpload
                      folder={`${payload.slug || suggestedSlug || "restaurant"}/menu`}
                      onUploaded={(url) => updateMenu(index, { image_url: url })}
                    />
                  </div>
                </Field>
                <Field label="Description">
                  <textarea
                    className={textareaClass}
                    value={item.description}
                    onChange={(event) =>
                      updateMenu(index, { description: event.target.value })
                    }
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel
        title="Gallery"
        action={
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              updateField("gallery_images", [
                ...payload.gallery_images,
                emptyGalleryImage(payload.gallery_images.length)
              ])
            }
          >
            <Plus size={16} />
            Add image
          </Button>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          {payload.gallery_images.map((image, index) => (
            <div key={index} className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h4 className="font-bold text-ink">Gallery image {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    updateField(
                      "gallery_images",
                      payload.gallery_images.filter((_, imageIndex) => imageIndex !== index)
                    )
                  }
                >
                  <Trash2 size={16} />
                </Button>
              </div>
              <div className="grid gap-4">
                <Field label="Image URL">
                  <div className="grid gap-2">
                    <input
                      className={inputClass}
                      value={image.image_url}
                      onChange={(event) =>
                        updateGallery(index, { image_url: event.target.value })
                      }
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
                    onChange={(event) =>
                      updateGallery(index, { alt_text: event.target.value })
                    }
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      ) : null}

      <div className="sticky bottom-0 -mx-4 border-t border-ink/10 bg-paper/95 px-4 py-4 shadow-[0_-12px_30px_rgba(23,20,18,0.08)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="min-w-0 break-words text-sm text-ink/60">
            Preview path: /demo/{payload.slug || suggestedSlug || "restaurant-area"}
          </p>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {demo ? (
              <a
                href={`/demo/${payload.slug || demo.slug}?preview=1`}
                target="_blank"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-ink/15 bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5"
              >
                <Eye size={16} />
                Preview
              </a>
            ) : null}
            <Button className={demo ? "" : "sm:min-w-36"} disabled={saving}>
              <Save size={16} />
              {saving ? "Saving..." : "Save demo"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

function Panel({
  title,
  children,
  action
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-ink/10 bg-paper p-4 shadow-soft sm:p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-black tracking-tight text-ink sm:text-xl">{title}</h3>
        {action}
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
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
