import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiCall } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../config/api';
import Navbar from '../salman/navBar';
import Footer from '../salman/footer';
import HistoryBG from '../assets/history-bg.svg';

type AttendeeData = {
    id: string;
    name: string;
    email: string;
    schoolOrigin: string;
    whatsappNumber: string;
    ticketCode: string;
    createdAt: string;
};

type TicketItem = {
    productName: string;
    quantity: number;
    capacity: number;
    totalSlots: number;
};

type OrderValidationData = {
    orderNumber: string;
    status: string;
    totalQuota: number;
    registeredCount: number;
    remainingQuota: number;
    attendees: AttendeeData[];
    ticketItems: TicketItem[];
};

// Countdown target: 24 Jan 2026, 08:00 WITA (UTC+8)
const EVENT_DATE = new Date('2026-01-24T08:00:00+08:00');

function useCountdown(targetDate: Date) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const diff = targetDate.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                clearInterval(interval);
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return timeLeft;
}

export default function RsvpPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const countdown = useCountdown(EVENT_DATE);

    const [step, setStep] = useState<'verify' | 'form' | 'success' | 'view-tickets'>('verify');
    const [orderNumber, setOrderNumber] = useState('');
    const [orderData, setOrderData] = useState<OrderValidationData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [checkingExisting, setCheckingExisting] = useState(true);

    // User's orders with RSVP
    const [userRsvpOrders, setUserRsvpOrders] = useState<OrderValidationData[]>([]);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        schoolOrigin: '',
        whatsappNumber: '',
        email: '',
    });

    // Success state
    const [successData, setSuccessData] = useState<{
        ticketCode: string;
        name: string;
        remainingQuota: number;
    } | null>(null);

    // Auto-fill order from URL parameter
    useEffect(() => {
        const orderParam = searchParams.get('order');
        if (orderParam) {
            setOrderNumber(orderParam.toUpperCase());
        }
    }, [searchParams]);

    // Check if logged-in user has existing RSVP
    useEffect(() => {
        async function checkUserRsvp() {
            if (authLoading) return;

            if (!user) {
                setCheckingExisting(false);
                return;
            }

            try {
                const ordersResponse = await ordersApi.getMyOrders();
                if (ordersResponse.success && ordersResponse.data) {
                    const acceptedOrders = ordersResponse.data.filter(o => o.status === 'accepted');

                    const rsvpDataPromises = acceptedOrders.map(async (order) => {
                        try {
                            const { data, ok } = await apiCall<{ success: boolean; data: OrderValidationData }>(`/rsvp/status/${order.orderNumber}`, 'GET');
                            if (ok && data.success && data.data.registeredCount > 0) {
                                return data.data;
                            }
                        } catch {
                            // Ignore errors for individual orders
                        }
                        return null;
                    });

                    const rsvpResults = await Promise.all(rsvpDataPromises);
                    const validRsvps = rsvpResults.filter((r): r is OrderValidationData => r !== null);

                    if (validRsvps.length > 0) {
                        setUserRsvpOrders(validRsvps);
                        setStep('view-tickets');
                    }
                }
            } catch (err) {
                console.error('Error checking user RSVP:', err);
            } finally {
                setCheckingExisting(false);
            }
        }

        checkUserRsvp();
    }, [user, authLoading]);

    const handleVerifyOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, ok } = await apiCall<{ success: boolean; data: OrderValidationData; message?: string }>('/rsvp/validate', 'POST', { orderNumber });

            if (ok && data.success) {
                setOrderData(data.data);
                if (data.data.remainingQuota > 0) {
                    setStep('form');
                } else {
                    setError('Kuota RSVP untuk order ini sudah penuh');
                }
            } else {
                setError(data.message || 'Order tidak valid');
            }
        } catch {
            setError('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitRsvp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, ok } = await apiCall<{
                success: boolean;
                message: string;
                data: { ticketCode: string; name: string; remainingQuota: number };
            }>('/rsvp/register', 'POST', {
                orderNumber: orderData?.orderNumber,
                ...formData,
            });

            if (ok && data.success) {
                setSuccessData(data.data);
                setStep('success');
            } else {
                setError(data.message || 'Gagal mendaftarkan RSVP');
            }
        } catch {
            setError('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterAnother = () => {
        setFormData({ name: '', schoolOrigin: '', whatsappNumber: '', email: '' });
        setSuccessData(null);
        setStep('form');
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const eventStarted = useMemo(() => new Date() >= EVENT_DATE, []);

    // Must be logged in to access RSVP
    if (!authLoading && !user) {
        return (
            <div className="min-h-screen overflow-auto relative flex flex-col">
                <img src={HistoryBG} alt="Background" className="fixed inset-0 w-full h-full object-cover z-0" />
                <div className="relative z-50 w-full">
                    <Navbar />
                </div>
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
                        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">🔐</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Login Diperlukan</h2>
                        <p className="text-gray-600 mb-6">Silakan login terlebih dahulu untuk melakukan RSVP</p>
                        <button
                            onClick={() => navigate('/auth')}
                            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all"
                        >
                            Login Sekarang
                        </button>
                    </div>
                </div>
                <div className="relative z-10">
                    <Footer />
                </div>
            </div>
        );
    }

    // Loading state
    if (authLoading || checkingExisting) {
        return (
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
                <img src={HistoryBG} alt="Background" className="fixed inset-0 w-full h-full object-cover z-0" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    <p className="text-white text-lg">Memuat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen overflow-auto relative flex flex-col">
            <img src={HistoryBG} alt="Background" className="fixed inset-0 w-full h-full object-cover z-0" />
            <div className="relative z-50 w-full">
                <Navbar />
            </div>

            <div className="relative z-10 flex-1 flex flex-col items-center px-4 pt-24 pb-8">
                <div className="w-full max-w-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2" style={{ fontFamily: 'treamd', textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
                            🎫 RSVP UIGTC
                        </h1>
                        <p className="text-white/80">Daftarkan peserta untuk tiket Anda</p>
                    </div>

                    {/* Countdown */}
                    {!eventStarted && (
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
                            <p className="text-center text-white/80 text-sm mb-3">Menuju Hari H</p>
                            <div className="grid grid-cols-4 gap-3">
                                {[
                                    { value: countdown.days, label: 'Hari' },
                                    { value: countdown.hours, label: 'Jam' },
                                    { value: countdown.minutes, label: 'Menit' },
                                    { value: countdown.seconds, label: 'Detik' },
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/20 rounded-xl p-3 text-center">
                                        <p className="text-3xl font-bold text-white">{item.value.toString().padStart(2, '0')}</p>
                                        <p className="text-xs text-white/70">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                            <p className="text-center text-white/60 text-xs mt-3">24 Januari 2026, 08:00 WITA</p>
                        </div>
                    )}

                    {/* View Existing Tickets */}
                    {step === 'view-tickets' && userRsvpOrders.length > 0 && (
                        <div className="space-y-6">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center">
                                <p className="text-white">✅ Anda sudah terdaftar RSVP!</p>
                            </div>

                            {userRsvpOrders.map((order) => (
                                <div key={order.orderNumber} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-xs opacity-80">Order Number</p>
                                                <p className="font-mono font-bold">{order.orderNumber}</p>
                                            </div>
                                            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                                                {order.registeredCount}/{order.totalQuota} Terdaftar
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-3">
                                        {order.attendees.map((att, i) => (
                                            <div key={att.id} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold">
                                                            {i + 1}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-800">{att.name}</p>
                                                            <p className="text-sm text-gray-500">{att.schoolOrigin}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-3 bg-white rounded-lg p-3 text-center border-2 border-dashed border-amber-300">
                                                    <p className="text-xs text-gray-500 mb-1">Kode Tiket</p>
                                                    <p className="text-xl font-bold font-mono text-amber-600">{att.ticketCode}</p>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-2 text-right">
                                                    Registered: {formatDate(att.createdAt)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Step 1: Verify Order */}
                    {step === 'verify' && (
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Masukkan Order Number</h2>

                            <form onSubmit={handleVerifyOrder} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        value={orderNumber}
                                        onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                                        placeholder="Contoh: UIGTC-M5WXK8NG-D5RE"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-center font-mono text-lg"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-2 text-center">
                                        Temukan order number di halaman Riwayat Pesanan
                                    </p>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !orderNumber.trim()}
                                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                    {loading ? 'Memverifikasi...' : 'Verifikasi Order'}
                                </button>
                            </form>

                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => navigate('/history')}
                                    className="w-full py-2 text-amber-600 hover:text-amber-700 font-medium text-sm"
                                >
                                    Lihat Riwayat Pesanan →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Registration Form */}
                    {step === 'form' && orderData && (
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-6 border border-amber-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-gray-500">Order</p>
                                        <p className="font-mono font-bold text-amber-600">{orderData.orderNumber}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                                        Sisa: {orderData.remainingQuota} slot
                                    </span>
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-gray-800 mb-4">Data Peserta</h2>

                            <form onSubmit={handleSubmitRsvp} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Asal Sekolah</label>
                                    <input
                                        type="text"
                                        value={formData.schoolOrigin}
                                        onChange={(e) => setFormData({ ...formData, schoolOrigin: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">No. WhatsApp Aktif</label>
                                    <input
                                        type="tel"
                                        value={formData.whatsappNumber}
                                        onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                        placeholder="08xxxxxxxxxx"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Aktif</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        required
                                    />
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setStep('verify')}
                                        className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Kembali
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-[2] py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                        {loading ? 'Mendaftarkan...' : 'Daftar RSVP'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Step 3: Success */}
                    {step === 'success' && successData && orderData && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <span className="text-4xl">🎉</span>
                                </div>
                                <h2 className="text-2xl font-bold text-white" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>RSVP Berhasil!</h2>
                                <p className="text-white/80 mt-1">Simpan tiket Anda</p>
                            </div>

                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-xs opacity-80">E-Ticket</p>
                                            <h3 className="text-xl font-bold">UIGTC 2026</h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs opacity-80">Order</p>
                                            <p className="font-mono font-bold">{orderData.orderNumber}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="absolute left-0 w-4 h-4 bg-[#1a1a2e] rounded-full -translate-x-1/2"></div>
                                    <div className="absolute right-0 w-4 h-4 bg-[#1a1a2e] rounded-full translate-x-1/2"></div>
                                    <div className="border-t-2 border-dashed border-gray-200 mx-4"></div>
                                </div>

                                <div className="px-6 py-6">
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-500 mb-1">Nama Peserta</p>
                                        <p className="text-xl font-bold text-gray-800">{successData.name}</p>
                                    </div>

                                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 text-center border-2 border-dashed border-amber-300">
                                        <p className="text-xs text-gray-500 mb-2">KODE TIKET</p>
                                        <p className="text-3xl font-bold font-mono text-amber-600 select-all tracking-wider">
                                            {successData.ticketCode}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-3">📱 Tunjukkan kode ini di venue</p>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <p className="text-xs text-gray-400">Status</p>
                                            <p className="text-green-600 font-semibold flex items-center gap-1">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                Confirmed
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <p className="text-xs text-gray-400">Sisa Kuota</p>
                                            <p className="text-gray-700 font-semibold">{successData.remainingQuota} peserta</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 px-6 py-4 text-center">
                                    <p className="text-xs text-gray-400">📸 Screenshot sebagai bukti pendaftaran</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
}
