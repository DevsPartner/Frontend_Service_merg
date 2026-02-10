
// CartContext.js
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth(); // user kann null sein (Guest)
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -------- LocalStorage Helpers --------
  const loadCartFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Failed to load cart from localStorage:", err);
      return [];
    }
  };

  const saveCartToLocalStorage = (nextCart) => {
    try {
      localStorage.setItem("cart", JSON.stringify(nextCart));
    } catch (err) {
      console.error("Failed to save cart to localStorage:", err);
    }
  };

  // -------- Backend Fetch (returns data) --------
  const fetchCartFromBackend = async () => {
    const res = await fetch("/api/cart", { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch cart");

    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (data?.items && Array.isArray(data.items)) return data.items;
    return [];
  };

  // -------- Load cart when user changes --------
  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      setLoading(true);
      setError(null);

      try {
        if (user) {
          const backendCart = await fetchCartFromBackend();
          if (!cancelled) setCart(backendCart);

          // clear guest cart on login
          if (!cancelled) localStorage.removeItem("cart");
        } else {
          const guestCart = loadCartFromLocalStorage();
          if (!cancelled) setCart(guestCart);
        }
      } catch (err) {
        console.error("Failed to load cart:", err);
        if (!cancelled) {
          setError(err.message || "Failed to load cart");
          setCart([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCart();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // -------- Save ONLY for guests --------
  useEffect(() => {
    if (!loading && !user) {
      saveCartToLocalStorage(cart);
    }
  }, [cart, user, loading]);

  // -------- Actions --------
  const addToCart = async (product) => {
    const previousCart = cart;

    setCart((prev) => {
      const qty = product.quantity || 1;
      const existing = prev.find((i) => i.id === product.id);

      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }

      return [...prev, { ...product, quantity: qty }];
    });

    if (user) {
      try {
        const res = await fetch("/api/cart/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            productId: product.id,
            quantity: product.quantity || 1,
          }),
        });
        if (!res.ok) throw new Error("Failed to sync cart");
      } catch (err) {
        console.error("Failed to sync cart:", err);
        setCart(previousCart); // rollback
      }
    }
  };

  const removeFromCart = async (productId) => {
    const previousCart = cart;
    setCart((prev) => prev.filter((i) => i.id !== productId));

    if (user) {
      try {
        const res = await fetch(`/api/cart/items/${productId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to remove item");
      } catch (err) {
        console.error("Failed to remove item:", err);
        setCart(previousCart); // rollback
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const previousCart = cart;
    setCart((prev) =>
      prev.map((i) => (i.id === productId ? { ...i, quantity } : i))
    );

    if (user) {
      try {
        const res = await fetch(`/api/cart/items/${productId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ quantity }),
        });
        if (!res.ok) throw new Error("Failed to update quantity");
      } catch (err) {
        console.error("Failed to update quantity:", err);
        setCart(previousCart); // rollback
      }
    }
  };

  const clearCart = async () => {
    const previousCart = cart;
    setCart([]);

    if (user) {
      try {
        const res = await fetch("/api/cart", {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to clear cart");
      } catch (err) {
        console.error("Failed to clear cart:", err);
        setCart(previousCart);
      }
    } else {
      saveCartToLocalStorage([]);
    }
  };

  const refreshCart = async () => {
    if (!user) {
      setCart(loadCartFromLocalStorage());
      return;
    }

    try {
      setLoading(true);
      const backendCart = await fetchCartFromBackend();
      setCart(backendCart);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to refresh cart");
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () =>
    cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);

  const getCartCount = () =>
    cart.reduce((count, item) => count + item.quantity, 0);

  const value = useMemo(
    () => ({
      cart,
      loading,
      error,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      refreshCart,
    }),
    [cart, loading, error]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

