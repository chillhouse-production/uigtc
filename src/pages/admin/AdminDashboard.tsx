// pages/admin/AdminDashboard.tsx
import { useEffect, useState, useMemo } from 'react';
import { apiCall } from '../../services/api';

type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  // Nested product object (when included)
  product?: {
    id: string;
    name: string;
    productType: 'merchandise' | 'ticket_single' | 'ticket_bundle';
    category?: {
      name: string;
      type: 'merchandise' | 'ticket';
    };
  };
  // Flat properties (alternative structure from API)
  productName?: string;
  productType?: string;
  categoryType?: string;
  categoryName?: string;
};

type Order = {
  id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    schoolOrigin?: string;
  };
};

type DashboardStats = {
  totalRevenue: number;
  totalMerchSold: number;
  totalTicketsSold: number;
  totalOrders: number;
  pendingOrders: number;
  acceptedOrders: number;
  rejectedOrders: number;
};

type RecentOrder = {
  id: string;
  userName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
};

type SchoolStats = {
  name: string;
  count: number;
  revenue: number;
};

type DailySales = {
  date: string;
  label: string;
  revenue: number;
  orders: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalMerchSold: 0,
    totalTicketsSold: 0,
    totalOrders: 0,
    pendingOrders: 0,
    acceptedOrders: 0,
    rejectedOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [schoolStats, setSchoolStats] = useState<SchoolStats[]>([]);
  const [dailySales, setDailySales] = useState<DailySales[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const { data, ok } = await apiCall<{ success: boolean; data: Order[] }>('/admin/orders');
      
      if (ok && data.success && data.data) {
        const allOrders = data.data;
        
        // Filter by date range
        const filteredOrders = filterOrdersByDateRange(allOrders);
        // Calculate statistics
        calculateStats(filteredOrders);
        
        // Calculate school statistics
        calculateSchoolStats(filteredOrders);
        
        // Calculate daily sales (last 7 days)
        calculateDailySales(allOrders);
        
        // Get recent orders (last 10)
        const recent = filteredOrders
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10)
          .map(order => ({
            id: order.id,
            userName: order.user?.name || 'Unknown',
            totalAmount: order.totalAmount || 0,
            status: order.status,
            createdAt: order.createdAt,
          }));
        setRecentOrders(recent);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrdersByDateRange = (orders: Order[]): Order[] => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    switch (dateRange) {
      case 'today':
        return orders.filter(o => new Date(o.createdAt) >= startOfToday);
      case 'week':
        return orders.filter(o => new Date(o.createdAt) >= startOfWeek);
      case 'month':
        return orders.filter(o => new Date(o.createdAt) >= startOfMonth);
      default:
        return orders;
    }
  };

  const calculateStats = (orders: Order[]) => {
    // Only calculate revenue from accepted orders
    const acceptedOrders = orders.filter(o => o.status === 'accepted');
    
    let totalRevenue = 0;
    let totalMerchSold = 0;
    let totalTicketsSold = 0;

    acceptedOrders.forEach(order => {
      // Safe number conversion - handle undefined/null/NaN
      const orderAmount = Number(order.totalAmount) || 0;
      totalRevenue += orderAmount;
      
      // Loop through each item and categorize
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const quantity = Number(item.quantity) || 0;
          
          // Get item properties - handle both nested product object and flat structure
          const itemData = item as any; // Cast for flexibility
          const categoryType = itemData.product?.category?.type || itemData.categoryType;
          const productType = itemData.product?.productType || itemData.productType;
          const productName = itemData.product?.name || itemData.productName || '';
          const categoryName = itemData.product?.category?.name || itemData.categoryName || '';

          // Detect if it's a ticket by multiple methods
          const isTicket = 
            categoryType === 'ticket' || 
            productType === 'ticket_single' || 
            productType === 'ticket_bundle' ||
            productName.toLowerCase().includes('tiket') ||
            categoryName.toLowerCase().includes('tiket') ||
            categoryName.toLowerCase().includes('ticket');

          if (isTicket) {
            // For ticket bundles, multiply by the bundle size
            const bundleQuantity = extractBundleQuantity(productName, productType);
            totalTicketsSold += quantity * bundleQuantity;
          } else {
            // Everything else is merchandise
            totalMerchSold += quantity;
          }
        });
      }
    });

    setStats({
      totalRevenue,
      totalMerchSold,
      totalTicketsSold,
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      acceptedOrders: acceptedOrders.length,
      rejectedOrders: orders.filter(o => o.status === 'rejected').length,
    });
  };

  const calculateSchoolStats = (orders: Order[]) => {
    const acceptedOrders = orders.filter(o => o.status === 'accepted');
    const schoolMap = new Map<string, { count: number; revenue: number }>();

    acceptedOrders.forEach(order => {
      const school = order.user?.schoolOrigin || 'Tidak Diketahui';
      const existing = schoolMap.get(school) || { count: 0, revenue: 0 };
      schoolMap.set(school, {
        count: existing.count + 1,
        revenue: existing.revenue + (Number(order.totalAmount) || 0),
      });
    });

    const stats: SchoolStats[] = Array.from(schoolMap.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 schools

    setSchoolStats(stats);
  };

  const calculateDailySales = (allOrders: Order[]) => {
    const acceptedOrders = allOrders.filter(o => o.status === 'accepted');
    const dailyMap = new Map<string, { revenue: number; orders: number }>();
    
    // Initialize last 7 days
    const days: DailySales[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const label = date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
      dailyMap.set(dateStr, { revenue: 0, orders: 0 });
      days.push({ date: dateStr, label, revenue: 0, orders: 0 });
    }

    // Aggregate orders by date
    acceptedOrders.forEach(order => {
      const dateStr = new Date(order.createdAt).toISOString().split('T')[0];
      if (dailyMap.has(dateStr)) {
        const existing = dailyMap.get(dateStr)!;
        dailyMap.set(dateStr, {
          revenue: existing.revenue + (Number(order.totalAmount) || 0),
          orders: existing.orders + 1,
        });
      }
    });

    // Update days array with actual data
    days.forEach(day => {
      const data = dailyMap.get(day.date);
      if (data) {
        day.revenue = data.revenue;
        day.orders = data.orders;
      }
    });

    setDailySales(days);
  };

  // Extract bundle quantity from product name or type
  const extractBundleQuantity = (productName: string, productType?: string): number => {
    if (productType === 'ticket_single') return 1;
    
    // Try to extract number from product name
    const patterns = [
      /paket\s*(\d+)/i,
      /bundle\s*(\d+)/i,
      /(\d+)\s*tiket/i,
      /tiket\s*x(\d+)/i,
      /x(\d+)/i,
      /(\d+)\s*pax/i,
    ];

    for (const pattern of patterns) {
      const match = productName.match(pattern);
      if (match && match[1]) {
        return parseInt(match[1], 10);
      }
    }

    return 1;
  };

  const formatCurrency = (amount: number) => {
    const safeAmount = Number(amount) || 0;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(safeAmount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      accepted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return styles[status] || styles.pending;
  };

  // Calculate max revenue for chart scaling
  const maxDailyRevenue = useMemo(() => {
    return Math.max(...dailySales.map(d => d.revenue), 1);
  }, [dailySales]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">📊 Dashboard Penjualan</h2>
          <p className="text-slate-500 mt-1">Overview statistik penjualan UIGTC</p>
        </div>
        
        <div className="flex gap-2">
          {(['all', 'today', 'week', 'month'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                dateRange === range
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-200'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {range === 'all' && 'Semua'}
              {range === 'today' && 'Hari Ini'}
              {range === 'week' && '7 Hari'}
              {range === 'month' && 'Bulan Ini'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl shadow-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Total Pendapatan</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-emerald-200 text-xs mt-2">dari {stats.acceptedOrders} order diterima</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-3xl">💰</span>
            </div>
          </div>
        </div>

        {/* Total Merchandise Sold */}
        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-6 text-white shadow-xl shadow-violet-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-violet-100 text-sm font-medium">Merch Terjual</p>
              <p className="text-3xl font-bold mt-2">{stats.totalMerchSold}</p>
              <p className="text-violet-200 text-xs mt-2">item merchandise</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-3xl">👕</span>
            </div>
          </div>
        </div>

        {/* Total Tickets Sold */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl shadow-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Tiket Terjual</p>
              <p className="text-3xl font-bold mt-2">{stats.totalTicketsSold}</p>
              <p className="text-amber-200 text-xs mt-2">tiket (termasuk bundling)</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-3xl">🎫</span>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl shadow-cyan-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
              <p className="text-cyan-200 text-xs mt-2">{stats.pendingOrders} pending</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-3xl">📦</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Sales Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">📈 Penjualan 7 Hari Terakhir</h3>
        
        <div className="h-64 flex items-end justify-between gap-2 px-4">
          {dailySales.map((day) => {
            const heightPercent = maxDailyRevenue > 0 ? (day.revenue / maxDailyRevenue) * 100 : 0;
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                {/* Bar */}
                <div className="w-full relative group">
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-slate-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                      <p className="font-semibold">{formatCurrency(day.revenue)}</p>
                      <p className="text-slate-300">{day.orders} order(s)</p>
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                  </div>
                  
                  {/* Bar itself */}
                  <div 
                    className="w-full bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-lg transition-all duration-300 hover:from-cyan-600 hover:to-cyan-500 cursor-pointer min-h-[4px]"
                    style={{ height: `${Math.max(heightPercent, 2)}%`, maxHeight: '200px' }}
                  />
                </div>
                
                {/* Label */}
                <p className="text-xs text-slate-500 mt-2 text-center">{day.label}</p>
              </div>
            );
          })}
        </div>

        {/* Chart Summary */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-sm">
          <div>
            <span className="text-slate-500">Total 7 Hari:</span>
            <span className="ml-2 font-semibold text-slate-800">
              {formatCurrency(dailySales.reduce((sum, d) => sum + d.revenue, 0))}
            </span>
          </div>
          <div>
            <span className="text-slate-500">Rata-rata Harian:</span>
            <span className="ml-2 font-semibold text-slate-800">
              {formatCurrency(dailySales.reduce((sum, d) => sum + d.revenue, 0) / 7)}
            </span>
          </div>
        </div>
      </div>

      {/* Order Status + School Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Cards */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Status Order</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-slate-600">Pending</span>
              </div>
              <span className="font-bold text-slate-800">{stats.pendingOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-slate-600">Accepted</span>
              </div>
              <span className="font-bold text-slate-800">{stats.acceptedOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-slate-600">Rejected</span>
              </div>
              <span className="font-bold text-slate-800">{stats.rejectedOrders}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6 h-3 bg-slate-100 rounded-full overflow-hidden flex">
            {stats.totalOrders > 0 && (
              <>
                <div 
                  className="bg-emerald-500 h-full transition-all"
                  style={{ width: `${(stats.acceptedOrders / stats.totalOrders) * 100}%` }}
                />
                <div 
                  className="bg-amber-500 h-full transition-all"
                  style={{ width: `${(stats.pendingOrders / stats.totalOrders) * 100}%` }}
                />
                <div 
                  className="bg-red-500 h-full transition-all"
                  style={{ width: `${(stats.rejectedOrders / stats.totalOrders) * 100}%` }}
                />
              </>
            )}
          </div>
        </div>

        {/* School Statistics */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">🏫 Statistik Sekolah</h3>
          
          {schoolStats.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <span className="text-4xl">📭</span>
              <p className="mt-2">Belum ada data sekolah</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
              {schoolStats.map((school, index) => {
                const maxCount = schoolStats[0]?.count || 1;
                const widthPercent = (school.count / maxCount) * 100;
                return (
                  <div key={school.name} className="group">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-amber-100 text-amber-700' :
                          index === 1 ? 'bg-slate-200 text-slate-600' :
                          index === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {index + 1}
                        </span>
                        <span className="text-sm text-slate-700 truncate max-w-[150px]" title={school.name}>
                          {school.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-slate-800">{school.count}</span>
                        <span className="text-xs text-slate-400 ml-1">order</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          index === 0 ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                          index === 1 ? 'bg-gradient-to-r from-slate-300 to-slate-400' :
                          index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                          'bg-gradient-to-r from-cyan-400 to-cyan-500'
                        }`}
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 text-right mt-0.5">
                      {formatCurrency(school.revenue)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Order Terbaru</h3>
        
        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <span className="text-4xl">📭</span>
            <p className="mt-2">Belum ada order</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-slate-500 text-sm border-b border-slate-100">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-mono text-sm text-slate-600">
                      #{order.id.substring(0, 8)}
                    </td>
                    <td className="py-3 text-slate-800">{order.userName}</td>
                    <td className="py-3 font-medium text-slate-800">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-slate-500">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Stats Summary */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">📈 Ringkasan Cepat</h3>
            <p className="text-slate-400 mt-1 text-sm">
              {dateRange === 'all' && 'Statistik keseluruhan'}
              {dateRange === 'today' && 'Statistik hari ini'}
              {dateRange === 'week' && 'Statistik 7 hari terakhir'}
              {dateRange === 'month' && 'Statistik bulan ini'}
            </p>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-400">{stats.acceptedOrders}</p>
              <p className="text-slate-400 text-sm">Diterima</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-400">{stats.pendingOrders}</p>
              <p className="text-slate-400 text-sm">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-cyan-400">
                {stats.totalOrders > 0 
                  ? Math.round((stats.acceptedOrders / stats.totalOrders) * 100) 
                  : 0}%
              </p>
              <p className="text-slate-400 text-sm">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
