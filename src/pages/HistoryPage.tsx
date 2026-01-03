import { useState, useEffect } from 'react';
import HistoryBG from '../assets/history-bg.svg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersApi, API_BASE_URL, type Order } from '../config/api';

export default function HistoryPage() {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Wait for auth to finish loading
        if (authLoading) return;
        
        // If not logged in, don't fetch orders
        if (!user) {
            setLoading(false);
            return;
        }

        async function fetchOrders() {
            try {
                const response = await ordersApi.getMyOrders();
                if (response.success && response.data) {
                    setOrders(response.data);
                } else {
                    setError(response.message || 'Gagal mengambil data pesanan');
                }
            } catch (err) {
                console.error('Failed to fetch orders:', err);
                setError(err instanceof Error ? err.message : 'Gagal mengambil data pesanan');
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, [user, authLoading]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-[#FCD34D] text-white';
            case 'waiting_payment': return 'bg-[#3B82F6] text-white';
            case 'payment_review': return 'bg-[#8B5CF6] text-white';
            case 'completed': return 'bg-[#6EE7B7] text-white';
            case 'rejected': return 'bg-[#EF4444] text-white';
            case 'cancelled': return 'bg-gray-500 text-white';
            default: return 'bg-gray-400 text-white';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'Pending';
            case 'waiting_payment': return 'Waiting Payment';
            case 'payment_review': return 'Payment Review';
            case 'completed': return 'Completed';
            case 'rejected': return 'Rejected';
            case 'cancelled': return 'Cancelled';
            default: return status;
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (price: number) => {
        return new Intl.NumberFormat('id-ID').format(price);
    };

    // Show loading while auth is being checked
    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${HistoryBG})`, backgroundSize: 'cover' }}>
                <div className="text-center bg-white/90 p-8 rounded-2xl">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a3c40] mx-auto"></div>
                    <p className="mt-4 text-[#1a3c40]">Memuat pesanan...</p>
                </div>
            </div>
        );
    }

    // Show login prompt if not logged in
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${HistoryBG})`, backgroundSize: 'cover' }}>
                <div className="text-center bg-white/90 p-8 rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-bold text-[#1a3c40] mb-4">Anda harus login terlebih dahulu</h2>
                    <p className="text-gray-600 mb-6">Silakan login untuk melihat riwayat pesanan Anda</p>
                    <button 
                        onClick={() => navigate('/auth')} 
                        className="px-8 py-2 bg-[#1a3c40] text-white rounded-lg font-bold hover:bg-[#0d2526] transition-colors"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${HistoryBG})`, backgroundSize: 'cover' }}>
                <div className="text-center bg-white/90 p-8 rounded-2xl">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[#1a3c40] text-white rounded-lg">
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen overflow-auto relative flex flex-col items-center">
            {/* Background Image */}
            <img
                src={HistoryBG}
                alt="Background"
                className="fixed inset-0 w-full h-full object-cover z-0"
            />

            {/* Content */}
            <div className="relative z-10 w-full max-w-[1200px] p-4 md:p-8 flex flex-col items-center">
                {/* Header */}
                <div className="flex items-center justify-between w-full mb-8 relative">
                    <button onClick={() => navigate('/')} className="hover:opacity-75 transition-opacity">
                        {/* Back Button Placeholder if needed, but not in visual reference explicitly, keeping logic simple */}
                    </button>

                    {/* Title with Bird/Decoration? Using user's text style reference */}
                    <div className="flex-1 text-center">
                        <h1
                            className="text-6xl md:text-7xl font-['Pirata_One'] text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] tracking-wider"
                            style={{
                                textShadow: '-1px -1px 0 #1a3c40, 1px -1px 0 #1a3c40, -1px 1px 0 #1a3c40, 1px 1px 0 #1a3c40'
                            }}
                        >
                            ORDER HISTORY
                        </h1>
                    </div>
                    <div className="w-[40px]"></div> {/* Spacer for centering if back button exists */}
                </div>


                {/* Orders List */}
                <div className="w-full space-y-6">
                    {orders.length === 0 ? (
                        <div className="bg-[#F8FDFF] rounded-lg shadow-md p-8 text-center">
                            <p className="text-[#1a3c40] font-serif text-lg">Belum ada pesanan</p>
                            <button 
                                onClick={() => navigate('/merchlist')}
                                className="mt-4 px-6 py-2 bg-[#1a3c40] text-white rounded-lg font-serif"
                            >
                                Belanja Sekarang
                            </button>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order.id} className="bg-[#F8FDFF] rounded-lg shadow-md border border-[#E5F6F8] relative">
                                {/* Card Header */}
                                <div className="px-6 py-4 border-b border-[#E5F6F8] flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className="font-bold text-[#1a3c40] font-serif text-sm">Order ID:</span>
                                        <span className="font-serif text-[#1a3c40] text-sm tracking-wide">{order.id.substring(0, 8)}...</span>

                                        <span className={`px-4 py-0.5 rounded-full text-xs font-bold ${getStatusColor(order.status)} font-serif tracking-wide ml-2`}>
                                            {getStatusLabel(order.status)}
                                        </span>

                                        {order.status === 'rejected' && order.rejectionReason && (
                                            <div className="group relative cursor-help ml-1">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a3c40" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                                </svg>

                                                {/* Tooltip */}
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] bg-white text-[#1a3c40] text-xs rounded-lg shadow-lg p-3 border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 text-left">
                                                    <p className="font-bold mb-1 font-serif">Alasan Penolakan:</p>
                                                    <p className="font-serif">{order.rejectionReason}</p>
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white"></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <span className="font-bold text-[#1a3c40] font-serif text-sm">{formatDate(order.createdAt)}</span>
                                </div>

                                {/* Card Items */}
                                <div className="px-6 py-4 space-y-4">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex gap-4 items-center">
                                            {item.product?.image ? (
                                                <img 
                                                    src={`${API_BASE_URL.replace('/api', '')}${item.product.image}`}
                                                    alt={item.product?.name}
                                                    className="w-20 h-14 rounded-md shadow-sm object-cover"
                                                />
                                            ) : (
                                                <div className="w-20 h-14 rounded-md shadow-sm from-teal-400 to-teal-600 bg-gradient-to-br flex items-center justify-center text-white">
                                                    📦
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h3 className="font-bold text-[#1a3c40] font-serif text-lg">{item.product?.name || 'Product'}</h3>
                                                <p className="text-xs font-bold text-[#8B8B8B] font-serif">Rp{formatCurrency(item.price)}</p>
                                            </div>
                                            <div className="px-2 py-1 border border-gray-400 rounded text-xs font-bold text-gray-500 font-serif">
                                                {item.quantity}x
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Card Footer */}
                                <div className="px-6 py-4 border-t border-[#E5F6F8] flex flex-col items-end">
                                    <span className="font-bold text-[#1a3c40] font-serif text-sm">Total Harga:</span>
                                    <span className="font-bold text-[#1a3c40] font-serif text-xl">Rp{formatCurrency(order.totalAmount)}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
