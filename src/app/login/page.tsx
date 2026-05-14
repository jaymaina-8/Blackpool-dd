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
    <main className="flex min-h-screen items-center justify-center bg-cream px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-flame">
            Blackpool Industry
          </p>
          <h1 className="mt-2 text-3xl font-bold text-ink">Admin login</h1>
          <p className="mt-3 text-sm leading-6 text-ink/65">
            Sign in to create, preview, and publish restaurant demo pages.
          </p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
