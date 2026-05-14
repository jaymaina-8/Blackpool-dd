import { notFound } from "next/navigation";
import { DemoForm } from "@/components/admin/demo-form";
import { getDemoById } from "@/lib/demo-data";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditDemoPage({ params }: PageProps) {
  const { id } = await params;
  const demo = await getDemoById(id);
  if (!demo) notFound();

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-3xl font-bold text-ink">Edit demo</h2>
        <p className="mt-2 text-sm text-ink/60">
          Update content, menu items, images, and publish state.
        </p>
      </div>
      <DemoForm mode="edit" demo={demo} />
    </div>
  );
}
