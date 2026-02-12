const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const api = {
  products: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/products`);
      return res.json();
    },
    getById: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/products/${id}`);
      return res.json();
    },
  },
  cart: {
    get: async () => {
      const res = await fetch(`${API_BASE_URL}/cart`);
      return res.json();
    },
    add: async (item: any) => {
      const res = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      return res.json();
    },
  },
  // Add other services...
};