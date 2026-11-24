import type { Metadata } from "next";
import { TaxonomyIndex } from "@/components/taxonomy";

export const metadata: Metadata = { title: "Tags", alternates: { canonical: "/tags/" } };

export default function Page() {
  return <TaxonomyIndex type="tags" />;
}
