import { Instagram, MapPin, MessageCircle, Phone } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import type { DemoWithRelations } from "@/lib/types";

export function DemoFooter({ demo }: { demo: DemoWithRelations }) {
  const whatsappUrl = getWhatsAppUrl(demo.whatsapp_number, demo.name);
  const tagline =
    demo.tagline ||
    `Fast WhatsApp ordering for fresh meals in ${demo.area}.`;

  return (
    <footer className="border-t border-ink/10 bg-slate-50/90 px-4 py-10 text-ink shadow-sm">
      <div className="mx-auto grid max-w-6xl gap-8 text-sm md:grid-cols-[1fr_auto_1fr] md:items-start">
        <div className="min-w-0">
          <h2 className="truncate text-2xl font-black tracking-tight text-slate-950">
            {demo.name}
          </h2>
          <p className="mt-3 max-w-lg leading-7 text-slate-700/95">{tagline}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <span>Powered by</span>
            <a
              href="https://www.blackpoolindustry.com"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-slate-300 underline-offset-4 transition hover:text-slate-900"
            >
              Blackpool Industry
            </a>
          </div>
        </div>

        <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-sm sm:grid-cols-2 md:grid-cols-1">
          <a
            href={`tel:${demo.phone}`}
            className="inline-flex min-h-11 items-center gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Phone size={18} aria-hidden="true" />
            {demo.phone}
          </a>
          <div className="inline-flex min-h-11 items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800">
            <MapPin size={18} aria-hidden="true" />
            {demo.area}
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3 justify-end">
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
          <p className="basis-full pt-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 md:text-right">
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
