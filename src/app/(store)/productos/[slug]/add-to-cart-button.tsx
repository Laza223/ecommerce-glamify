"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import type { Product } from "@/types";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCartStore();

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    addItem(product, undefined, quantity);
    setIsAdded(true);
    toast.success(`${product.name} agregado al carrito`, {
      description: `Cantidad: ${quantity}`,
    });

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div>
        <label className="mb-2 block text-sm font-medium">Cantidad</label>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-r-none"
              onClick={decreaseQuantity}
              disabled={quantity <= 1 || isOutOfStock}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-l-none"
              onClick={increaseQuantity}
              disabled={quantity >= product.stock || isOutOfStock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-sm text-muted-foreground">
            {product.stock} disponibles
          </span>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        size="lg"
        className="w-full shadow-pink"
        disabled={isOutOfStock}
        onClick={handleAddToCart}
      >
        {isAdded ? (
          <>
            <Check className="mr-2 h-5 w-5" />
            ¡Agregado!
          </>
        ) : isOutOfStock ? (
          "Agotado"
        ) : (
          <>
            <ShoppingBag className="mr-2 h-5 w-5" />
            Agregar al Carrito
          </>
        )}
      </Button>
    </div>
  );
}
