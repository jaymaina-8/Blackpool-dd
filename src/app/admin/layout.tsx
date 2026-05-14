import Link from "next/link";
import { redirect } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { requireUser } from "@/lib/demo-data";
import { LogoutButton } from "@/components/admin/logout-button";
import { SupabaseSetup } from "@/components/admin/supabase-setup";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-cream px-4 py-10">
        <SupabaseSetup />
      </div>
    );
  }

  const user = await requireUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/admin" className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-palm">
              Blackpool Industry
            </p>
            <h1 className="truncate text-xl font-black tracking-tight text-ink">
              Restaurant Demo Generator
            </h1>
          </Link>
          <nav className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center">
            <Link
              href="/admin/demos"
              className="inline-flex min-h-10 items-center justify-center rounded-md px-3 py-2 text-sm font-semibold text-ink hover:bg-ink/5"
            >
              Demos
            </Link>
            <Link
              href="/admin/demos/new"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black"
            >
              <PlusCircle size={16} />
              <span className="hidden min-[420px]:inline">Create Demo</span>
              <span className="min-[420px]:hidden">Create</span>
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
