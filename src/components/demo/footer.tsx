import { Instagram, MapPin, MessageCircle, Phone } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import type { DemoWithRelations } from "@/lib/types";

export function DemoFooter({ demo }: { demo: DemoWithRelations }) {
  const whatsappUrl = getWhatsAppUrl(demo.whatsapp_number, demo.name);
  const tagline =
    demo.tagline ||
    `Fast WhatsApp ordering for fresh meals in ${demo.area}.`;

  return (
    <footer className="border-t border-white/10 bg-ink/95 px-4 py-12 text-white shadow-soft">
      <div className="mx-auto grid max-w-6xl gap-8 text-sm md:grid-cols-[1fr_auto_1fr] md:items-start">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
            {demo.area}
          </p>
          <h2 className="mt-3 truncate text-3xl font-black tracking-tight text-white">
            {demo.name}
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-slate-200/95">{tagline}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
            <span>Powered by</span>
            <a
              href="https://www.blackpoolindustry.com"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-300 underline decoration-emerald-300/40 underline-offset-4 transition hover:text-emerald-200"
            >
              Blackpool Industry
            </a>
          </div>
        </div>

        <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft sm:grid-cols-2 md:grid-cols-1">
          <a
            href={`tel:${demo.phone}`}
            className="inline-flex min-h-12 items-center gap-3 rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <Phone size={18} aria-hidden="true" />
            {demo.phone}
          </a>
          <div className="inline-flex min-h-12 items-center gap-3 rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold text-white">
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
          <p className="basis-full pt-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-300 md:text-right">
            Built for mobile ordering
          </p>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-center text-xs uppercase tracking-[0.18em] text-slate-400 sm:text-left">
        <span className="block text-slate-200 sm:inline">© {new Date().getFullYear()} {demo.name}</span>
        <span className="mx-2 hidden sm:inline text-slate-500">•</span>
        <span className="block text-slate-300 sm:inline">Mobile-first ordering for modern restaurants</span>
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
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm font-bold text-white transition hover:bg-white/10"
    >
      {children}
    </a>
  );
}
