import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiCall } from '../services/api';

type AttendeeData = {
    id: string;
    name: string;
    email: string;
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

export default function RsvpPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [step, setStep] = useState<'verify' | 'form' | 'success'>('verify');
    const [orderNumber, setOrderNumber] = useState('');
    const [orderData, setOrderData] = useState<OrderValidationData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Auto-fill order from URL parameter
    useEffect(() => {
        const orderParam = searchParams.get('order');
        if (orderParam) {
            setOrderNumber(orderParam.toUpperCase());
        }
    }, [searchParams]);

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

    const handleValidateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, ok } = await apiCall<{
                success: boolean;
                data: OrderValidationData;
                message?: string;
            }>('/rsvp/validate', 'POST', { orderNumber });

            if (ok && data.success) {
                setOrderData(data.data);
                if (data.data.remainingQuota > 0) {
                    setStep('form');
                } else {
                    setError('Kuota peserta untuk order ini sudah penuh');
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
                data: {
                    ticketCode: string;
                    name: string;
                    remainingQuota: number;
                };
            }>('/rsvp/register', 'POST', {
                orderNumber,
                ...formData,
            });

            if (ok && data.success) {
                setSuccessData(data.data);
                setStep('success');
            } else {
                setError(data.message || 'Gagal mendaftarkan peserta');
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
        // Refresh order data
        handleValidateOrder({ preventDefault: () => { } } as React.FormEvent);
    };

    const handleStartOver = () => {
        setStep('verify');
        setOrderNumber('');
        setOrderData(null);
        setFormData({ name: '', schoolOrigin: '', whatsappNumber: '', email: '' });
        setSuccessData(null);
        setError('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-amber-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-slate-800 text-center">
                        🎫 RSVP Tiket UIGTC
                    </h1>
                    <p className="text-sm text-slate-500 text-center mt-1">
                        Daftarkan data peserta untuk tiket Anda
                    </p>
                    <div className="flex justify-center mt-2">
                        <button
                            onClick={() => navigate('/rsvp/status')}
                            className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                        >
                            Sudah RSVP? Cek status tiket →
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Progress Indicator */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {['verify', 'form', 'success'].map((s, i) => (
                        <div key={s} className="flex items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step === s
                                    ? 'bg-violet-600 text-white'
                                    : i < ['verify', 'form', 'success'].indexOf(step)
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-slate-200 text-slate-500'
                                    }`}
                            >
                                {i + 1}
                            </div>
                            {i < 2 && (
                                <div
                                    className={`w-12 h-1 mx-1 rounded ${i < ['verify', 'form', 'success'].indexOf(step)
                                        ? 'bg-emerald-500'
                                        : 'bg-slate-200'
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                        ⚠️ {error}
                    </div>
                )}

                {/* Step 1: Verify Order */}
                {step === 'verify' && (
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">
                            Masukkan Nomor Order
                        </h2>
                        <form onSubmit={handleValidateOrder} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Order Number
                                </label>
                                <input
                                    type="text"
                                    value={orderNumber}
                                    onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                                    placeholder="Contoh: UIGTC-M5WXK8NG-D5RE"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-center font-mono text-lg"
                                    required
                                />
                                <p className="mt-2 text-xs text-slate-500">
                                    Order Number dapat dilihat di halaman Riwayat Pesanan
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !orderNumber.trim()}
                                className="w-full py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading && (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                )}
                                {loading ? 'Memverifikasi...' : 'Verifikasi Order'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 2: Register Form */}
                {step === 'form' && orderData && (
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                                Ringkasan Order
                            </h3>
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-mono text-lg font-bold text-violet-600">
                                    {orderData.orderNumber}
                                </span>
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                                    ✓ Terverifikasi
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-slate-50 rounded-xl p-3">
                                    <div className="text-2xl font-bold text-slate-800">{orderData.totalQuota}</div>
                                    <div className="text-xs text-slate-500">Total Kuota</div>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3">
                                    <div className="text-2xl font-bold text-emerald-600">{orderData.registeredCount}</div>
                                    <div className="text-xs text-slate-500">Terdaftar</div>
                                </div>
                                <div className="bg-violet-50 rounded-xl p-3">
                                    <div className="text-2xl font-bold text-violet-600">{orderData.remainingQuota}</div>
                                    <div className="text-xs text-slate-500">Tersisa</div>
                                </div>
                            </div>
                        </div>

                        {/* Registration Form */}
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">
                                Data Peserta #{orderData.registeredCount + 1}
                            </h2>
                            <form onSubmit={handleSubmitRsvp} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Nama Lengkap *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Asal Sekolah *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.schoolOrigin}
                                        onChange={(e) => setFormData({ ...formData, schoolOrigin: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        No. WhatsApp Aktif *
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.whatsappNumber}
                                        onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                        placeholder="08xxxxxxxxxx"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Email Aktif *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                                        required
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleStartOver}
                                        className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                                    >
                                        Kembali
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-[2] py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading && (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        )}
                                        {loading ? 'Mendaftar...' : 'Daftarkan Peserta'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Already Registered */}
                        {orderData.attendees.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                                    Peserta Terdaftar ({orderData.attendees.length})
                                </h3>
                                <div className="space-y-2">
                                    {orderData.attendees.map((attendee, i) => (
                                        <div
                                            key={attendee.id}
                                            className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-sm font-medium">
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-800">{attendee.name}</div>
                                                    <div className="text-xs text-slate-500 font-mono">{attendee.ticketCode}</div>
                                                </div>
                                            </div>
                                            <span className="text-emerald-600 text-sm">✓</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 3: Success - Show Ticket */}
                {step === 'success' && successData && orderData && (
                    <div className="space-y-6">
                        {/* Success Header */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">🎉</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800">RSVP Berhasil!</h2>
                            <p className="text-slate-500 mt-1">Simpan tiket Anda di bawah ini</p>
                        </div>

                        {/* Ticket Card */}
                        <div className="relative">
                            {/* Ticket Border Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-amber-500 rounded-3xl blur-sm opacity-50"></div>

                            <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-violet-700 rounded-3xl p-1">
                                <div className="bg-white rounded-[22px] overflow-hidden">
                                    {/* Ticket Header */}
                                    <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-violet-200 text-xs uppercase tracking-wider">E-Ticket</p>
                                                <h3 className="text-xl font-bold">UIGTC 2026</h3>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-violet-200 text-xs">Order</p>
                                                <p className="font-mono font-bold">{orderData.orderNumber}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ticket Tear Line */}
                                    <div className="relative">
                                        <div className="absolute left-0 w-4 h-4 bg-violet-50 rounded-full -translate-x-1/2"></div>
                                        <div className="absolute right-0 w-4 h-4 bg-violet-50 rounded-full translate-x-1/2"></div>
                                        <div className="border-t-2 border-dashed border-slate-200 mx-4"></div>
                                    </div>

                                    {/* Ticket Body */}
                                    <div className="px-6 py-6">
                                        {/* Attendee Info */}
                                        <div className="mb-6">
                                            <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Nama Peserta</p>
                                            <p className="text-xl font-bold text-slate-800">{successData.name}</p>
                                        </div>

                                        {/* Ticket Code - Main Focus */}
                                        <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 text-center border-2 border-violet-100">
                                            <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Kode Tiket</p>
                                            <p className="text-3xl font-bold font-mono text-violet-600 select-all tracking-wider">
                                                {successData.ticketCode}
                                            </p>
                                            <p className="text-slate-400 text-xs mt-3">
                                                📱 Tunjukkan kode ini saat registrasi di venue
                                            </p>
                                        </div>

                                        {/* Additional Info */}
                                        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                                            <div className="bg-slate-50 rounded-xl p-3">
                                                <p className="text-slate-400 text-xs">Status</p>
                                                <p className="text-emerald-600 font-semibold flex items-center gap-1">
                                                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                                    Confirmed
                                                </p>
                                            </div>
                                            <div className="bg-slate-50 rounded-xl p-3">
                                                <p className="text-slate-400 text-xs">Sisa Kuota</p>
                                                <p className="text-slate-700 font-semibold">{successData.remainingQuota} peserta</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ticket Footer */}
                                    <div className="bg-slate-50 px-6 py-4 text-center">
                                        <p className="text-xs text-slate-400">
                                            📸 Screenshot halaman ini sebagai bukti pendaftaran
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            {successData.remainingQuota > 0 ? (
                                <>
                                    <button
                                        onClick={() => navigate('/rsvp/status')}
                                        className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                                    >
                                        Lihat Semua Tiket
                                    </button>
                                    <button
                                        onClick={handleRegisterAnother}
                                        className="flex-[2] py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors"
                                    >
                                        Daftarkan Peserta Lain ({successData.remainingQuota} slot)
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => navigate('/rsvp/status')}
                                    className="w-full py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors"
                                >
                                    Lihat Semua Tiket
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
