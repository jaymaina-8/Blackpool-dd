import { Instagram, MapPin, MessageCircle, Phone } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import type { DemoWithRelations } from "@/lib/types";

export function DemoFooter({ demo }: { demo: DemoWithRelations }) {
  const whatsappUrl = getWhatsAppUrl(demo.whatsapp_number, demo.name);
  const tagline =
    demo.tagline ||
    `Fast WhatsApp ordering for fresh meals in ${demo.area}.`;

  return (
    <footer className="border-t border-ink/10 bg-white px-4 py-8 text-ink">
      <div className="mx-auto grid max-w-6xl gap-6 text-sm md:grid-cols-[1fr_auto_1fr] md:items-center">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-black tracking-tight">{demo.name}</h2>
          <p className="mt-1 max-w-md leading-6 text-ink/58">{tagline}</p>
        </div>

        <div className="grid gap-2 text-ink/70 sm:grid-cols-2 md:grid-cols-1">
          <a
            href={`tel:${demo.phone}`}
            className="inline-flex min-h-9 items-center gap-2 font-bold hover:text-ink"
          >
            <Phone size={16} aria-hidden="true" />
            {demo.phone}
          </a>
          <p className="inline-flex min-h-9 items-center gap-2 font-bold">
            <MapPin size={16} aria-hidden="true" />
            {demo.area}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 md:justify-end">
          {demo.instagram_url ? (
            <FooterLink href={demo.instagram_url}>
              <Instagram size={16} aria-hidden="true" />
              Instagram
            </FooterLink>
          ) : null}
          <FooterLink href={whatsappUrl}>
            <MessageCircle size={16} aria-hidden="true" />
            WhatsApp
          </FooterLink>
          <p className="basis-full pt-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink/38 md:text-right">
            Built for mobile ordering
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-ink/10 px-3 py-2 text-sm font-bold text-ink hover:bg-ink/5"
    >
      {children}
    </a>
  );
}
