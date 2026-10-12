import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getComponentBySlug,
  getAllSlugs,
  getRelatedComponents,
  CATEGORY_META,
  type ComponentCategory,
} from "@/lib/component-registry";
import { ComponentPage } from "./component-page";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const component = getComponentBySlug(slug);
  if (!component) return { title: "Not Found" };

  return {
    title: `${component.name} — Motion Primitives`,
    description: component.description,
    openGraph: {
      title: `${component.name} — Motion Primitives Component`,
      description: component.description,
      type: "article",
    },
  };
}

export default async function Page({ params }: Props) {
  const { category, slug } = await params;
  const component = getComponentBySlug(slug);
  if (!component) notFound();

  const related = getRelatedComponents(slug);
  const categoryMeta = CATEGORY_META[category as ComponentCategory];

  return (
    <ComponentPage
      component={component}
      related={related}
      categoryLabel={categoryMeta?.label || category}
    />
  );
}
