const API_URL = (process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || 'http://localhost:8003').replace(/\/$/, ''); 

export class OrderService {
  static async getRecentOrders(skip = 0, limit = 100) {
    try {
      const url = new URL(`${API_URL}/orders/`);
      url.searchParams.append('skip', skip.toString());
      url.searchParams.append('limit', limit.toString());
      console.log("Fetching URL:", url.toString());

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'No error details');
        throw new Error(`HTTP error! status: ${response.status} - ${errorBody}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }
}