import React, { createContext, useContext, useState, useEffect } from "react";
import { cartApi } from "../services/api";
import type { CartItem } from "../types";
import { useAuth } from "./AuthContext";

interface CartContextType {
  cartItems: CartItem[];
  cartTotal: number;
  itemCount: number;
  isLoading: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const calculateTotals = (items: CartItem[]) => {
    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    return { total, count };
  };

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await cartApi.getCart();
      // Server returns { success, message, carts: { items: [...] } }
      const cartData = (response as any).carts || response.data;
      if (cartData && cartData.items) {
        setCartItems(cartData.items);
      } else if (response.success && response.data) {
        setCartItems(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!isAuthenticated) {
      // TODO: Handle guest cart or redirect to login
      alert("Please login to add items to cart");
      return;
    }

    try {
      await cartApi.addToCart(productId, quantity);
      await refreshCart();
      setIsCartOpen(true);
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const item = cartItems.find((i) => i.id === cartItemId);
      if (!item) return;

      await cartApi.removeFromCart(item.product.id);
      await refreshCart();
    } catch (error) {
      console.error("Failed to remove from cart", error);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      const item = cartItems.find((i) => i.id === cartItemId);
      if (!item) return;

      if (quantity <= 0) {
        await removeFromCart(item.product.id); // Server expects productId
        return;
      }

      const diff = quantity - item.quantity;
      if (diff === 0) return;

      // Use addToCart to update quantity (it adds the diff)
      await cartApi.addToCart(item.product.id, diff);
      await refreshCart();
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clearCart();
      setCartItems([]);
    } catch (error) {
      console.error("Failed to clear cart", error);
    }
  };

  const { total: cartTotal, count: itemCount } = calculateTotals(cartItems);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        itemCount,
        isLoading,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
