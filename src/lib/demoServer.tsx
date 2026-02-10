import { MonthlyData, Order, Customer, Product, StatData, TrendDirection, TrafficData, TargetStats } from '@/types';

// Mock Data
const SALES_DATA: MonthlyData[] = [
  { name: 'Jan', sales: 150 },
  { name: 'Feb', sales: 380 },
  { name: 'Mar', sales: 180 },
  { name: 'Apr', sales: 290 },
  { name: 'May', sales: 170 },
  { name: 'Jun', sales: 180 },
  { name: 'Jul', sales: 280 },
  { name: 'Aug', sales: 90 },
  { name: 'Sep', sales: 200 },
  { name: 'Oct', sales: 390 },
  { name: 'Nov', sales: 270 },
  { name: 'Dec', sales: 90 },
];

const RECENT_ORDERS: Order[] = [
  { id: '#ORD-001', customer: 'Sarah Smith', status: 'Completed', amount: '$120.50', date: 'Oct 24, 2023', avatar: 'Sarah' },
  { id: '#ORD-002', customer: 'Michael Brown', status: 'Pending', amount: '$75.00', date: 'Oct 24, 2023', avatar: 'Michael' },
  { id: '#ORD-003', customer: 'James Wilson', status: 'Cancelled', amount: '$350.20', date: 'Oct 23, 2023', avatar: 'James' },
  { id: '#ORD-004', customer: 'Robert Taylor', status: 'Completed', amount: '$50.00', date: 'Oct 23, 2023', avatar: 'Robert' },
];

const ALL_ORDERS: Order[] = [
  ...RECENT_ORDERS,
  { id: '#ORD-005', customer: 'Emily Davis', status: 'Completed', amount: '$210.00', date: 'Oct 22, 2023', avatar: 'Emily' },
  { id: '#ORD-006', customer: 'David Miller', status: 'Pending', amount: '$45.90', date: 'Oct 22, 2023', avatar: 'David' },
  { id: '#ORD-007', customer: 'Jessica White', status: 'Completed', amount: '$890.00', date: 'Oct 21, 2023', avatar: 'Jessica' },
  { id: '#ORD-008', customer: 'Chris Martin', status: 'Completed', amount: '$35.00', date: 'Oct 21, 2023', avatar: 'Chris' },
];

const DASHBOARD_STATS: StatData[] = [
    { label: "Total Customers", value: "3,782", percentage: 11.01, trend: TrendDirection.UP, icon: "users" },
    { label: "Total Orders", value: "5,359", percentage: 9.05, trend: TrendDirection.DOWN, icon: "box" },
    { label: "Total Revenue", value: "$48,295", percentage: 18.2, trend: TrendDirection.UP, icon: "wallet" },
];

const ANALYTICS_STATS: StatData[] = [
    { label: "Realtime Users", value: "452", percentage: 24.5, trend: TrendDirection.UP, icon: "activity" },
    { label: "Bounce Rate", value: "42.3%", percentage: 2.1, trend: TrendDirection.DOWN, icon: "mouse" },
    { label: "Page Views", value: "52.4k", percentage: 12.5, trend: TrendDirection.UP, icon: "eye" },
];

const TRAFFIC_DATA: TrafficData[] = [
  { name: 'Mon', visits: 4000 },
  { name: 'Tue', visits: 3000 },
  { name: 'Wed', visits: 2000 },
  { name: 'Thu', visits: 2780 },
  { name: 'Fri', visits: 1890 },
  { name: 'Sat', visits: 2390 },
  { name: 'Sun', visits: 3490 },
];

const CUSTOMERS: Customer[] = [
  { id: '1', name: 'Sarah Smith', email: 'sarah.smith@example.com', spent: '$1,200.50', orders: 12, lastActive: '2 mins ago', avatar: 'Sarah', status: 'Active' },
  { id: '2', name: 'Michael Brown', email: 'm.brown@example.com', spent: '$750.00', orders: 5, lastActive: '1 day ago', avatar: 'Michael', status: 'Active' },
  { id: '3', name: 'James Wilson', email: 'j.wilson@tech.com', spent: '$3,450.20', orders: 24, lastActive: '3 days ago', avatar: 'James', status: 'Inactive' },
  { id: '4', name: 'Robert Taylor', email: 'robert.t@example.com', spent: '$250.00', orders: 2, lastActive: '1 week ago', avatar: 'Robert', status: 'Active' },
  { id: '5', name: 'Emily Davis', email: 'emily.d@design.io', spent: '$5,100.00', orders: 45, lastActive: 'Just now', avatar: 'Emily', status: 'Active' },
  { id: '6', name: 'David Miller', email: 'david.m@example.com', spent: '$0.00', orders: 0, lastActive: '1 month ago', avatar: 'David', status: 'Inactive' },
];

const PRODUCTS: Product[] = [
  { id: '1', name: 'Wireless Headphones', category: 'Electronics', price: '$120.00', stock: 45, status: 'In Stock', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
  { id: '2', name: 'Smart Watch Series 7', category: 'Wearables', price: '$350.00', stock: 12, status: 'Low Stock', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' },
  { id: '3', name: 'Ergonomic Office Chair', category: 'Furniture', price: '$250.00', stock: 0, status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&q=80' },
  { id: '4', name: 'Mechanical Keyboard', category: 'Accessories', price: '$150.00', stock: 110, status: 'In Stock', image: 'https://images.unsplash.com/photo-1587829741301-dc798b91add1?w=500&q=80' },
  { id: '5', name: 'Gaming Mouse', category: 'Accessories', price: '$80.00', stock: 55, status: 'In Stock', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&q=80' },
  { id: '6', name: 'HD Monitor 27"', category: 'Electronics', price: '$400.00', stock: 8, status: 'Low Stock', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80' },
];

const TARGET_STATS: TargetStats = {
    percentage: 75.55,
    todayRevenue: "$3,287",
    target: "$20K",
    totalRevenue: "$20K",
    today: "$3.2K"
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ApiService = {
  getDashboardStats: async (): Promise<StatData[]> => {
    await delay(500);
    return DASHBOARD_STATS;
  },
  getAnalyticsStats: async (): Promise<StatData[]> => {
      await delay(500);
      return ANALYTICS_STATS;
  },
  getSalesData: async (): Promise<MonthlyData[]> => {
    await delay(800);
    return SALES_DATA;
  },
  getRecentOrders: async (): Promise<Order[]> => {
    await delay(600);
    return RECENT_ORDERS;
  },
  getAllOrders: async (): Promise<Order[]> => {
      await delay(700);
      return ALL_ORDERS;
  },
  getCustomers: async (): Promise<Customer[]> => {
      await delay(600);
      return CUSTOMERS;
  },
  getProducts: async (): Promise<Product[]> => {
      await delay(500);
      return PRODUCTS;
  },
  getTrafficData: async (): Promise<TrafficData[]> => {
      await delay(600);
      return TRAFFIC_DATA;
  },
  getTargetStats: async(): Promise<TargetStats> => {
      await delay(400);
      return TARGET_STATS;
  }
};