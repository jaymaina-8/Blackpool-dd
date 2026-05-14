import { DemoForm } from "@/components/admin/demo-form";

export default function NewDemoPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-ink sm:text-4xl">
          Create demo
        </h2>
        <p className="mt-2 text-sm text-ink/60">
          Add restaurant details, upload visuals, then save a previewable link.
        </p>
      </div>
      <DemoForm mode="create" />
    </div>
  );
}
