// services/CustomerService.js

// 1. Define your backend URL (Adjust env variable name as needed)
const API_URL = (process.env.NEXT_PUBLIC_CUSTOMER_SERVICE_URL || 'http://localhost:8003').replace(/\/$/, '');

export class CustomerService {
  /**
   * Fetch all customers
   */
  static async getCustomers(skip = 0, limit = 100) {
    try {
      // Use URL builder for safety
      const url = new URL(`${API_URL}/orders`);
      url.searchParams.append('skip', skip.toString());
      url.searchParams.append('limit', limit.toString());
      
      console.log("Fetching Customers URL:", url.toString());

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store', // Ensure fresh data
      });

   

      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'No error details');
        throw new Error(`HTTP error! status: ${response.status} - ${errorBody}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  /**
   * Add a new customer
   */
  static async addCustomer(customerData) {
    const response = await fetch(`${API_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData),
    });
    if (!response.ok) throw new Error('Failed to add customer');
    return await response.json();
  }

  /**
   * Update an existing customer
   */
  static async updateCustomer(id, customerData) {
    const response = await fetch(`${API_URL}/customers/${id}`, {
      method: 'PUT', // or PATCH
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData),
    });
    if (!response.ok) throw new Error('Failed to update customer');
    return await response.json();
  }

  /**
   * Delete a customer
   */
  static async deleteCustomer(id) {
    const response = await fetch(`${API_URL}/customers/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete customer');
    return true;
  }
}