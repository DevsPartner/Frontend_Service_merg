// src/lib/OrderService.js
const API_URL = (process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || 'http://localhost:8003').replace(/\/$/, '');

export class OrderService {
  /**
   * Fetch all orders from backend
   */
  static async getRecentOrders(skip = 0, limit = 100) {
    try {
      const url = new URL(`${API_URL}/orders`);
      url.searchParams.append('skip', skip.toString());
      url.searchParams.append('limit', limit.toString());

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store',
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'No error details');
        throw new Error(`HTTP error! status: ${response.status} - ${errorBody}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  /**
   * Delete an order
   */
  static async deleteOrder(id) {
    try {
      const response = await fetch(`${API_URL}/orders/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to delete order');
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }
}