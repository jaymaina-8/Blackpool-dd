import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import type { DemoWithRelations } from "@/lib/types";

export function DemoNavbar({ demo }: { demo: DemoWithRelations }) {
  const whatsappUrl = getWhatsAppUrl(demo.whatsapp_number, demo.name);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 text-white shadow-sm backdrop-blur-md">
      <nav
        className="mx-auto flex min-h-14 w-full max-w-6xl items-center justify-between gap-3 px-4"
        aria-label={`${demo.name} demo navigation`}
      >
        <a href="#" className="min-w-0 py-2" aria-label={`${demo.name} home`}>
          <span className="block truncate text-sm font-black tracking-tight sm:text-base">
            {demo.name}
          </span>
          <span className="hidden text-xs font-semibold text-white/58 sm:block">
            {demo.area}
          </span>
        </a>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden items-center gap-1 md:flex">
            <NavLink href="#menu">Menu</NavLink>
            <NavLink href="#gallery">Gallery</NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-black text-white shadow-soft sm:px-4 sm:text-sm"
            style={{ backgroundColor: demo.accent_color }}
          >
            <MessageCircle size={16} aria-hidden="true" />
            <span className="hidden min-[390px]:inline">Order on WhatsApp</span>
            <span className="min-[390px]:hidden">Order</span>
          </a>
        </div>
      </nav>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="rounded-md px-3 py-2 text-sm font-bold text-white/75 transition hover:bg-white/10 hover:text-white"
    >
      {children}
    </a>
  );
}
