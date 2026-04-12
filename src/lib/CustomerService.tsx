// src/lib/CustomerService.js
const API_URL = process.env.LOGIN_SERVICE_URL || 'http://localhost:8004';

export class CustomerService {
  static async getCustomers(skip = 0, limit = 500) {
    const res = await fetch(`${API_URL}/api/auth/users?skip=${skip}&limit=${limit}`, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Failed to fetch customers: ${res.status}`);
    return await res.json();
  }

  static async updateNote(customerId, note) {
    const res = await fetch(`${API_URL}/api/auth/users/${customerId}/note`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note }),
    });
    if (!res.ok) throw new Error('Failed to update note');
    return await res.json();
  }

  static async updateStatus(customerId, isActive) {
    const res = await fetch(`${API_URL}/api/auth/users/${customerId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: isActive }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return await res.json();
  }
}