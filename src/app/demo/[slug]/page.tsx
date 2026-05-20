import { canPreviewDemos, getDemoBySlug } from "@/lib/demo-data";
import { RestaurantDemoPage } from "@/components/demo/restaurant-demo-page";

type PageProps = {
  params: {
    slug: string;
  };
  searchParams: {
    preview?: string;
  };
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = params;
  const demo = await getDemoBySlug(slug).catch(() => null);

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
  const { slug } = params;
  const isPreview = searchParams.preview === "1";
  const includeDrafts = isPreview && (await canPreviewDemos());
  const demo = await getDemoBySlug(slug, { includeDrafts });

  return <RestaurantDemoPage demo={demo} />;
}
