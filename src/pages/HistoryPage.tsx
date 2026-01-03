import { useState, useEffect } from 'react';
import HistoryBG from '../assets/history-bg.svg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersApi, type Order } from '../config/api';
import Navbar from '../salman/navBar';
import Footer from '../salman/footer';

export default function HistoryPage() {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;
        
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
            case 'pending': return 'bg-[#FCD34D] text-[#1a3c40]';
            case 'waiting_payment': return 'bg-[#3B82F6] text-white';
            case 'payment_review': return 'bg-[#8B5CF6] text-white';
            case 'completed': return 'bg-[#6EE7B7] text-[#1a3c40]';
            case 'rejected': return 'bg-[#EF4444] text-white';
            case 'cancelled': return 'bg-gray-500 text-white';
            default: return 'bg-gray-400 text-white';
        }
    };

    const getStatusLabel = (status: string) => {
        return status.replace(/_/g, ' ').toUpperCase();
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

    // --- RENDER LOADING ---
    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
                <img src={HistoryBG} alt="Background" className="absolute inset-0 w-full h-full object-cover z-0" />
                <div className="relative z-10 text-center bg-white/90 p-8 rounded-2xl shadow-xl">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a3c40] mx-auto"></div>
                    <p className="mt-4 text-[#1a3c40]">Memuat pesanan...</p>
                </div>
            </div>
        );
    }

    // --- RENDER LOGIN PROMPT ---
    if (!user) {
        return (
            <div className="min-h-screen flex flex-col relative">
                <img src={HistoryBG} alt="Background" className="fixed inset-0 w-full h-full object-cover z-0" />
                <Navbar />
                <div className="relative z-10 flex-1 flex items-center justify-center p-4">
                    <div className="text-center bg-white/90 p-8 rounded-2xl shadow-xl max-w-md w-full">
                        <h2 className="text-2xl font-bold text-[#1a3c40] mb-4">Anda harus login terlebih dahulu</h2>
                        <p className="text-gray-600 mb-6">Silakan login untuk melihat riwayat pesanan Anda</p>
                        <button 
                            onClick={() => navigate('/auth')} 
                            className="px-8 py-2 bg-[#1a3c40] text-white rounded-lg font-bold hover:bg-[#0d2526] transition-colors w-full"
                        >
                            Login
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // --- RENDER ERROR ---
    if (error) {
        return (
            <div className="min-h-screen flex flex-col relative">
                <img src={HistoryBG} alt="Background" className="fixed inset-0 w-full h-full object-cover z-0" />
                <Navbar />
                <div className="relative z-10 flex-1 flex items-center justify-center p-4">
                    <div className="text-center bg-white/90 p-8 rounded-2xl shadow-xl">
                        <p className="text-red-500 mb-4 font-bold">{error}</p>
                        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[#1a3c40] text-white rounded-lg hover:bg-[#0d2526]">
                            Coba Lagi
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // --- RENDER MAIN CONTENT ---
    return (
        <div className="min-h-screen flex flex-col relative">
            {/* Background Image (Fixed) */}
            <img
                src={HistoryBG}
                alt="Background"
                className="fixed inset-0 w-full h-full object-cover z-0"
            />

            {/* Navbar (Z-Index Higher) */}
            <div className="relative z-50">
                <Navbar />
            </div>

            {/* Main Content Area (Flex-1 pushes Footer down) */}
            <main className="relative z-10 flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-8 pt-24 md:pt-32 flex flex-col items-center">
                
                {/* Header Title */}
                <div className="flex items-center justify-center w-full mb-10">
                    <h1
                        className="text-5xl md:text-7xl font-['Pirata_One'] text-white drop-shadow-xl tracking-wider text-center"
                        style={{
                            textShadow: '2px 2px 0 #1a3c40, -1px -1px 0 #1a3c40, 2px 4px 8px rgba(0,0,0,0.5)'
                        }}
                    >
                        ORDER HISTORY
                    </h1>
                </div>

                {/* Orders List */}
                <div className="w-full space-y-6 mb-12">
                    {orders.length === 0 ? (
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-10 text-center border-2 border-[#1a3c40]/10">
                            <div className="text-6xl mb-4">📜</div>
                            <p className="text-[#1a3c40] font-serif text-xl font-bold mb-2">Belum ada pesanan</p>
                            <p className="text-gray-500 mb-6">Yuk, mulai belanja merchandise keren kami!</p>
                            <button 
                                onClick={() => navigate('/merchlist')}
                                className="px-8 py-3 bg-[#CD853F] hover:bg-[#B8732F] text-white rounded-xl font-bold transition-transform hover:scale-105 shadow-lg"
                            >
                                Belanja Sekarang
                            </button>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order.id} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white overflow-hidden transition-transform hover:translate-y-[-2px] hover:shadow-2xl">
                                {/* Card Header */}
                                <div className="px-6 py-4 bg-[#F0FDF4]/50 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500 text-xs uppercase tracking-wider font-bold">Order ID</span>
                                            <span className="font-mono text-[#1a3c40] font-bold bg-gray-100 px-2 py-1 rounded text-sm">#{order.id.substring(0, 8)}</span>
                                        </div>
                                        <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
                                        <div className="text-sm text-gray-600 font-medium">
                                            {formatDate(order.createdAt)}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${getStatusColor(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                        {/* Jika status Pending/Waiting, tampilkan tombol Bayar */}
                                        {['PENDING_PAYMENT', 'waiting_payment'].includes(order.status) && (
                                            <button 
                                                onClick={() => navigate(`/checkout?orderId=${order.id}`)}
                                                className="px-4 py-1 bg-[#CD853F] text-white text-xs font-bold rounded-full hover:bg-[#B8732F] transition-colors shadow-sm animate-pulse"
                                            >
                                                Bayar Sekarang →
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Rejection Note (Conditional) */}
                                {order.status === 'rejected' && order.rejectionReason && (
                                    <div className="px-6 py-3 bg-red-50 border-b border-red-100 flex items-start gap-3">
                                        <span className="text-red-500 text-lg">⚠️</span>
                                        <div>
                                            <p className="text-red-800 text-sm font-bold">Pesanan Ditolak</p>
                                            <p className="text-red-600 text-sm">{order.rejectionReason}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Card Items */}
                                <div className="p-6 space-y-4">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex gap-4 items-center group">
                                            {/* Image */}
                                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 bg-gray-50">
                                                {item.product?.image ? (
                                                    <img 
                                                        src={`https://uigtc.id${item.product.image}`}
                                                        alt={item.product?.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Img'; }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                                                )}
                                            </div>
                                            
                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-[#1a3c40] text-sm md:text-base mb-1 line-clamp-2">
                                                    {item.product?.name || 'Unknown Product'}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">
                                                        {item.quantity} x
                                                    </span>
                                                    <span className="text-[#CD853F] font-bold">
                                                        Rp{formatCurrency(item.price)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Card Footer */}
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-gray-500 text-sm font-medium">Total Pembayaran</span>
                                    <span className="text-xl font-bold text-[#1a3c40]">
                                        Rp{formatCurrency(order.totalAmount)}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* Footer (Z-Index Higher) */}
            <div className="relative z-50">
                <Footer />
            </div>
        </div>
    );
}