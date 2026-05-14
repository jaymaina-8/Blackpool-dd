export function SupabaseSetup() {
  return (
    <section className="mx-auto max-w-2xl rounded-lg border border-amber-200 bg-white p-6 shadow-soft">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-flame">
        Setup required
      </p>
      <h1 className="mt-2 text-3xl font-bold text-ink">Connect Supabase</h1>
      <p className="mt-3 text-sm leading-6 text-ink/65">
        Add your Supabase project URL and anon key before using the admin dashboard,
        authentication, database writes, or image uploads.
      </p>
      <div className="mt-5 rounded-md bg-ink p-4 text-sm text-white">
        <pre className="overflow-x-auto">
          {`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_STORAGE_BUCKET=restaurant-demo-images`}
        </pre>
      </div>
      <p className="mt-4 text-sm leading-6 text-ink/60">
        Put those values in <code className="rounded bg-ink/5 px-1 py-0.5">.env.local</code>,
        run the SQL migration in Supabase, then restart the dev server.
      </p>
    </section>
  );
}
