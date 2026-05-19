import Link from "next/link";
import { ExternalLink, Pencil, PlusCircle } from "lucide-react";
import { getDemos } from "@/lib/demo-data";

export default async function DemosPage() {
  const demos = await getDemos();

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 rounded-3xl border border-ink/10 bg-paper p-6 shadow-soft sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-ink sm:text-4xl">
            Restaurant demos
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">
            Premium demo previews with status badges, restaurant type tags, and fast launch actions.
          </p>
        </div>
        <Link
          href="/admin/demos/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-black"
        >
          <PlusCircle size={16} />
          Create demo
        </Link>
      </div>

      {demos.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-ink/20 bg-paper p-10 text-center shadow-soft">
          <h3 className="text-xl font-bold text-ink">No demos yet</h3>
          <p className="mt-3 text-sm text-ink/60">
            Start a premium restaurant launch experience and build faster with guided sections.
          </p>
        </section>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[1fr]">
          <div className="grid gap-4 rounded-3xl border border-ink/10 bg-white p-5 shadow-soft sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="grid gap-2">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ink/50">Premium dashboard</p>
              <p className="text-sm text-ink/65">
                Browse restaurant demos by status, type, and content readiness.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold text-ink/70">
                {demos.length} demos
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900">
                Newest first
              </span>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {demos.map((demo) => (
              <article
                key={demo.id}
                className="overflow-hidden rounded-3xl border border-ink/10 bg-paper p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink/50">
                      {demo.restaurant_type || "Fast Casual"}
                    </p>
                    <h3 className="mt-3 text-lg font-black text-ink">{demo.name}</h3>
                    <p className="mt-2 text-sm text-ink/60">
                      {demo.area} · /demo/{demo.slug}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      demo.status === "published"
                        ? "bg-emerald-100 text-emerald-900"
                        : "bg-ink/5 text-ink/70"
                    }`}
                  >
                    {demo.status}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold text-ink/70">
                    {demo.cta_type || "WhatsApp Order"}
                  </span>
                  <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold text-ink/70">
                    {demo.restaurant_type ? demo.restaurant_type.split(" ")[0] : "Fast"}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-ink/65">
                  Updated {new Date(demo.updated_at).toLocaleString()}
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Link
                    href={`/demo/${demo.slug}?preview=1`}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-ink/15 bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5"
                  >
                    <ExternalLink size={16} />
                    Preview
                  </Link>
                  <Link
                    href={`/admin/demos/${demo.id}/edit`}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-black"
                  >
                    <Pencil size={16} />
                    Edit
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
