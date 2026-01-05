'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { storeConfig } from '@/config/store'
import { useCartStore } from '@/stores/cart-store'
import type { Product } from '@/types'
import { Eye, Heart, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(storeConfig.locale, {
      style: 'currency',
      currency: storeConfig.currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  const hasDiscount =
    product.compare_at_price && product.compare_at_price > product.price
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compare_at_price! - product.price) / product.compare_at_price!) * 100
      )
    : 0

  const isOutOfStock = product.stock <= 0

  return (
    <Card className="group relative overflow-hidden border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link href={`/productos/${product.slug}`}>
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-secondary to-accent">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {hasDiscount && (
            <Badge className="bg-primary text-white shadow-pink">
              -{discountPercent}%
            </Badge>
          )}
          {product.is_featured && (
            <Badge variant="secondary" className="bg-black text-white">
              Destacado
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="destructive">Agotado</Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            variant="secondary"
            size="icon"
            className="h-9 w-9 rounded-full bg-white shadow-md hover:bg-primary hover:text-white"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-9 w-9 rounded-full bg-white shadow-md hover:bg-primary hover:text-white"
            asChild
          >
            <Link href={`/productos/${product.slug}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Add to Cart Overlay */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
          <Button
            className="w-full bg-white text-foreground hover:bg-primary hover:text-white"
            disabled={isOutOfStock}
            onClick={() => addItem(product)}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            {isOutOfStock ? 'Agotado' : 'Agregar al Carrito'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <Link href={`/productos/${product.slug}`}>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {product.category?.name || 'Sin categoría'}
          </p>
          <h3 className="mt-1 font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compare_at_price!)}
            </span>
          )}
        </div>

        {/* Stock indicator */}
        {product.stock > 0 && product.stock <= product.low_stock_threshold && (
          <p className="mt-2 text-xs text-orange-600">
            ¡Solo quedan {product.stock}!
          </p>
        )}
      </CardContent>
    </Card>
  )
}
