import type { Metadata } from "next";
import { TaxonomyPage } from "@/components/taxonomy";
import { taxonomyEntries, taxonomyPath } from "@/lib/posts";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return taxonomyEntries("tags").map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = taxonomyEntries("tags").find((item) => item.slug === slug);
  return entry ? { title: entry.name, alternates: { canonical: taxonomyPath("tags", entry.name) } } : {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <TaxonomyPage type="tags" slug={slug} />;
}
