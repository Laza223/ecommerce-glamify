// components/products/add-to-cart-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import type { Product, ProductVariant } from "@/types";
import { Check, ShoppingCart, X } from "lucide-react";
import { useState } from "react";

interface AddToCartButtonProps {
  product: Product;
  productVariant?: ProductVariant | null;
  quantity?: number;
  showIcon?: boolean;
  successDuration?: number;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function AddToCartButton({
  product,
  productVariant = null,
  quantity = 1,
  showIcon = true,
  successDuration = 2000,
  children,
  className,
  disabled,
}: AddToCartButtonProps) {
  const { addItem, hasStock, getItemQuantity } = useCart();
  const [status, setStatus] = useState<"idle" | "adding" | "success" | "error">(
    "idle",
  );

  const currentQuantity = getItemQuantity(product.id, productVariant?.id);
  const availableStock = productVariant?.stock ?? product.stock;
  const canAddMore = hasStock(product.id, productVariant?.id);
  const isOutOfStock = availableStock === 0;
  const isMaxed = currentQuantity >= 10 || currentQuantity >= availableStock;

  const handleAddToCart = async () => {
    if (isOutOfStock || isMaxed || !canAddMore) return;

    setStatus("adding");

    try {
      // Simular delay para mejor UX
      await new Promise((resolve) => setTimeout(resolve, 300));

      addItem(product, productVariant, quantity);
      setStatus("success");

      // Reset después del tiempo especificado
      setTimeout(() => {
        setStatus("idle");
      }, successDuration);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const getButtonContent = () => {
    switch (status) {
      case "adding":
        return (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Agregando...</span>
          </>
        );

      case "success":
        return (
          <>
            <Check className="h-4 w-4" />
            <span>¡Agregado!</span>
          </>
        );

      case "error":
        return (
          <>
            <X className="h-4 w-4" />
            <span>Error</span>
          </>
        );

      default:
        if (isOutOfStock) {
          return "Agotado";
        }
        if (isMaxed) {
          return "Máximo alcanzado";
        }
        if (currentQuantity > 0) {
          return (
            <>
              {showIcon && <ShoppingCart className="h-4 w-4" />}
              <span>Agregar más ({currentQuantity})</span>
            </>
          );
        }
        return (
          <>
            {showIcon && <ShoppingCart className="h-4 w-4" />}
            <span>{children || "Agregar al carrito"}</span>
          </>
        );
    }
  };

  return (
    <Button
      disabled={disabled || isOutOfStock || isMaxed || status !== "idle"}
      className={cn(
        "gap-2 transition-all",
        status === "success" && "bg-green-500 hover:bg-green-600",
        status === "error" && "bg-red-500 hover:bg-red-600",
        className,
      )}
      aria-label={`Agregar ${product.name} al carrito`}
      onClick={handleAddToCart}
    >
      {getButtonContent()}
    </Button>
  );
}
