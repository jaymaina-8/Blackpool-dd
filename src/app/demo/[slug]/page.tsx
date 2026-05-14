import { requireUser, getPublishedDemoBySlug } from "@/lib/demo-data";
import { RestaurantDemoPage } from "@/components/demo/restaurant-demo-page";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    preview?: string;
  }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const demo = await getPublishedDemoBySlug(slug, false).catch(() => null);

  if (!demo) {
    return {
      title: "Restaurant demo"
    };
  }

  return {
    title: `${demo.name} | Restaurant Demo`,
    description:
      demo.tagline ||
      `Preview a faster restaurant ordering experience for ${demo.name} in ${demo.area}.`
  };
}

export default async function PublicDemoPage({ params, searchParams }: PageProps) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const wantsPreview = resolvedSearchParams.preview === "1";
  const user = wantsPreview ? await requireUser() : null;
  const demo = await getPublishedDemoBySlug(slug, Boolean(user));

  return <RestaurantDemoPage demo={demo} preview={wantsPreview && Boolean(user)} />;
}
