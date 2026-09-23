import { notFound, redirect } from "next/navigation";
import { CATEGORIES } from "@/data/categories";

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;
  
  // Find category by ID or Shopify handle
  const category = CATEGORIES.find(
    (c: any) => c.id === categorySlug || c.shopifyHandle === categorySlug
  );

  if (!category) {
    notFound();
  }

  // Canonical redirect to the dedicated route
  redirect(category.href);
}
