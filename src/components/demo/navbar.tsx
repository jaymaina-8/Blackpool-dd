import { Menu, MessageCircle } from "lucide-react";
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
          <details className="group relative md:hidden">
            <summary
              className="inline-flex size-10 cursor-pointer list-none items-center justify-center rounded-xl bg-[#fde7e7] text-[#ef3f3f] shadow-sm transition hover:bg-[#fbdada]"
              aria-label="Open navigation"
            >
              <Menu size={18} aria-hidden="true" />
            </summary>
            <div className="absolute right-0 top-12 grid w-52 gap-1 rounded-lg border border-ink/10 bg-white p-2 text-ink shadow-lift">
              <MobileNavLink href="#menu">Menu</MobileNavLink>
              <MobileNavLink href="#gallery">Gallery</MobileNavLink>
              <MobileNavLink href="#contact">Contact</MobileNavLink>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-black text-white"
                style={{ backgroundColor: demo.accent_color }}
              >
                <MessageCircle size={16} aria-hidden="true" />
                Order on WhatsApp
              </a>
              <div className="mt-1 border-t border-ink/10 px-3 py-2 text-xs font-semibold leading-5 text-ink/55">
                <p>{demo.area}</p>
                <p>{demo.phone}</p>
              </div>
            </div>
          </details>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden min-h-10 shrink-0 items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-black text-white shadow-soft sm:px-4 sm:text-sm md:inline-flex"
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

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="rounded-md px-3 py-2 text-sm font-black text-ink hover:bg-ink/5"
    >
      {children}
    </a>
  );
}
