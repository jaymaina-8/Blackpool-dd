import Link from "next/link";
import { ArrowRight, Globe2, Pencil, Sparkles } from "lucide-react";
import { getDemos } from "@/lib/demo-data";

export default async function AdminPage() {
  const demos = await getDemos();
  const published = demos.filter((demo) => demo.status === "published").length;

  return (
    <div className="grid gap-8">
      <section className="grid gap-6 rounded-lg border border-ink/10 bg-white p-6 shadow-soft md:grid-cols-[1.4fr_0.6fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-flame">
            Internal sales engine
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-5xl">
            Generate restaurant demos in minutes.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink/65">
            Create fast, premium preview links for restaurants that rely on WhatsApp,
            Instagram, and manual ordering today.
          </p>
          <Link
            href="/admin/demos/new"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-flame px-4 py-2 text-sm font-bold text-white hover:bg-orange-700"
          >
            Create Demo <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
          <Metric label="Total demos" value={demos.length} />
          <Metric label="Published" value={published} />
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <Feature icon={<Pencil size={20} />} title="Reusable form" text="Capture the restaurant, menu, gallery, and CTA in one pass." />
        <Feature icon={<Globe2 size={20} />} title="Instant links" text="Every saved demo gets a stable preview URL from its slug." />
        <Feature icon={<Sparkles size={20} />} title="Conversion first" text="Public pages stay simple, visual, fast, and WhatsApp focused." />
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-ink/10 bg-cream p-4">
      <p className="text-sm text-ink/55">{label}</p>
      <p className="mt-1 text-3xl font-bold text-ink">{value}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  text
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-lg border border-ink/10 bg-white p-5">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-palm/10 text-palm">
        {icon}
      </div>
      <h3 className="font-bold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-ink/60">{text}</p>
    </article>
  );
}
