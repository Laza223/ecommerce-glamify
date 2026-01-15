import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/server";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Productos",
  description: "Explorá nuestra colección completa de maquillaje profesional",
};

interface ProductsPageProps {
  searchParams: Promise<{
    categoria?: string;
    buscar?: string;
    ordenar?: string;
    ofertas?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const { categoria, buscar, ordenar, ofertas } = params;

  const supabase = await createClient();

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  // Build products query
  let query = supabase
    .from("products")
    .select(
      `
      *,
      category:categories(id, name, slug)
    `
    )
    .eq("is_active", true);

  // Filter by category
  if (categoria) {
    const selectedCat = categories?.find((c) => c.slug === categoria);
    if (selectedCat) {
      query = query.eq("category_id", selectedCat.id);
    }
  }

  // Filter by search term
  if (buscar) {
    query = query.or(`name.ilike.%${buscar}%,description.ilike.%${buscar}%`);
  }

  // Filter by offers (products with compare_at_price)
  if (ofertas === "true") {
    query = query.not("compare_at_price", "is", null);
  }

  // Sort
  switch (ordenar) {
    case "precio-asc":
      query = query.order("price", { ascending: true });
      break;
    case "precio-desc":
      query = query.order("price", { ascending: false });
      break;
    case "nombre-asc":
      query = query.order("name", { ascending: true });
      break;
    case "nombre-desc":
      query = query.order("name", { ascending: false });
      break;
    case "nuevo":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data: products } = await query;

  const selectedCategory = categories?.find((c) => c.slug === categoria);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {selectedCategory ? selectedCategory.name : "Todos los Productos"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {products?.length || 0} productos encontrados
        </p>
      </div>

      {/* Filters Bar */}
      <div className="mb-8 flex flex-col gap-3 rounded-xl border border-primary/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:gap-4">
        {/* Search */}
        <form className="relative flex-1" action="/productos">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="buscar"
            placeholder="Buscar productos..."
            defaultValue={buscar}
            className="pl-10"
          />
          {categoria && (
            <input type="hidden" name="categoria" value={categoria} />
          )}
          {ordenar && <input type="hidden" name="ordenar" value={ordenar} />}
        </form>

        {/* Category Filter */}
        <Select defaultValue={categoria || "all"}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <a href="/productos" className="block w-full">
                Todas las categorías
              </a>
            </SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                <a
                  href={`/productos?categoria=${cat.slug}`}
                  className="block w-full"
                >
                  {cat.name}
                </a>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select defaultValue={ordenar || "relevante"}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevante">
              <a
                href={`/productos${categoria ? `?categoria=${categoria}` : ""}`}
                className="block w-full"
              >
                Más relevantes
              </a>
            </SelectItem>
            <SelectItem value="nuevo">
              <a
                href={`/productos?ordenar=nuevo${
                  categoria ? `&categoria=${categoria}` : ""
                }`}
                className="block w-full"
              >
                Más nuevos
              </a>
            </SelectItem>
            <SelectItem value="precio-asc">
              <a
                href={`/productos?ordenar=precio-asc${
                  categoria ? `&categoria=${categoria}` : ""
                }`}
                className="block w-full"
              >
                Menor precio
              </a>
            </SelectItem>
            <SelectItem value="precio-desc">
              <a
                href={`/productos?ordenar=precio-desc${
                  categoria ? `&categoria=${categoria}` : ""
                }`}
                className="block w-full"
              >
                Mayor precio
              </a>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Offers toggle */}
        {ofertas === "true" ? (
          <Button variant="secondary" size="sm" asChild>
            <a href={`/productos${categoria ? `?categoria=${categoria}` : ""}`}>
              <X className="mr-1 h-4 w-4" />
              Ofertas
            </a>
          </Button>
        ) : (
          <Button variant="outline" size="sm" asChild>
            <a
              href={`/productos?ofertas=true${
                categoria ? `&categoria=${categoria}` : ""
              }`}
            >
              Solo ofertas
            </a>
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {(categoria || buscar || ofertas) && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Filtros activos:
          </span>
          {categoria && (
            <Button variant="secondary" size="sm" asChild>
              <a href={`/productos${buscar ? `?buscar=${buscar}` : ""}`}>
                {selectedCategory?.name}
                <X className="ml-1 h-3 w-3" />
              </a>
            </Button>
          )}
          {buscar && (
            <Button variant="secondary" size="sm" asChild>
              <a
                href={`/productos${categoria ? `?categoria=${categoria}` : ""}`}
              >
                &ldquo;{buscar}&rdquo;
                <X className="ml-1 h-3 w-3" />
              </a>
            </Button>
          )}
          <Button variant="ghost" size="sm" asChild>
            <a href="/productos">Limpiar todo</a>
          </Button>
        </div>
      )}

      {/* Products Grid */}
      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <SlidersHorizontal className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">No encontramos productos</h2>
          <p className="mt-2 text-muted-foreground">
            Probá con otros filtros o agregá productos desde el panel admin
          </p>
          <Button className="mt-4" asChild>
            <a href="/productos">Ver todos los productos</a>
          </Button>
        </div>
      )}
    </div>
  );
}
