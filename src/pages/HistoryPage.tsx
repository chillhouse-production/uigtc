import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HistoryBG from '../assets/history-bg.svg';
import Navbar from '../salman/navBar';
import Footer from '../salman/footer';
import { useAuth } from '../context/AuthContext';
import { ordersApi, type Order } from '../config/api';

export default function HistoryPage() {
    const navigate = useNavigate();
    
    // --- STATE & LOGIC ---
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Perbaikan: State error dideklarasikan dan sekarang akan digunakan di bawah
    const [error, setError] = useState<string | null>(null);

    // Fetch Data
    useEffect(() => {
        if (authLoading) return;
        
        if (!user) {
            setLoading(false);
            return;
        }

        async function fetchOrders() {
            try {
                // Reset error sebelum fetch ulang (opsional tapi praktik bagus)
                setError(null);
                
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

    // --- HELPERS ---
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': 
            case 'waiting_payment':
                return 'bg-[#FCD34D] text-[#1a3c40]'; 
            case 'completed': 
            case 'payment_accepted':
                return 'bg-[#6EE7B7] text-[#1a3c40]'; 
            case 'rejected': 
            case 'cancelled':
                return 'bg-[#EF4444] text-white'; 
            case 'payment_review':
                return 'bg-blue-400 text-white';
            default: 
                return 'bg-gray-400 text-white';
        }
    };

    const getStatusLabel = (status: string) => {
        return status.replace(/_/g, ' ').toUpperCase();
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const formatCurrency = (price: number) => new Intl.NumberFormat('id-ID').format(price);

    // --- RENDER CONDITIONALS ---
    
    // 1. Loading State
    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
                 <img src={HistoryBG} alt="Background" className="fixed inset-0 w-full h-full object-cover z-0" />
                 <div className="relative z-10 bg-[#F8FDFF] p-8 rounded-lg shadow-md border border-[#E5F6F8]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a3c40] mx-auto mb-4"></div>
                    <p className="font-serif text-[#1a3c40]">Memuat riwayat...</p>
                 </div>
            </div>
        );
    }

    // 2. Not Login State
    if (!user) {
        return (
            <div className="min-h-screen flex flex-col relative overflow-hidden">
                <img src={HistoryBG} alt="Background" className="fixed inset-0 w-full h-full object-cover z-0" />
                <Navbar />
                <div className="relative z-10 flex-1 flex items-center justify-center p-4">
                    <div className="bg-[#F8FDFF] p-8 rounded-lg shadow-md border border-[#E5F6F8] text-center max-w-md w-full">
                        <h2 className="text-2xl font-bold font-serif text-[#1a3c40] mb-4">Login Required</h2>
                        <button onClick={() => navigate('/auth')} className="px-6 py-2 bg-[#1a3c40] text-white rounded font-serif hover:opacity-90 transition-opacity">
                            Login Sekarang
                        </button>
                    </div>
                </div>
                <Footer />
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

            <div className="relative z-50 w-full pt-13">
                <Navbar />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-[1200px] p-4 md:p-8 flex flex-col items-center flex-1 pt-24">
                
                {/* Header Title */}
                <div className="flex items-center justify-center w-full mb-10 relative">
                      <div className="text-center">
                        <h1
                            className="text-6xl md:text-7xl font-['Pirata_One'] text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] tracking-wider"
                            style={{
                                textShadow: '-1px -1px 0 #1a3c40, 1px -1px 0 #1a3c40, -1px 1px 0 #1a3c40, 1px 1px 0 #1a3c40'
                            }}
                        >
                            ORDER HISTORY
                        </h1>
                    </div>
                </div>

                {/* Orders List */}
                <div className="w-full space-y-6 mb-12">
                    {/* Perbaikan: Menampilkan Error Banner jika ada error */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    {orders.length === 0 && !error ? (
                        <div className="bg-[#F8FDFF] rounded-lg shadow-md border border-[#E5F6F8] p-10 text-center">
                            <p className="font-serif text-[#1a3c40] text-xl mb-4">Belum ada riwayat pesanan.</p>
                            <button 
                                onClick={() => navigate('/merchlist')}
                                className="px-6 py-2 bg-[#e89c3f] text-[#1a3c40] font-bold rounded shadow hover:bg-[#d68b2e] transition-colors"
                            >
                                Mulai Belanja
                            </button>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order.id} className="bg-[#F8FDFF] rounded-lg shadow-md border border-[#E5F6F8] relative transition-transform hover:-translate-y-1 duration-300">
                                
                                {/* Card Header */}
                                <div className="px-6 py-4 border-b border-[#E5F6F8] flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full md:w-auto">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-[#1a3c40] font-serif text-sm">Order ID:</span>
                                            <span className="font-serif text-[#1a3c40] text-sm tracking-wide bg-gray-100 px-2 rounded">#{order.id.substring(0, 8)}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {/* Status Badge */}
                                            <span className={`px-4 py-0.5 rounded-full text-xs font-bold ${getStatusColor(order.status)} font-serif tracking-wide uppercase`}>
                                                {getStatusLabel(order.status)}
                                            </span>

                                            {/* Rejected Tooltip */}
                                            {order.status === 'rejected' && (
                                                <div className="group relative cursor-help ml-1">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="10"></circle>
                                                        <line x1="12" y1="16" x2="12" y2="12"></line>
                                                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                                    </svg>
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] bg-white text-[#1a3c40] text-xs rounded-lg shadow-lg p-3 border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 text-left">
                                                        <p className="font-bold mb-1 font-serif text-red-600">Alasan Penolakan:</p>
                                                        <p className="font-serif">{order.rejectionReason || 'Tidak ada alasan spesifik.'}</p>
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                        <span className="font-bold text-[#1a3c40] font-serif text-sm opacity-75">
                                            {formatDate(order.createdAt)}
                                        </span>
                                        
                                    </div>
                                </div>

                                {/* Card Items */}
                                <div className="px-6 py-4 space-y-4">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex gap-4 items-center">
                                            {/* Image with Fallback */}
                                            <div className="w-20 h-14 rounded-md shadow-sm bg-gradient-to-br from-teal-400 to-teal-600 overflow-hidden flex-shrink-0">
                                                {item.product?.image && (
                                                    <img 
                                                        src={`https://uigtc.id${item.product.image}`}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} 
                                                    />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-[#1a3c40] font-serif text-base md:text-lg line-clamp-1">{item.product?.name}</h3>
                                                <p className="text-xs font-bold text-[#8B8B8B] font-serif">Rp {formatCurrency(item.price)}</p>
                                            </div>
                                            <div className="px-2 py-1 border border-gray-300 rounded text-xs font-bold text-gray-500 font-serif whitespace-nowrap">
                                                {item.quantity} x
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Card Footer */}
                                <div className="px-6 py-4 border-t border-[#E5F6F8] flex justify-end items-center gap-2">
                                    <span className="font-bold text-[#1a3c40] font-serif text-sm">Total Harga:</span>
                                    <span className="font-bold text-[#e89c3f] font-serif text-xl">Rp {formatCurrency(order.totalAmount)}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="relative z-50 w-full">
                <Footer />
            </div>
        </div>
    );
}