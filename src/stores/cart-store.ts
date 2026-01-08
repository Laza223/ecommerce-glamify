import type { CartItem, Product, ProductVariant } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (
    product: Product,
    variant?: ProductVariant,
    quantity?: number
  ) => void;
  removeItem: (productId: string, variantId?: string | null) => void;
  updateQuantity: (
    productId: string,
    variantId: string | null,
    quantity: number
  ) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Computed
  getItemCount: () => number;
  getSubtotal: () => number;
  getItemPrice: (item: CartItem) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.product_id === product.id &&
              item.variant_id === (variant?.id || null)
          );

          if (existingIndex > -1) {
            // Update quantity if item exists
            const newItems = [...state.items];
            newItems[existingIndex].quantity += quantity;
            return { items: newItems };
          }

          // Add new item
          return {
            items: [
              ...state.items,
              {
                product_id: product.id,
                variant_id: variant?.id || null,
                quantity,
                product,
                variant,
              },
            ],
          };
        });
      },

      removeItem: (productId, variantId = null) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.product_id === productId && item.variant_id === variantId)
          ),
        }));
      },

      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product_id === productId && item.variant_id === variantId
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((acc, item) => {
          return acc + get().getItemPrice(item) * item.quantity;
        }, 0);
      },

      getItemPrice: (item) => {
        const basePrice = item.product.price;
        const adjustment = item.variant?.price_adjustment || 0;
        return basePrice + adjustment;
      },
    }),
    {
      name: "glamify-cart",
      partialize: (state) => ({
        items: state.items.map((item) => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          product: item.product,
          variant: item.variant,
        })),
      }),
    }
  )
);
