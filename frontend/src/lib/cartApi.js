const CART_API_URL = process.env.NEXT_PUBLIC_CART_API_URL || 'http://localhost:8001/api/v1';

export const cartApi = {
  addToCart: async (userId, username, itemData) => {
    console.log('CART - userId:', userId);
    console.log('CART - username:', username);
    console.log('CART - itemData:', itemData);
    console.log('CART - URL:', `${CART_API_URL}/cart/${userId}/items?username=${encodeURIComponent(username)}`);

    const response = await fetch(`${CART_API_URL}/cart/${userId}/items?username=${encodeURIComponent(username)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Failed to add item to cart');
    }

    return response.json();
  },

  getCart: async (userId) => {
    console.log('CART - getCart userId:', userId);
    const response = await fetch(`${CART_API_URL}/cart/${userId}`);
    
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to get cart');
    }

    return response.json();
  },

  updateQuantity: async (userId, productId, quantity) => {
    const response = await fetch(`${CART_API_URL}/cart/${userId}/items/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      throw new Error('Failed to update quantity');
    }

    return response.json();
  },

  removeItem: async (userId, productId) => {
    const response = await fetch(`${CART_API_URL}/cart/${userId}/items/${productId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to remove item');
    }
  },

  clearCart: async (userId) => {
    const response = await fetch(`${CART_API_URL}/cart/${userId}/clear`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }
  },
};