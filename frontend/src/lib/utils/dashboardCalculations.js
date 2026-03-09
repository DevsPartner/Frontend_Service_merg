// dashboardCalculations.js
import { apiGet } from '@/lib/apiClient';
/**
 * 1. Define TrendDirection here to avoid import errors.
 * This fixes the "TrendDirection is not defined" crash.
 */
export const TrendDirection = {
  UP: 'up',
  DOWN: 'down',
  NEUTRAL: 'neutral'
};
/**
 * Create Total Order
 */
export function  totalOrder(orders){
const ordersCount = orders.length;
return ordersCount

}

/**
 * get total spend 
 */
export function totalSpend(orders){
  const total = orders.reduce((sum, order) => {
  return sum + Number(order.total || 0);
}, 0);
return total
}
/**
 * Calculate all dashboard statistics from raw order data
 */
export function calculateOrderStats(orders) {
  if (!orders || !Array.isArray(orders)) return defaultStats();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Filter orders for this month
  const thisMonthOrders = orders.filter(order => {
    // Safety check: ensure date exists
    if (!order.orderDate) return false;
    const orderDate = new Date(order.orderDate);
    return orderDate >= monthStart;
  });

  // Filter orders for today
  const todayOrders = orders.filter(order => {
    if (!order.orderDate) return false;
    const orderDate = new Date(order.orderDate);
    return orderDate >= todayStart;
  });

  // Calculate totals
  const totalOrders = thisMonthOrders.length;
  
  const totalRevenue = thisMonthOrders.reduce((sum, order) => {
    return sum + (Number(order.totalAmount) || 0);
  }, 0);

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const todayRevenue = todayOrders.reduce((sum, order) => {
    return sum + (Number(order.totalAmount) || 0);
  }, 0);

  const monthlyTarget = 50000;

  return {
    totalOrders,
    totalRevenue,
    averageOrderValue,
    todayRevenue,
    todayOrders: todayOrders.length,
    monthlyTarget
  };
}

function defaultStats() {
    return {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        todayRevenue: 0,
        todayOrders: 0,
        monthlyTarget: 50000
    };
}

export function calculateMonthlySales(orders, monthsBack = 12) {
  if (!orders) return [];

  const now = new Date();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const monthlyData = {};
  
  // Create empty structure for last X months
  for (let i = monthsBack - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    const monthName = monthNames[date.getMonth()];
    
    monthlyData[monthKey] = {
      month: monthName,
      totalSales: 0,
      orderCount: 0
    };
  }

  // Fill in actual order data
  orders.forEach(order => {
    if (!order.orderDate) return;
    const orderDate = new Date(order.orderDate);
    
    // Validate date is valid before using
    if (isNaN(orderDate.getTime())) return;

    const monthKey = `${orderDate.getFullYear()}-${orderDate.getMonth()}`;
    
    if (monthlyData[monthKey]) {
      monthlyData[monthKey].totalSales += (Number(order.totalAmount) || 0);
      monthlyData[monthKey].orderCount += 1;
    }
  });

  return Object.values(monthlyData);
}

export function calculateUniqueCustomers(orders) {
  if (!orders) return 0;
  const uniqueEmails = new Set();
  
  orders.forEach(order => {
    if (order.username) {
      uniqueEmails.add(order.username.toLowerCase());
    }
  });
  
  return uniqueEmails.size;
}

export function getPreviousMonthStats(orders) {
  if (!orders) return { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 };

  const now = new Date();
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);

  const prevMonthOrders = orders.filter(order => {
    if (!order.orderDate) return false;
    const orderDate = new Date(order.orderDate);
    return orderDate >= prevMonthStart && orderDate < prevMonthEnd;
  });

  const totalRevenue = prevMonthOrders.reduce((sum, order) => {
    return sum + (Number(order.totalAmount) || 0);
  }, 0);

  return {
    totalOrders: prevMonthOrders.length,
    totalRevenue,
    averageOrderValue: prevMonthOrders.length > 0 ? totalRevenue / prevMonthOrders.length : 0
  };
}

export function calculatePercentageChange(current, previous) {
  if (!previous || previous === 0) return 0;
  // Fix: Added Math.round to prevent ugly decimals like 33.3333333%
  return Math.round(((current - previous) / previous) * 100);
}

export function calculateTrend(current, previous) {
  // Fix: Added safety check and Neutral logic
  if (previous === undefined || previous === null) return TrendDirection.NEUTRAL;
  if (current > previous) return TrendDirection.UP;
  if (current < previous) return TrendDirection.DOWN;
  return TrendDirection.NEUTRAL;
}

export async function fetchSalesAndForecastData() {
  try {
    // 1. Fetch Actual Sales from Order Service
    const salesRes = await clientFetch('orders', '/api/analytics/sales-history');
    const actualSales = await salesRes.json();

    // 2. Fetch AI Forecast for the next period
    const forecastRes = await clientFetch('forecast', '/api/forecast/predict-all');
    const forecastData = await forecastRes.json();

    // 3. Merge them into a format Recharts understands
    return actualSales.map(item => {
      const prediction = forecastData.find(f => f.date === item.date);
      return {
        name: item.month,
        actual: item.amount,
        predicted: prediction ? prediction.amount : null, // The AI "guess"
      };
    });
  } catch (error) {
    console.error("Failed to merge sales and forecast data:", error);
    return [];
  }
}