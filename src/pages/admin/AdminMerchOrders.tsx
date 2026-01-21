// pages/admin/AdminMerchOrders.tsx
import { useEffect, useState, useMemo } from 'react';
import { apiCall } from '../../services/api';

type OrderItem = {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
    product?: {
        id: string;
        name: string;
        image: string | null;
        productType?: string;
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
};

// Type for merch summary
type MerchSummary = {
    name: string;
    quantity: number;
    revenue: number;
};

export default function AdminMerchOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

    // Detail modal
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const { data, ok } = await apiCall<{ success: boolean; data: Order[] }>('/admin/orders');
            if (ok && data.success && data.data) {
                // Filter orders that contain merchandise items
                const merchOrders = data.data.filter(order =>
                    order.items.some(item =>
                        item.product?.category?.type === 'merchandise' ||
                        item.product?.productType === 'merchandise'
                    )
                );
                // Sort by date descending
                const sortedOrders = merchOrders.sort(
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

    // Calculate merchandise summary
    const merchSummary = useMemo(() => {
        const summary: Record<string, MerchSummary> = {};

        orders.filter(o => o.status === 'accepted').forEach(order => {
            order.items.forEach(item => {
                if (item.product?.category?.type === 'merchandise' || item.product?.productType === 'merchandise') {
                    const name = item.productName || item.product?.name || 'Unknown Product';
                    if (!summary[name]) {
                        summary[name] = { name, quantity: 0, revenue: 0 };
                    }
                    summary[name].quantity += item.quantity;
                    summary[name].revenue += Number(item.subtotal) || (item.price * item.quantity);
                }
            });
        });

        return Object.values(summary).sort((a, b) => b.quantity - a.quantity);
    }, [orders]);

    const totalMerchSold = useMemo(() =>
        merchSummary.reduce((sum, item) => sum + item.quantity, 0),
        [merchSummary]
    );

    const totalMerchRevenue = useMemo(() =>
        merchSummary.reduce((sum, item) => sum + item.revenue, 0),
        [merchSummary]
    );

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Get merchandise items only from an order
    const getMerchItems = (order: Order) => {
        return order.items.filter(item =>
            item.product?.category?.type === 'merchandise' ||
            item.product?.productType === 'merchandise'
        );
    };

    const openDetailModal = (order: Order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
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
                    <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-slate-600">Loading merchandise orders...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">👕 Merchandise Orders</h2>
                    <p className="text-slate-500 mt-1">Kelola pesanan merchandise</p>
                </div>
                <button
                    onClick={loadOrders}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>

            {/* Merchandise Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">📊 Ringkasan Merchandise Terjual</h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-purple-50 rounded-xl p-4">
                        <p className="text-purple-600 text-sm">Total Item Terjual</p>
                        <p className="text-2xl font-bold text-purple-800">{totalMerchSold}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4">
                        <p className="text-emerald-600 text-sm">Total Revenue</p>
                        <p className="text-2xl font-bold text-emerald-800">{formatCurrency(totalMerchRevenue)}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-blue-600 text-sm">Jumlah Produk</p>
                        <p className="text-2xl font-bold text-blue-800">{merchSummary.length}</p>
                    </div>
                </div>

                {/* Product List */}
                <div className="max-h-64 overflow-y-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 sticky top-0">
                            <tr>
                                <th className="text-left px-4 py-2 text-sm font-semibold text-slate-600">#</th>
                                <th className="text-left px-4 py-2 text-sm font-semibold text-slate-600">Produk</th>
                                <th className="text-right px-4 py-2 text-sm font-semibold text-slate-600">Qty Terjual</th>
                                <th className="text-right px-4 py-2 text-sm font-semibold text-slate-600">Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {merchSummary.map((item, idx) => (
                                <tr key={item.name} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 text-sm text-slate-500">{idx + 1}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{item.name}</td>
                                    <td className="px-4 py-3 text-sm text-right font-bold text-purple-600">{item.quantity}</td>
                                    <td className="px-4 py-3 text-sm text-right text-emerald-600">{formatCurrency(item.revenue)}</td>
                                </tr>
                            ))}
                            {merchSummary.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                                        Belum ada merchandise terjual
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                    <p className="text-slate-500 text-sm">Total Order Merch</p>
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
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
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
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Merchandise</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Total</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Bukti Bayar</th>
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
                                        <p className="mt-2">Tidak ada order merchandise ditemukan</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => {
                                    const statusStyle = getStatusBadge(order.status);
                                    const merchItems = getMerchItems(order);
                                    const merchTotal = merchItems.reduce((sum, item) =>
                                        sum + (Number(item.subtotal) || item.price * item.quantity), 0
                                    );
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
                                                <div className="max-w-xs">
                                                    {merchItems.slice(0, 2).map((item, idx) => (
                                                        <p key={idx} className="text-sm text-slate-600 truncate">
                                                            {item.productName || item.product?.name} × {item.quantity}
                                                        </p>
                                                    ))}
                                                    {merchItems.length > 2 && (
                                                        <p className="text-xs text-slate-400">+{merchItems.length - 2} lainnya</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-slate-800">{formatCurrency(merchTotal)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {order.paymentProof ? (
                                                    <a
                                                        href={`https://uigtc.id${order.paymentProof}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        Lihat
                                                    </a>
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
                                                        className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                        title="Lihat Detail"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </button>
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
                            <h3 className="text-xl font-bold text-slate-800">📋 Detail Order Merchandise</h3>
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
                                    <p className="text-sm text-slate-500">Total Merch</p>
                                    <p className="font-bold text-lg text-purple-600">
                                        {formatCurrency(getMerchItems(selectedOrder).reduce((sum, item) =>
                                            sum + (Number(item.subtotal) || item.price * item.quantity), 0
                                        ))}
                                    </p>
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

                            {/* Merchandise Items */}
                            <div>
                                <h4 className="font-semibold text-slate-800 mb-3">👕 Merchandise Items</h4>
                                <div className="space-y-3">
                                    {getMerchItems(selectedOrder).map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 bg-purple-50 rounded-lg p-3">
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
                                                <p className="font-medium text-slate-800">{item.productName || item.product?.name}</p>
                                                <p className="text-sm text-slate-500">{formatCurrency(item.price)} × {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-purple-600">{formatCurrency(Number(item.subtotal) || item.price * item.quantity)}</p>
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
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
