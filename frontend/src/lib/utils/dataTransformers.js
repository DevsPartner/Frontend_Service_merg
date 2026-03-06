/**
 * Transform backend order to dashboard order format
 */
export function transformOrderForDisplay(backendOrder) {
  const customerName = backendOrder.firstName && backendOrder.lastName
    ? `${backendOrder.firstName} ${backendOrder.lastName}`
    : backendOrder.username || 'Guest Customer';

  return {
    id: backendOrder.orderId,
    customer: customerName,
    status: 'Completed',
    amount: `€${Number(backendOrder.totalAmount).toFixed(2)}`,
    date: new Date(backendOrder.orderDate).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }),
    avatar: customerName.toLowerCase().replace(/\s/g, '-'),
  };
}

export function transformMonthlySalesForChart(salesData) {
  return salesData.map(item => ({
    name: item.month,
    sales: item.totalSales
  }));
}

export function transformStatsToTargetCard(stats) {
  const percentage = stats.monthlyTarget > 0 
    ? Math.round((stats.totalRevenue / stats.monthlyTarget) * 100)
    : 0;

  return {
    percentage: Math.min(percentage, 100),
    todayRevenue: `€${stats.todayRevenue.toLocaleString('de-DE', { 
      minimumFractionDigits: 2 
    })}`,
    target: `€${stats.monthlyTarget.toLocaleString('de-DE')}`,
    totalRevenue: `€${stats.totalRevenue.toLocaleString('de-DE', { 
      minimumFractionDigits: 2 
    })}`,
    today: `€${stats.todayRevenue.toLocaleString('de-DE', { 
      minimumFractionDigits: 2 
    })}`
  };
}