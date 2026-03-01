'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

// Simple guest ID generator
const getGuestId = () => {
  if (typeof window === 'undefined') return null;
  let guestId = localStorage.getItem('guestId');
  if (!guestId) {
    guestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('guestId', guestId);
  }
  return guestId;
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total_amount: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load cart on mount or user change
  useEffect(() => {
    loadCart();
  }, [user]);

  const loadCart = async () => {
    setLoading(true);
    try {
      if (user?.customer_id) {
        // Logged in user - load from API
        const cartData = await api.cart.get(user.customer_id);
        setCart(cartData);
      } else {
        // Guest user - load from localStorage
        const savedCart = localStorage.getItem('guestCart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        } else {
          setCart({ items: [], total_amount: 0 });
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCart({ items: [], total_amount: 0 });
    } finally {
      setLoading(false);
    }
  };

  const saveCart = (newCart) => {
    setCart(newCart);
    if (!user?.customer_id) {
      // Save to localStorage for guests
      localStorage.setItem('guestCart', JSON.stringify(newCart));
    }
  };

  const addToCart = async (product) => {
    try {
      if (user?.customer_id) {
        // Logged in user - use API
        const updatedCart = await api.cart.add(
          user.customer_id,
          user.name || user.email,
          product
        );
        setCart(updatedCart);
      } else {
        // Guest user - handle locally
        const currentCart = { ...cart };
        const existingItem = currentCart.items.find(
          item => item.product_id === (product.product_id || product.id)
        );

        if (existingItem) {
          existingItem.quantity += product.quantity || 1;
        } else {
          currentCart.items.push({
            product_id: product.product_id || product.id,
            name: product.name,
            price: product.price,
            quantity: product.quantity || 1
          });
        }

        currentCart.total_amount = currentCart.items.reduce(
          (sum, item) => sum + (item.price * item.quantity), 0
        );

        saveCart(currentCart);
      }

      alert(`${product.name} wurde zum Warenkorb hinzugefügt`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Fehler beim Hinzufügen zum Warenkorb');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    try {
      if (user?.customer_id) {
        const updatedCart = await api.cart.updateQuantity(
          user.customer_id,
          productId,
          quantity
        );
        setCart(updatedCart);
      } else {
        const currentCart = { ...cart };
        const item = currentCart.items.find(item => item.product_id === productId);
        if (item) {
          item.quantity = quantity;
          currentCart.total_amount = currentCart.items.reduce(
            (sum, item) => sum + (item.price * item.quantity), 0
          );
          saveCart(currentCart);
        }
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (user?.customer_id) {
        await api.cart.remove(user.customer_id, productId);
        await loadCart();
      } else {
        const currentCart = { ...cart };
        currentCart.items = currentCart.items.filter(item => item.product_id !== productId);
        currentCart.total_amount = currentCart.items.reduce(
          (sum, item) => sum + (item.price * item.quantity), 0
        );
        saveCart(currentCart);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      if (user?.customer_id) {
        await api.cart.clear(user.customer_id);
      }
      setCart({ items: [], total_amount: 0 });
      localStorage.removeItem('guestCart');
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getCartCount = () => {
    return cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const getCartTotal = () => {
    return cart.total_amount || 0;
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCartCount,
      getCartTotal,
      loadCart,
      isGuest: !user,
      guestId: !user ? getGuestId() : null
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}