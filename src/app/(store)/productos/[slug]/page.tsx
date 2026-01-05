import { ProductCard } from "@/components/store/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { storeConfig } from "@/config/store";
import type { Category, Product } from "@/types";
import { ChevronLeft, RotateCcw, Shield, Truck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "./add-to-cart-button";

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
];

const mockProducts: Product[] = [
  {
    id: "1",
    category_id: "1",
    name: "Labial Matte Velvet Rose",
    slug: "labial-matte-velvet-rose",
    description:
      "Labial de larga duración con acabado matte aterciopelado. Su fórmula enriquecida con vitamina E hidrata tus labios mientras ofrece un color intenso que dura hasta 12 horas. Perfecto para cualquier ocasión.",
    price: 4500,
    compare_at_price: 5500,
    cost_per_item: null,
    sku: "LAB-001",
    barcode: null,
    stock: 15,
    low_stock_threshold: 5,
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800",
      "https://images.unsplash.com/photo-1631214540553-ff044a3ff1ea?w=800",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800",
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
    description:
      "Cobertura total que dura todo el día. Fórmula ligera que no obstruye los poros.",
    price: 8900,
    compare_at_price: null,
    cost_per_item: null,
    sku: "BAS-001",
    barcode: null,
    stock: 20,
    low_stock_threshold: 5,
    images: [
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800",
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
    description:
      "12 tonos vibrantes para looks de día y noche. Altamente pigmentada y fácil de difuminar.",
    price: 12500,
    compare_at_price: 15000,
    cost_per_item: null,
    sku: "PAL-001",
    barcode: null,
    stock: 8,
    low_stock_threshold: 5,
    images: [
      "https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=800",
    ],
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[2],
  },
];

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = mockProducts.find((p) => p.slug === slug);

  if (!product) {
    return { title: "Producto no encontrado" };
  }

  return {
    title: product.name,
    description:
      product.description ||
      `${product.name} - Comprá online en Glamify Makeup`,
    openGraph: {
      title: product.name,
      description: product.description || "",
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = mockProducts.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(storeConfig.locale, {
      style: "currency",
      currency: storeConfig.currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const hasDiscount =
    product.compare_at_price && product.compare_at_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compare_at_price! - product.price) /
          product.compare_at_price!) *
          100
      )
    : 0;

  const relatedProducts = mockProducts
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Inicio
        </Link>
        <span>/</span>
        <Link href="/productos" className="hover:text-primary">
          Productos
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              href={`/productos?categoria=${product.category.slug}`}
              className="hover:text-primary"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      {/* Back button (mobile) */}
      <Button variant="ghost" size="sm" className="mb-4 lg:hidden" asChild>
        <Link href="/productos">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Volver
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
            <Image
              src={product.images[0] || ""}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {hasDiscount && (
              <Badge className="absolute left-4 top-4 bg-primary text-white shadow-pink">
                -{discountPercent}%
              </Badge>
            )}
          </div>

          {/* Thumbnail gallery */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-lg border-2 border-transparent bg-muted transition-colors hover:border-primary focus:border-primary"
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category */}
          {product.category && (
            <Link
              href={`/productos?categoria=${product.category.slug}`}
              className="inline-block text-sm text-primary hover:underline"
            >
              {product.category.name}
            </Link>
          )}

          {/* Title */}
          <h1 className="text-3xl font-bold lg:text-4xl">{product.name}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xl text-muted-foreground line-through">
                {formatPrice(product.compare_at_price!)}
              </span>
            )}
          </div>

          {/* Stock status */}
          {product.stock > 0 ? (
            product.stock <= product.low_stock_threshold ? (
              <Badge
                variant="outline"
                className="text-orange-600 border-orange-600"
              >
                ¡Solo quedan {product.stock} unidades!
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-green-600 border-green-600"
              >
                En stock
              </Badge>
            )
          ) : (
            <Badge variant="destructive">Agotado</Badge>
          )}

          <Separator />

          {/* Description */}
          <div>
            <h2 className="mb-2 font-semibold">Descripción</h2>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <Separator />

          {/* Add to Cart */}
          <AddToCartButton product={product} />

          <Separator />

          {/* Features */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Envío gratis</p>
                <p className="text-xs text-muted-foreground">
                  +${storeConfig.freeShippingThreshold.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Pago seguro</p>
                <p className="text-xs text-muted-foreground">100% protegido</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <RotateCcw className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Devoluciones</p>
                <p className="text-xs text-muted-foreground">30 días</p>
              </div>
            </div>
          </div>

          {/* SKU */}
          {product.sku && (
            <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-8 text-2xl font-bold">Productos Relacionados</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
