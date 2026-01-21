// pages/admin/AdminOrders.tsx
import { useEffect, useState } from 'react';
import { apiCall } from '../../services/api';

type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
    image: string | null;
    category?: {
      name: string;
      type: 'merchandise' | 'ticket';
    };
  };
};

type Order = {
  id: string;
  orderNumber: string;
  userId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  totalAmount: number;
  paymentProof: string | null;
  rejectionReason?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    schoolOrigin?: string;
  };
  rsvpAttendees?: { id: string }[];
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  // Detail modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Action modal
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'reject'>('accept');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data, ok } = await apiCall<{ success: boolean; data: Order[] }>('/admin/orders');
      if (ok && data.success && data.data) {
        // Sort by date descending
        const sortedOrders = data.data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Helper to calculate ticket quota
  const getTicketQuota = (order: Order) => {
    const ticketItems = order.items.filter(item =>
      item.product?.category?.type === 'ticket'
    );
    if (ticketItems.length === 0) return null;

    // Calculate total slots (quantity * bundleQuantity, default 1)
    const totalSlots = ticketItems.reduce((sum, item) => sum + item.quantity, 0);
    const usedSlots = order.rsvpAttendees?.length || 0;
    return { total: totalSlots, used: usedSlots, remaining: totalSlots - usedSlots };
  };

  const openDetailModal = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const openActionModal = (order: Order, action: 'accept' | 'reject') => {
    setSelectedOrder(order);
    setActionType(action);
    setRejectionReason('');
    setShowActionModal(true);
  };

  const handleAction = async () => {
    if (!selectedOrder) return;
    setProcessing(true);

    try {
      // Use POST method with correct endpoints (based on admin.html reference)
      const endpoint = actionType === 'accept'
        ? `/admin/orders/${selectedOrder.id}/accept`
        : `/admin/orders/${selectedOrder.id}/reject`;

      const body = actionType === 'reject' ? { reason: rejectionReason } : undefined;

      const { ok, data } = await apiCall<{ success: boolean; message?: string }>(
        endpoint,
        'POST',
        body
      );

      if (ok && data.success) {
        setShowActionModal(false);
        setShowDetailModal(false);
        loadOrders();
      } else {
        alert(data.message || 'Gagal memproses order');
      }
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Terjadi kesalahan saat memproses order');
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
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
    const styles: Record<string, { bg: string; text: string; icon: string }> = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-800', icon: '⏳' },
      accepted: { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: '✅' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: '❌' },
      cancelled: { bg: 'bg-slate-100', text: 'text-slate-800', icon: '🚫' },
    };
    return styles[status] || styles.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-600">Loading orders...</span>
        </div>
      </div>
    );
  }

  // Export orders to CSV
  const exportToCSV = () => {
    const headers = [
      'Order Number',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'School',
      'Items',
      'Total Amount',
      'Status',
      'Payment Proof',
      'RSVP Used/Total',
      'Created At',
      'Updated At'
    ];

    const csvData = orders.map(order => {
      const ticketItems = order.items.filter(item => item.product?.category?.type === 'ticket');
      const totalSlots = ticketItems.reduce((sum, item) => sum + item.quantity, 0);
      const usedSlots = order.rsvpAttendees?.length || 0;
      const rsvpInfo = totalSlots > 0 ? `${usedSlots}/${totalSlots}` : '-';

      return [
        order.orderNumber || order.id,
        order.user?.name || '-',
        order.user?.email || '-',
        order.user?.phoneNumber || '-',
        order.user?.schoolOrigin || '-',
        order.items.map(item => `${item.product?.name || 'Unknown'} x${item.quantity}`).join(' | '),
        order.totalAmount,
        order.status,
        order.paymentProof ? `https://uigtc.id${order.paymentProof}` : '-',
        rsvpInfo,
        new Date(order.createdAt).toLocaleString('id-ID'),
        new Date(order.updatedAt).toLocaleString('id-ID')
      ];
    });

    // Use semicolon as delimiter for Excel compatibility in Indonesian locale
    const escapeCell = (cell: string | number) => {
      const str = String(cell);
      // Escape quotes and wrap in quotes if contains special chars
      if (str.includes(';') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvContent = [
      headers.join(';'),
      ...csvData.map(row => row.map(escapeCell).join(';'))
    ].join('\r\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">🛒 Manajemen Order</h2>
          <p className="text-slate-500 mt-1">Kelola pesanan pelanggan</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
          <button
            onClick={loadOrders}
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors shadow-lg shadow-cyan-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm">Total Order</p>
          <p className="text-2xl font-bold text-slate-800">{orders.length}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 shadow-sm border border-amber-100">
          <p className="text-amber-600 text-sm">Pending</p>
          <p className="text-2xl font-bold text-amber-800">{orders.filter(o => o.status === 'pending').length}</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4 shadow-sm border border-emerald-100">
          <p className="text-emerald-600 text-sm">Diterima</p>
          <p className="text-2xl font-bold text-emerald-800">{orders.filter(o => o.status === 'accepted').length}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 shadow-sm border border-red-100">
          <p className="text-red-600 text-sm">Ditolak</p>
          <p className="text-2xl font-bold text-red-800">{orders.filter(o => o.status === 'rejected').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari order ID, nama, atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {(['all', 'pending', 'accepted', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === status
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {status === 'all' && 'Semua'}
                {status === 'pending' && '⏳ Pending'}
                {status === 'accepted' && '✅ Diterima'}
                {status === 'rejected' && '❌ Ditolak'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Order Number</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Customer</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Items</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Total</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">RSVP</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Tanggal</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    <span className="text-4xl">📭</span>
                    <p className="mt-2">Tidak ada order ditemukan</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusStyle = getStatusBadge(order.status);
                  const quota = getTicketQuota(order);
                  return (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-slate-800 font-medium">{order.orderNumber || `#${order.id.substring(0, 8)}`}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-800">{order.user?.name || 'Unknown'}</p>
                          <p className="text-xs text-slate-400">{order.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">{order.items.length} item(s)</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-800">{formatCurrency(order.totalAmount)}</span>
                      </td>
                      <td className="px-6 py-4">
                        {quota ? (
                          <div className="text-sm">
                            <span className={`font-medium ${quota.remaining > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                              {quota.used}/{quota.total}
                            </span>
                            <span className="text-slate-400 text-xs ml-1">
                              {quota.remaining > 0 ? `(sisa ${quota.remaining})` : '✓'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                          <span>{statusStyle.icon}</span>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openDetailModal(order)}
                            className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                            title="Lihat Detail"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={() => openActionModal(order, 'accept')}
                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Terima Order"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => openActionModal(order, 'reject')}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Tolak Order"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">📋 Detail Order</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Order Number</p>
                  <p className="font-mono text-slate-800 font-medium">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(selectedOrder.status).bg} ${getStatusBadge(selectedOrder.status).text}`}>
                    {selectedOrder.status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Tanggal Order</p>
                  <p className="text-slate-800">{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total</p>
                  <p className="font-bold text-lg text-emerald-600">{formatCurrency(selectedOrder.totalAmount)}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-800 mb-3">👤 Informasi Customer</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-500">Nama:</span>
                    <span className="ml-2 text-slate-800">{selectedOrder.user?.name || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Email:</span>
                    <span className="ml-2 text-slate-800">{selectedOrder.user?.email || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Phone:</span>
                    <span className="ml-2 text-slate-800">{selectedOrder.user?.phoneNumber || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Sekolah:</span>
                    <span className="ml-2 text-slate-800">{selectedOrder.user?.schoolOrigin || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">📦 Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-slate-50 rounded-lg p-3">
                      <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product?.image ? (
                          <img
                            src={`https://uigtc.id${item.product.image}`}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">{item.product?.name}</p>
                        <p className="text-sm text-slate-500">{formatCurrency(item.price)} × {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-800">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Proof */}
              {selectedOrder.paymentProof && (
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">💳 Bukti Pembayaran</h4>
                  <a
                    href={`https://uigtc.id${selectedOrder.paymentProof}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Lihat Bukti Pembayaran
                  </a>
                </div>
              )}

              {/* Rejection Reason */}
              {selectedOrder.status === 'rejected' && selectedOrder.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">❌ Alasan Penolakan</h4>
                  <p className="text-sm text-red-700">{selectedOrder.rejectionReason}</p>
                </div>
              )}

              {/* Action Buttons */}
              {selectedOrder.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      openActionModal(selectedOrder, 'accept');
                    }}
                    className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    ✅ Terima Order
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      openActionModal(selectedOrder, 'reject');
                    }}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    ❌ Tolak Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">
                {actionType === 'accept' ? '✅ Terima Order' : '❌ Tolak Order'}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-slate-600">
                {actionType === 'accept'
                  ? `Apakah Anda yakin ingin menerima order ${selectedOrder.orderNumber}?`
                  : `Apakah Anda yakin ingin menolak order ${selectedOrder.orderNumber}?`}
              </p>

              {actionType === 'reject' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Alasan Penolakan</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Masukkan alasan penolakan..."
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 h-24 resize-none"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleAction}
                  disabled={processing || (actionType === 'reject' && !rejectionReason.trim())}
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${actionType === 'accept'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-red-600 hover:bg-red-700'
                    }`}
                >
                  {processing && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {actionType === 'accept' ? 'Terima' : 'Tolak'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
