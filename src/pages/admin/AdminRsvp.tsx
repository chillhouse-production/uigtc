import { useState, useEffect } from 'react';
import { apiCall } from '../../services/api';

type RsvpAttendee = {
    id: string;
    name: string;
    schoolOrigin: string;
    whatsappNumber: string;
    email: string;
    ticketCode: string;
    orderNumber: string;
    checkedIn: boolean;
    checkedInAt: string | null;
    createdAt: string;
};

type IncompleteOrder = {
    orderNumber: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    totalQuota: number;
    registeredCount: number;
    remainingQuota: number;
    createdAt: string;
};

export default function AdminRsvp() {
    const [attendees, setAttendees] = useState<RsvpAttendee[]>([]);
    const [incompleteOrders, setIncompleteOrders] = useState<IncompleteOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'attendees' | 'incomplete'>('attendees');
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [attendeesRes, incompleteRes] = await Promise.all([
                apiCall<{ success: boolean; data: RsvpAttendee[]; total: number }>('/rsvp/admin/attendees', 'GET'),
                apiCall<{ success: boolean; data: IncompleteOrder[]; total: number }>('/rsvp/admin/incomplete', 'GET'),
            ]);

            if (attendeesRes.ok && attendeesRes.data.success) {
                setAttendees(attendeesRes.data.data);
            }
            if (incompleteRes.ok && incompleteRes.data.success) {
                setIncompleteOrders(incompleteRes.data.data);
            }
        } catch {
            setError('Terjadi kesalahan');
        } finally {
            setLoading(false);
        }
    };

    const toggleCheckIn = async (attendeeId: string) => {
        setProcessingId(attendeeId);
        try {
            const { data, ok } = await apiCall<{
                success: boolean;
                data: { id: string; checkedIn: boolean; checkedInAt: string | null };
            }>(`/rsvp/admin/checkin/${attendeeId}`, 'POST');

            if (ok && data.success) {
                setAttendees(attendees.map(att =>
                    att.id === attendeeId
                        ? { ...att, checkedIn: data.data.checkedIn, checkedInAt: data.data.checkedInAt }
                        : att
                ));
            }
        } catch {
            alert('Gagal mengubah status kehadiran');
        } finally {
            setProcessingId(null);
        }
    };

    const filteredAttendees = attendees.filter((att) => {
        const query = searchQuery.toLowerCase();
        return (
            att.name.toLowerCase().includes(query) ||
            att.schoolOrigin.toLowerCase().includes(query) ||
            att.email.toLowerCase().includes(query) ||
            att.whatsappNumber.includes(query) ||
            att.ticketCode.toLowerCase().includes(query) ||
            att.orderNumber.toLowerCase().includes(query)
        );
    });

    const filteredIncomplete = incompleteOrders.filter((order) => {
        const query = searchQuery.toLowerCase();
        return (
            order.orderNumber.toLowerCase().includes(query) ||
            order.userName.toLowerCase().includes(query) ||
            order.userEmail.toLowerCase().includes(query)
        );
    });

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const exportToCsv = () => {
        const headers = ['Nama', 'Sekolah', 'No. WA', 'Email Aktif'];
        const rows = filteredAttendees.map((att) => [
            att.name,
            att.schoolOrigin,
            att.whatsappNumber,
            att.email,
        ]);

        // Use semicolon as delimiter for Excel compatibility and add UTF-8 BOM
        const csvContent = [headers, ...rows].map(row => row.join(';')).join('\n');
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `rsvp-attendees-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    // Stats
    const checkedInCount = attendees.filter(a => a.checkedIn).length;
    const notCheckedInCount = attendees.length - checkedInCount;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">🎫 Manajemen RSVP</h1>
                    <p className="text-gray-500 mt-1">Kelola pendaftaran dan kehadiran peserta</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchData}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        🔄 Refresh
                    </button>
                    <button
                        onClick={exportToCsv}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                        📥 Export CSV
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-blue-600 font-medium">Total Terdaftar</p>
                    <p className="text-3xl font-bold text-blue-900">{attendees.length}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-sm text-green-600 font-medium">Sudah Hadir</p>
                    <p className="text-3xl font-bold text-green-900">{checkedInCount}</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4">
                    <p className="text-sm text-amber-600 font-medium">Belum Hadir</p>
                    <p className="text-3xl font-bold text-amber-900">{notCheckedInCount}</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4">
                    <p className="text-sm text-red-600 font-medium">Belum RSVP</p>
                    <p className="text-3xl font-bold text-red-900">
                        {incompleteOrders.reduce((sum, o) => sum + o.remainingQuota, 0)} slot
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('attendees')}
                        className={`pb-3 px-1 border-b-2 font-medium transition-colors ${activeTab === 'attendees'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        ✅ Peserta Terdaftar ({attendees.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('incomplete')}
                        className={`pb-3 px-1 border-b-2 font-medium transition-colors ${activeTab === 'incomplete'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        ⚠️ Belum Lengkap RSVP ({incompleteOrders.length})
                    </button>
                </nav>
            </div>

            {/* Search */}
            <div className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={activeTab === 'attendees'
                        ? "Cari nama, sekolah, email, WA, atau kode tiket..."
                        : "Cari order number atau nama user..."}
                    className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    {error}
                </div>
            )}

            {/* Attendees Table */}
            {activeTab === 'attendees' && (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Hadir</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nama</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Sekolah</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">No. WA</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Kode Tiket</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredAttendees.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                            {searchQuery ? 'Tidak ada hasil untuk pencarian tersebut' : 'Belum ada data RSVP'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAttendees.map((att) => (
                                        <tr key={att.id} className={`hover:bg-gray-50 ${att.checkedIn ? 'bg-green-50/50' : ''}`}>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => toggleCheckIn(att.id)}
                                                    disabled={processingId === att.id}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${att.checkedIn
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                                        } ${processingId === att.id ? 'opacity-50 cursor-wait' : ''}`}
                                                    title={att.checkedIn ? 'Batalkan kehadiran' : 'Tandai hadir'}
                                                >
                                                    {processingId === att.id ? (
                                                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                    ) : att.checkedIn ? (
                                                        <span className="text-lg">✓</span>
                                                    ) : (
                                                        <span className="text-lg">○</span>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-gray-900">{att.name}</p>
                                                {att.checkedIn && att.checkedInAt && (
                                                    <p className="text-xs text-green-600">Check-in: {formatDate(att.checkedInAt)}</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{att.schoolOrigin}</td>
                                            <td className="px-4 py-3">
                                                <a href={`https://wa.me/${att.whatsappNumber.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:underline">
                                                    {att.whatsappNumber}
                                                </a>
                                            </td>
                                            <td className="px-4 py-3">
                                                <a href={`mailto:${att.email}`} className="text-sm text-blue-600 hover:underline">
                                                    {att.email}
                                                </a>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="font-mono text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded">
                                                    {att.ticketCode}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs font-mono text-gray-500">{att.orderNumber}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Incomplete Orders Table */}
            {activeTab === 'incomplete' && (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order Number</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Pembeli</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Kontak</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status RSVP</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal Order</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredIncomplete.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                            {searchQuery ? 'Tidak ada hasil' : '🎉 Semua order tiket sudah lengkap RSVP!'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredIncomplete.map((order) => (
                                        <tr key={order.orderNumber} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <span className="font-mono text-sm font-medium text-gray-900">{order.orderNumber}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-gray-900">{order.userName}</p>
                                                <p className="text-xs text-gray-500">{order.userEmail}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                {order.userPhone && (
                                                    <a href={`https://wa.me/${order.userPhone.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:underline">
                                                        {order.userPhone}
                                                    </a>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {order.registeredCount}/{order.totalQuota}
                                                    </span>
                                                    <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                                                        Sisa {order.remainingQuota}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
