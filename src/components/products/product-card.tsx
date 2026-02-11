// components/products/product-card.tsx
import { getBlurDataUrl, getOptimizedImageUrl } from "@/lib/cloudinary";
import { calculateDiscount, cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import { Eye, Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const hasDiscount =
    product.compare_at_price && product.compare_at_price > product.price;
  const discountPercent = hasDiscount
    ? calculateDiscount(product.price, product.compare_at_price!)
    : 0;

  const imageUrl = product.images?.[0];
  const optimizedUrl = imageUrl
    ? getOptimizedImageUrl(imageUrl, { width: 400 })
    : "";
  const blurUrl = imageUrl ? getBlurDataUrl(imageUrl) : "";

  const isOutOfStock = product.stock === 0;

  return (
    <article className="group relative">
      <Link
        href={`/productos/${product.slug}`}
        className="block"
        aria-label={`Ver ${product.name}`}
      >
        <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
          {optimizedUrl ? (
            <Image
              src={optimizedUrl}
              alt={product.name}
              fill
              className={cn(
                "object-cover transition-transform duration-300",
                "group-hover:scale-105",
                isOutOfStock && "opacity-50",
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              placeholder={blurUrl ? "blur" : "empty"}
              blurDataURL={blurUrl}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <ShoppingCart className="h-12 w-12" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && (
              <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
                -{discountPercent}%
              </span>
            )}
            {product.is_featured && (
              <span className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
                ⭐ Destacado
              </span>
            )}
            {isOutOfStock && (
              <span className="rounded-full bg-gray-800 px-2 py-1 text-xs font-bold text-white shadow-lg">
                Agotado
              </span>
            )}
            {product.stock > 0 && product.stock <= 3 && (
              <span className="rounded-full bg-yellow-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
                ¡Últimas {product.stock}!
              </span>
            )}
          </div>

          {/* Quick Actions (visible on hover) */}
          <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              className="rounded-full bg-white/90 p-2 backdrop-blur-sm transition-transform hover:scale-110 hover:bg-white"
              aria-label="Agregar a favoritos"
              onClick={(e) => {
                e.preventDefault();
                toast.success("Agregado a favoritos");
              }}
            >
              <Heart className="h-4 w-4" />
            </button>
            <button
              className="rounded-full bg-white/90 p-2 backdrop-blur-sm transition-transform hover:scale-110 hover:bg-white"
              aria-label="Vista rápida"
              onClick={(e) => {
                e.preventDefault();
                // TODO: Implementar quick view modal
              }}
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 space-y-1">
          {product.category && (
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {product.category.name}
            </p>
          )}

          <h3 className="font-medium text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-bold",
                isOutOfStock ? "text-gray-400" : "text-gray-900",
              )}
            >
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.compare_at_price!)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      {!isOutOfStock && (
        <div className="mt-3">
          <button
            className="w-full rounded-lg bg-pink-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pink-600 disabled:opacity-50"
            onClick={() => {
              toast.success(`${product.name} agregado al carrito`);
            }}
            aria-label={`Agregar ${product.name} al carrito`}
          >
            <ShoppingCart className="mr-2 inline h-4 w-4" />
            Agregar al carrito
          </button>
        </div>
      )}
    </article>
  );
}
