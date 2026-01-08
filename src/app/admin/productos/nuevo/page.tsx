import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "../product-form";

export default async function NewProductPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  return <ProductForm categories={categories || []} />;
}
