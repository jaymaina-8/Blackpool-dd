import Link from "next/link";
import { ExternalLink, Pencil, PlusCircle } from "lucide-react";
import { getDemos } from "@/lib/demo-data";

export default async function DemosPage() {
  const demos = await getDemos();

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-ink sm:text-4xl">
            Restaurant demos
          </h2>
          <p className="mt-2 text-sm text-ink/60">
            Manage draft previews and published outreach links.
          </p>
        </div>
        <Link
          href="/admin/demos/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-black"
        >
          <PlusCircle size={16} />
          Create Demo
        </Link>
      </div>

      {demos.length === 0 ? (
        <section className="rounded-lg border border-dashed border-ink/20 bg-paper p-8 text-center">
          <h3 className="text-xl font-bold text-ink">No demos yet</h3>
          <p className="mt-2 text-sm text-ink/60">
            Create the first restaurant preview and it will appear here.
          </p>
        </section>
      ) : (
        <div className="overflow-hidden rounded-lg border border-ink/10 bg-paper shadow-soft">
          <div className="grid gap-0 divide-y divide-ink/10">
            {demos.map((demo) => (
              <article
                key={demo.id}
                className="grid gap-4 p-4 transition hover:bg-white md:grid-cols-[1fr_auto] md:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="min-w-0 truncate text-lg font-bold text-ink">{demo.name}</h3>
                    <span className="rounded-full bg-ink/5 px-2.5 py-1 text-xs font-semibold capitalize text-ink/70">
                      {demo.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink/60">
                    {demo.area} · /demo/{demo.slug}
                  </p>
                  <p className="mt-1 text-xs text-ink/45">
                    Updated {new Date(demo.updated_at).toLocaleString()}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                  <Link
                    href={`/demo/${demo.slug}?preview=1`}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-ink/15 bg-white px-3 py-2 text-sm font-semibold text-ink hover:bg-ink/5"
                  >
                    <ExternalLink size={16} />
                    Preview
                  </Link>
                  <Link
                    href={`/admin/demos/${demo.id}/edit`}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white hover:bg-black"
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
