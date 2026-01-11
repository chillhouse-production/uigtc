import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../services/api';

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

type RsvpStatusData = {
    orderNumber: string;
    status: string;
    totalQuota: number;
    registeredCount: number;
    remainingQuota: number;
    attendees: AttendeeData[];
    ticketItems: TicketItem[];
};

export default function RsvpStatusPage() {
    const navigate = useNavigate();
    const [orderNumber, setOrderNumber] = useState('');
    const [statusData, setStatusData] = useState<RsvpStatusData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [checked, setChecked] = useState(false);

    const handleCheckStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setStatusData(null);

        try {
            const { data, ok } = await apiCall<{
                success: boolean;
                data: RsvpStatusData;
                message?: string;
            }>(`/rsvp/status/${orderNumber}`, 'GET');

            if (ok && data.success) {
                setStatusData(data.data);
                setChecked(true);

                // If no attendees registered and has remaining quota, redirect to RSVP
                if (data.data.registeredCount === 0 && data.data.remainingQuota > 0) {
                    // Show message then redirect
                    setError('Belum ada peserta yang terdaftar untuk order ini. Mengarahkan ke halaman RSVP...');
                    setTimeout(() => {
                        navigate(`/rsvp?order=${orderNumber}`);
                    }, 2000);
                }
            } else {
                setError(data.message || 'Order tidak ditemukan');
                setChecked(true);
            }
        } catch {
            setError('Terjadi kesalahan. Silakan coba lagi.');
            setChecked(true);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-slate-800 text-center">
                        🎟️ Cek Status RSVP
                    </h1>
                    <p className="text-sm text-slate-500 text-center mt-1">
                        Lihat bukti pendaftaran dan kode tiket Anda
                    </p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Search Form */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 mb-6">
                    <form onSubmit={handleCheckStatus} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Masukkan Order Number
                            </label>
                            <input
                                type="text"
                                value={orderNumber}
                                onChange={(e) => {
                                    setOrderNumber(e.target.value.toUpperCase());
                                    setChecked(false);
                                }}
                                placeholder="Contoh: UIGTC-M5WXK8NG-D5RE"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-center font-mono text-lg"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !orderNumber.trim()}
                            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            )}
                            {loading ? 'Memeriksa...' : 'Cek Status RSVP'}
                        </button>
                    </form>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
                        ⚠️ {error}
                    </div>
                )}

                {/* Status Results */}
                {statusData && statusData.registeredCount > 0 && (
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm text-slate-500">Order Number</p>
                                    <p className="font-mono text-lg font-bold text-emerald-600">
                                        {statusData.orderNumber}
                                    </p>
                                </div>
                                <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                                    ✓ {statusData.registeredCount}/{statusData.totalQuota} Terdaftar
                                </span>
                            </div>

                            {/* Ticket Items */}
                            <div className="bg-slate-50 rounded-xl p-4 mb-4">
                                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Tiket yang Dibeli</p>
                                {statusData.ticketItems.map((item, i) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <span className="text-slate-700">{item.productName}</span>
                                        <span className="text-slate-500">{item.quantity}x ({item.totalSlots} slot)</span>
                                    </div>
                                ))}
                            </div>

                            {/* Remaining Quota Alert */}
                            {statusData.remainingQuota > 0 && (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-amber-800 font-medium">Masih ada {statusData.remainingQuota} slot tersisa</p>
                                        <p className="text-amber-600 text-sm">Daftarkan peserta lainnya sekarang</p>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/rsvp?order=${orderNumber}`)}
                                        className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors text-sm"
                                    >
                                        Daftar Lagi
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Registered Attendees - Ticket Cards */}
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">
                                🎫 Tiket Terdaftar ({statusData.registeredCount})
                            </h3>
                            <div className="space-y-4">
                                {statusData.attendees.map((attendee, i) => (
                                    <div
                                        key={attendee.id}
                                        className="relative bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-1"
                                    >
                                        <div className="bg-white rounded-xl p-4">
                                            {/* Ticket Header */}
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-lg font-bold">
                                                        {i + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-800">{attendee.name}</p>
                                                        <p className="text-sm text-slate-500">{attendee.schoolOrigin}</p>
                                                    </div>
                                                </div>
                                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                                                    VALID
                                                </span>
                                            </div>

                                            {/* Ticket Code - Main Focus */}
                                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 text-center mb-3 border-2 border-dashed border-emerald-200">
                                                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Kode Tiket</p>
                                                <p className="text-xl font-bold font-mono text-emerald-600 select-all tracking-wider">
                                                    {attendee.ticketCode}
                                                </p>
                                            </div>

                                            {/* Contact Info */}
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="bg-slate-50 rounded-lg p-2">
                                                    <p className="text-xs text-slate-400">WhatsApp</p>
                                                    <p className="text-slate-700 font-medium">{attendee.whatsappNumber}</p>
                                                </div>
                                                <div className="bg-slate-50 rounded-lg p-2">
                                                    <p className="text-xs text-slate-400">Email</p>
                                                    <p className="text-slate-700 font-medium truncate">{attendee.email}</p>
                                                </div>
                                            </div>

                                            {/* Registration Time */}
                                            <p className="text-xs text-slate-400 mt-3 text-right">
                                                Terdaftar: {formatDate(attendee.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="bg-slate-50 rounded-2xl p-6 text-center">
                            <p className="text-slate-600 text-sm">
                                📱 Screenshot halaman ini sebagai bukti pendaftaran<br />
                                🎫 Tunjukkan <strong>Kode Tiket</strong> saat registrasi di venue
                            </p>
                        </div>
                    </div>
                )}

                {/* No Results */}
                {checked && !statusData && !error && (
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">🔍</span>
                        </div>
                        <p className="text-slate-600">Order tidak ditemukan</p>
                        <button
                            onClick={() => navigate('/rsvp')}
                            className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                        >
                            Daftar RSVP
                        </button>
                    </div>
                )}

                {/* Navigation */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/rsvp')}
                        className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                    >
                        ← Kembali ke halaman RSVP
                    </button>
                </div>
            </div>
        </div>
    );
}
