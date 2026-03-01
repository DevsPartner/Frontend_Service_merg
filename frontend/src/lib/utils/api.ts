const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const PRODUCT_SERVICE_URL = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || 'http://localhost:8000';
const CART_SERVICE_URL = process.env.NEXT_PUBLIC_CART_SERVICE_URL || 'http://localhost:8001';

export const api = {
  products: {
    getAll: async () => {
      const res = await fetch(`${PRODUCT_SERVICE_URL}/products/`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
    getById: async (id: string) => {
      const res = await fetch(`${PRODUCT_SERVICE_URL}/products/${id}`);
      if (!res.ok) throw new Error('Failed to fetch product');
      return res.json();
    },
  },
  cart: {
    // Get cart for a user
    get: async (userId: number) => {
      try {
        const res = await fetch(`${CART_SERVICE_URL}/api/v1/cart/${userId}`);
        if (res.status === 404) {
          // Cart doesn't exist yet - return empty cart
          return { items: [], total_amount: 0 };
        }
        if (!res.ok) throw new Error('Failed to fetch cart');
        return res.json();
      } catch (error) {
        console.error('Error fetching cart:', error);
        return { items: [], total_amount: 0 };
      }
    },
    
    // Add item to cart
    add: async (userId: number, username: string, item: any) => {
      const res = await fetch(`${CART_SERVICE_URL}/api/v1/cart/${userId}/items?username=${encodeURIComponent(username)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: item.productId,
          product_name: item.name,
          product_price: item.price,
          quantity: item.quantity || 1,
          image_link: item.image
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || 'Failed to add item to cart');
      }
      return res.json();
    },
    
    // Update item quantity
    updateQuantity: async (userId: number, productId: number, quantity: number) => {
      const res = await fetch(`${CART_SERVICE_URL}/api/v1/cart/${userId}/items/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) throw new Error('Failed to update quantity');
      return res.json();
    },
    
    // Remove item from cart
    remove: async (userId: number, productId: number) => {
      const res = await fetch(`${CART_SERVICE_URL}/api/v1/cart/${userId}/items/${productId}`, {
        method: 'DELETE',
      });
      if (!res.ok && res.status !== 204) throw new Error('Failed to remove item');
      return true;
    },
    
    // Clear cart
    clear: async (userId: number) => {
      const res = await fetch(`${CART_SERVICE_URL}/api/v1/cart/${userId}/clear`, {
        method: 'DELETE',
      });
      if (!res.ok && res.status !== 204) throw new Error('Failed to clear cart');
      return true;
    },
  },
};