"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { storeConfig } from "@/config/store";
import { useCartStore } from "@/stores/cart-store";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    getItemPrice,
  } = useCartStore();

  const subtotal = getSubtotal();
  const shipping =
    subtotal >= storeConfig.freeShippingThreshold
      ? 0
      : storeConfig.defaultShippingCost;
  const total = subtotal + shipping;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(storeConfig.locale, {
      style: "currency",
      currency: storeConfig.currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="rounded-full bg-muted p-8">
          <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Tu carrito está vacío</h1>
        <p className="mt-2 text-muted-foreground">
          Explorá nuestros productos y encontrá algo que te guste
        </p>
        <Button className="mt-6" size="lg" asChild>
          <Link href="/productos">
            Ver Productos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tu Carrito</h1>
        <Button variant="ghost" size="sm" onClick={clearCart}>
          Vaciar carrito
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => {
              const itemPrice = getItemPrice(item);
              return (
                <div
                  key={`${item.product_id}-${item.variant_id}`}
                  className="flex gap-4 rounded-lg border bg-card p-4"
                >
                  {/* Image */}
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted sm:h-32 sm:w-32">
                    {item.product.images[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/productos/${item.product.slug}`}
                        className="font-medium hover:text-primary"
                      >
                        {item.product.name}
                      </Link>
                      {item.variant && (
                        <p className="text-sm text-muted-foreground">
                          {item.variant.name}: {item.variant.value}
                        </p>
                      )}
                      <p className="mt-1 text-lg font-semibold text-primary">
                        {formatPrice(itemPrice)}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(
                              item.product_id,
                              item.variant_id,
                              item.quantity - 1
                            )
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(
                              item.product_id,
                              item.variant_id,
                              item.quantity + 1
                            )
                          }
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Subtotal & Remove */}
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">
                          {formatPrice(itemPrice * item.quantity)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() =>
                            removeItem(item.product_id, item.variant_id)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold">Resumen del Pedido</h2>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Subtotal ({items.length}{" "}
                  {items.length === 1 ? "producto" : "productos"})
                </span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envío</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600">Gratis</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  ¡Agregá{" "}
                  {formatPrice(storeConfig.freeShippingThreshold - subtotal)}{" "}
                  más para envío gratis!
                </p>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>

            <Button className="mt-6 w-full shadow-pink" size="lg" asChild>
              <Link href="/checkout">
                Finalizar Compra
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button variant="outline" className="mt-3 w-full" asChild>
              <Link href="/productos">Seguir Comprando</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
