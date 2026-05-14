import { LoginForm } from "@/components/admin/login-form";
import { SupabaseSetup } from "@/components/admin/supabase-setup";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function LoginPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="min-h-screen bg-cream px-4 py-10">
        <SupabaseSetup />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4 py-8 sm:py-10">
      <section className="w-full max-w-md rounded-lg border border-ink/10 bg-white p-5 shadow-lift sm:p-7">
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-palm">
            Blackpool Industry
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">
            Admin login
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink/65">
            Sign in to create, preview, and publish restaurant demo pages.
          </p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
