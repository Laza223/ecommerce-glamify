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
import type { Category, Product } from "@/types";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Productos",
  description: "Explorá nuestra colección completa de maquillaje profesional",
};

// Mock data - replace with Supabase queries
const mockCategories: Category[] = [
  {
    id: "1",
    name: "Labiales",
    slug: "labiales",
    description: "Los mejores labiales",
    image_url:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Bases",
    slug: "bases",
    description: "Bases y correctores",
    image_url:
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=400",
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Ojos",
    slug: "ojos",
    description: "Maquillaje para ojos",
    image_url:
      "https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=400",
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Brochas",
    slug: "brochas",
    description: "Sets de brochas",
    image_url:
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400",
    is_active: true,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockProducts: Product[] = [
  {
    id: "1",
    category_id: "1",
    name: "Labial Matte Velvet Rose",
    slug: "labial-matte-velvet-rose",
    description: "Labial de larga duración con acabado matte aterciopelado",
    price: 4500,
    compare_at_price: 5500,
    cost_per_item: null,
    sku: "LAB-001",
    barcode: null,
    stock: 15,
    low_stock_threshold: 5,
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
    ],
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[0],
  },
  {
    id: "2",
    category_id: "2",
    name: "Base Líquida Full Coverage",
    slug: "base-liquida-full-coverage",
    description: "Cobertura total que dura todo el día",
    price: 8900,
    compare_at_price: null,
    cost_per_item: null,
    sku: "BAS-001",
    barcode: null,
    stock: 20,
    low_stock_threshold: 5,
    images: [
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=400",
    ],
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[1],
  },
  {
    id: "3",
    category_id: "3",
    name: "Paleta de Sombras Sunset",
    slug: "paleta-sombras-sunset",
    description: "12 tonos vibrantes para looks de día y noche",
    price: 12500,
    compare_at_price: 15000,
    cost_per_item: null,
    sku: "PAL-001",
    barcode: null,
    stock: 8,
    low_stock_threshold: 5,
    images: [
      "https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=400",
    ],
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[2],
  },
  {
    id: "4",
    category_id: "4",
    name: "Set de Brochas Profesional",
    slug: "set-brochas-profesional",
    description: "12 brochas premium de pelo sintético suave",
    price: 18900,
    compare_at_price: null,
    cost_per_item: null,
    sku: "BRO-001",
    barcode: null,
    stock: 3,
    low_stock_threshold: 5,
    images: [
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400",
    ],
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[3],
  },
  {
    id: "5",
    category_id: "1",
    name: "Labial Glossy Paradise",
    slug: "labial-glossy-paradise",
    description: "Brillo de labios con efecto plump",
    price: 3200,
    compare_at_price: null,
    cost_per_item: null,
    sku: "LAB-002",
    barcode: null,
    stock: 25,
    low_stock_threshold: 5,
    images: [
      "https://images.unsplash.com/photo-1631214540553-ff044a3ff1ea?w=400",
    ],
    is_active: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[0],
  },
  {
    id: "6",
    category_id: "3",
    name: "Delineador Líquido Precision",
    slug: "delineador-liquido-precision",
    description: "Punta ultra fina para trazos perfectos",
    price: 2800,
    compare_at_price: 3500,
    cost_per_item: null,
    sku: "DEL-001",
    barcode: null,
    stock: 18,
    low_stock_threshold: 5,
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400",
    ],
    is_active: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[2],
  },
  {
    id: "7",
    category_id: "2",
    name: "Corrector de Ojeras HD",
    slug: "corrector-ojeras-hd",
    description: "Alta cobertura para un look descansado",
    price: 5600,
    compare_at_price: null,
    cost_per_item: null,
    sku: "COR-001",
    barcode: null,
    stock: 12,
    low_stock_threshold: 5,
    images: [
      "https://images.unsplash.com/photo-1631214524020-7e4e9b6c8a9d?w=400",
    ],
    is_active: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[1],
  },
  {
    id: "8",
    category_id: "3",
    name: "Máscara de Pestañas Volume",
    slug: "mascara-pestanas-volume",
    description: "Volumen extremo sin grumos",
    price: 4200,
    compare_at_price: 5000,
    cost_per_item: null,
    sku: "MAS-001",
    barcode: null,
    stock: 30,
    low_stock_threshold: 5,
    images: [
      "https://images.unsplash.com/photo-1631214540553-333333333333?w=400",
    ],
    is_active: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[2],
  },
];

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

  // Filter products (in production, this would be a Supabase query)
  let filteredProducts = [...mockProducts];

  if (categoria) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category?.slug === categoria
    );
  }

  if (buscar) {
    const searchLower = buscar.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
    );
  }

  if (ofertas === "true") {
    filteredProducts = filteredProducts.filter(
      (p) => p.compare_at_price && p.compare_at_price > p.price
    );
  }

  // Sort products
  if (ordenar) {
    switch (ordenar) {
      case "precio-asc":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "precio-desc":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case "nombre-asc":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nombre-desc":
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "nuevo":
        filteredProducts.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }
  }

  const selectedCategory = mockCategories.find((c) => c.slug === categoria);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {selectedCategory ? selectedCategory.name : "Todos los Productos"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {filteredProducts.length} productos encontrados
        </p>
      </div>

      {/* Filters Bar */}
      <div className="mb-8 flex flex-col gap-4 rounded-lg border bg-muted/30 p-4 sm:flex-row sm:items-center">
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
            {mockCategories.map((cat) => (
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
      {filteredProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <SlidersHorizontal className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">No encontramos productos</h2>
          <p className="mt-2 text-muted-foreground">
            Probá con otros filtros o buscá algo diferente
          </p>
          <Button className="mt-4" asChild>
            <a href="/productos">Ver todos los productos</a>
          </Button>
        </div>
      )}
    </div>
  );
}
