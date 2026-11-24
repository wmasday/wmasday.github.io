import type { Metadata } from "next";
import { TaxonomyIndex } from "@/components/taxonomy";

export const metadata: Metadata = { title: "Categories", alternates: { canonical: "/categories/" } };

export default function Page() {
  return <TaxonomyIndex type="categories" />;
}
