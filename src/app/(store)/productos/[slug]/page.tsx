import { ProductCard } from "@/components/store/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { storeConfig } from "@/config/store";
import { createClient } from "@/lib/supabase/server";
import { ChevronLeft, RotateCcw, Shield, Truck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "./add-to-cart-button";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(id, name, slug)
    `
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  return product;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

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
  const supabase = await createClient();

  // Fetch product
  const { data: product } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(id, name, slug)
    `
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!product) {
    notFound();
  }

  // Fetch related products from same category
  const { data: relatedProducts } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(id, name, slug)
    `
    )
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .eq("is_active", true)
    .limit(4);

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
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Sin imagen
              </div>
            )}
            {hasDiscount && (
              <Badge className="absolute left-4 top-4 bg-primary text-white shadow-pink">
                -{discountPercent}%
              </Badge>
            )}
          </div>

          {/* Thumbnail gallery */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image: string, index: number) => (
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
            <p className="text-muted-foreground">
              {product.description || "Sin descripción"}
            </p>
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
      {relatedProducts && relatedProducts.length > 0 && (
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
