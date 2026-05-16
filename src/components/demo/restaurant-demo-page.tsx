import { ArrowUpRight, Instagram, MapPin, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import { DemoFooter } from "@/components/demo/footer";
import { DemoNavbar } from "@/components/demo/navbar";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import type { DemoWithRelations } from "@/lib/types";

export function RestaurantDemoPage({
  demo
}: {
  demo: DemoWithRelations;
  preview?: boolean;
}) {
  const whatsappUrl = getWhatsAppUrl(demo.whatsapp_number, demo.name);
  const heroImage =
    demo.hero_image_url ||
    demo.restaurant_gallery_images[0]?.image_url ||
    demo.restaurant_menu_items.find((item) => item.image_url)?.image_url;

  return (
    <main className="min-h-screen bg-white text-ink">
      <DemoNavbar demo={demo} />
      <section className="relative grid min-h-[86svh] overflow-hidden bg-ink text-white">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={demo.name}
            fill
            priority
            unoptimized
            sizes="100vw"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/20" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-end px-4 pb-12 pt-24 sm:pb-16 sm:pt-28">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white/75 sm:text-sm">
            {demo.area}
          </p>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
            {demo.name}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/88 sm:text-xl">
            {demo.tagline ||
              `Order from ${demo.name} in ${demo.area} with a faster, easier WhatsApp experience.`}
          </p>
          <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
            <a
              href={whatsappUrl}
              target="_blank"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-black text-white shadow-soft"
              style={{ backgroundColor: demo.accent_color }}
            >
              <MessageCircle size={18} />
              Order on WhatsApp
            </a>
            {demo.google_maps_url ? (
              <a
                href={demo.google_maps_url}
                target="_blank"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur hover:bg-white/15"
              >
                <MapPin size={18} />
                Find us
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <section id="menu" className="scroll-mt-16 bg-cream py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-flame">
                Featured menu
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Customer favorites
              </h2>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-black"
            >
              Start order <ArrowUpRight size={16} />
            </a>
          </div>
          {demo.restaurant_menu_items.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {demo.restaurant_menu_items.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-lg border border-ink/10 bg-paper shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
                >
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      width={800}
                      height={600}
                      unoptimized
                      className="aspect-[4/3] w-full object-cover"
                    />
                  ) : (
                    <div
                      className="aspect-[4/3] w-full"
                      style={{ backgroundColor: `${demo.accent_color}22` }}
                    />
                  )}
                  <div className="p-4">
                    <div className="grid gap-2 sm:flex sm:items-start sm:justify-between sm:gap-3">
                      <h3 className="text-lg font-black text-ink">{item.name}</h3>
                      {item.price ? (
                        <p className="shrink-0 text-sm font-black text-palm">
                          {item.price}
                        </p>
                      ) : null}
                    </div>
                    {item.description ? (
                      <p className="mt-2 text-sm leading-6 text-ink/60">{item.description}</p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptySection text="Menu highlights will appear here once added." />
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-flame">
              Why choose us
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Easy ordering, fresh meals, less waiting.
            </h2>
            <p className="mt-4 text-base leading-7 text-ink/65">
              {demo.description ||
                `${demo.name} can turn social media interest into quick customer action with a simple ordering page and direct WhatsApp CTA.`}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Fast WhatsApp ordering", "Fresh customer favorites", "Simple location details", "Mobile-first experience"].map(
              (item) => (
                <div key={item} className="rounded-lg border border-ink/10 bg-paper p-5 shadow-sm">
                  <h3 className="font-black text-ink">{item}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/60">
                    Built to help customers decide quickly and contact the restaurant with less friction.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section id="gallery" className="scroll-mt-16 bg-ink py-12 text-white sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/55">
              Gallery
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              A better first impression
            </h2>
          </div>
          {demo.restaurant_gallery_images.length ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {demo.restaurant_gallery_images.map((image, index) => (
                <Image
                  key={image.id}
                  src={image.image_url}
                  alt={image.alt_text || `${demo.name} gallery ${index + 1}`}
                  width={600}
                  height={600}
                  unoptimized
                  className="aspect-square w-full rounded-lg object-cover shadow-lg"
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-white/15 bg-white/5 p-6 text-white/70">
              Gallery images will appear here once added.
            </div>
          )}
        </div>
      </section>

      <section id="contact" className="scroll-mt-16 bg-cream py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-flame">
              Contact
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              Ready to order from {demo.name}?
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ink/65">
              Tap WhatsApp to start your order, call directly, or find the restaurant in {demo.area}.
            </p>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <a
                href={whatsappUrl}
                target="_blank"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-black text-white"
                style={{ backgroundColor: demo.accent_color }}
              >
                <MessageCircle size={18} />
                WhatsApp order
              </a>
              <a
                href={`tel:${demo.phone}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-ink/15 bg-white px-5 py-3 text-sm font-bold text-ink"
              >
                <Phone size={18} />
                Call
              </a>
            </div>
          </div>
          <div className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
            <div className="grid gap-4">
              <ContactRow icon={<Phone size={18} />} label="Phone" value={demo.phone} />
              <ContactRow icon={<MessageCircle size={18} />} label="WhatsApp" value={demo.whatsapp_number} />
              <ContactRow icon={<MapPin size={18} />} label="Location" value={demo.area} />
              {demo.instagram_url ? (
                <a
                  href={demo.instagram_url}
                  target="_blank"
                  className="flex items-center justify-between rounded-md bg-ink/5 px-4 py-3 text-sm font-bold text-ink hover:bg-ink/10"
                >
                  <span className="inline-flex items-center gap-2">
                    <Instagram size={18} /> Instagram
                  </span>
                  <ArrowUpRight size={16} />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <DemoFooter demo={demo} />
    </main>
  );
}

function ContactRow({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-md bg-white px-4 py-3">
      <div className="text-flame">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/45">{label}</p>
        <p className="break-words text-sm font-bold text-ink">{value}</p>
      </div>
    </div>
  );
}

function EmptySection({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-ink/20 bg-white p-8 text-center text-sm text-ink/55">
      {text}
    </div>
  );
}
