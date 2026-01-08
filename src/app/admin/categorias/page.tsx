import { createClient } from "@/lib/supabase/server";
import { CategoriesClient } from "./categories-client";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");

  return <CategoriesClient initialCategories={categories || []} />;
}
