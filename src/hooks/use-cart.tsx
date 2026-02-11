// hooks/use-cart.ts
"use client";

import type { Product, ProductVariant } from "@/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { toast } from "sonner";

interface CartItem {
  id: string; // product_id o product_id-variant_id
  product: Product;
  variant?: ProductVariant | null;
  quantity: number;
  addedAt: Date;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
}

type CartAction =
  | {
      type: "ADD_ITEM";
      payload: {
        product: Product;
        variant?: ProductVariant | null;
        quantity: number;
      };
    }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "HYDRATE"; payload: CartItem[] };

const CART_STORAGE_KEY = "glamify-cart-v2";
const MAX_QUANTITY_PER_ITEM = 10;

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, variant, quantity } = action.payload;

      // Validar stock
      const availableStock = variant?.stock ?? product.stock;
      if (availableStock === 0) {
        toast.error("Producto agotado");
        return state;
      }

      const itemId = variant ? `${product.id}-${variant.id}` : product.id;
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === itemId,
      );

      if (existingItemIndex > -1) {
        const existingItem = state.items[existingItemIndex];
        const newQuantity = Math.min(
          existingItem.quantity + quantity,
          Math.min(availableStock, MAX_QUANTITY_PER_ITEM),
        );

        if (newQuantity === existingItem.quantity) {
          toast.error(`Máximo ${MAX_QUANTITY_PER_ITEM} unidades por producto`);
          return state;
        }

        const newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
        };

        toast.success("Cantidad actualizada");
        return { ...state, items: newItems };
      }

      // Nuevo item
      const newItem: CartItem = {
        id: itemId,
        product,
        variant: variant || null,
        quantity: Math.min(
          quantity,
          Math.min(availableStock, MAX_QUANTITY_PER_ITEM),
        ),
        addedAt: new Date(),
      };

      toast.success(`${product.name} agregado al carrito`);
      return {
        ...state,
        items: [...state.items, newItem],
        isOpen: true, // Abrir carrito al agregar
      };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter(
        (item) => item.id !== action.payload.id,
      );
      toast.success("Producto eliminado");
      return { ...state, items: newItems };
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: { id } });
      }

      const itemIndex = state.items.findIndex((item) => item.id === id);
      if (itemIndex === -1) return state;

      const item = state.items[itemIndex];
      const availableStock = item.variant?.stock ?? item.product.stock;
      const newQuantity = Math.min(
        quantity,
        Math.min(availableStock, MAX_QUANTITY_PER_ITEM),
      );

      if (newQuantity === quantity && quantity > MAX_QUANTITY_PER_ITEM) {
        toast.error(`Máximo ${MAX_QUANTITY_PER_ITEM} unidades`);
      } else if (newQuantity === quantity && quantity > availableStock) {
        toast.error(`Solo hay ${availableStock} unidades disponibles`);
      }

      const newItems = [...state.items];
      newItems[itemIndex] = {
        ...item,
        quantity: newQuantity,
      };

      return { ...state, items: newItems };
    }

    case "CLEAR_CART":
      toast.success("Carrito vaciado");
      return { ...state, items: [] };

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "HYDRATE":
      return { ...state, items: action.payload };

    default:
      return state;
  }
}

interface CartContextValue extends CartState {
  addItem: (
    product: Product,
    variant?: ProductVariant | null,
    quantity?: number,
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  itemCount: number;
  subtotal: number;
  hasStock: (productId: string, variantId?: string) => boolean;
  getItemQuantity: (productId: string, variantId?: string) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    isLoading: true,
  });

  // Hidratar desde localStorage
  useEffect(() => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored);
        // Convertir strings de fecha a Date objects
        const hydratedItems = items.map((item: CartItem) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }));
        dispatch({ type: "HYDRATE", payload: hydratedItems });
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  // Guardar en localStorage cuando cambie
  useEffect(() => {
    if (!state.isLoading) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
      } catch (error) {
        console.error("Error saving cart:", error);
      }
    }
  }, [state.items, state.isLoading]);

  const addItem = (
    product: Product,
    variant?: ProductVariant | null,
    quantity = 1,
  ) => {
    dispatch({ type: "ADD_ITEM", payload: { product, variant, quantity } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" });
  };

  const hasStock = (productId: string, variantId?: string): boolean => {
    const itemId = variantId ? `${productId}-${variantId}` : productId;
    const item = state.items.find((i) => i.id === itemId);
    if (!item) return true;

    const stock = item.variant?.stock ?? item.product.stock;
    return item.quantity < stock;
  };

  const getItemQuantity = (productId: string, variantId?: string): number => {
    const itemId = variantId ? `${productId}-${variantId}` : productId;
    const item = state.items.find((i) => i.id === itemId);
    return item?.quantity || 0;
  };

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = state.items.reduce((sum, item) => {
    const basePrice = Number(item.product.price);
    const variantModifier = Number(item.variant?.price_adjustment || 0);
    return sum + (basePrice + variantModifier) * item.quantity;
  }, 0);

  // No renderizar children hasta que se haya hidratado
  if (state.isLoading) {
    return null;
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        hasStock,
        getItemQuantity,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
