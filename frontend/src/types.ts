// Backend Order Types
export interface OrderItem {
  id: number;
  order_id: number;
  product_Id: number;
  productName: string;
  price: number;
  quantity: number;
}

export interface BackendOrder {
  orderId: number;
  cartId: number | null;
  totalAmount: number;
  gender: string | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  Street: string | null;
  Housenr: string | null;
  PostalCode: string | null;
  City: string | null;
  Email: string | null;
  orderDate: string;
  items?: OrderItem[];
}

// Dashboard Display Types
export interface Order {
  id: number;
  customer: string;
  status: string;
  amount: string;
  date: string;
  avatar: string;
}

export interface StatData {
  label: string;
  value: string;
  percentage: string;
  trend: 'up' | 'down';
  icon?: string;
}

export interface MonthlyData {
  name: string;
  sales: number;
}

export interface TargetStats {
  percentage: number;
  todayRevenue: string;
  target: string;
  totalRevenue: string;
  today: string;
}
export enum TrendDirection {
  UP = 'UP',
  DOWN = 'DOWN'
}