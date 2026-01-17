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
    createdAt: string;
};

export default function AdminRsvp() {
    const [attendees, setAttendees] = useState<RsvpAttendee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchAttendees();
    }, []);

    const fetchAttendees = async () => {
        setLoading(true);
        try {
            const { data, ok } = await apiCall<{ success: boolean; data: RsvpAttendee[]; total: number }>('/rsvp/admin/attendees', 'GET');
            if (ok && data.success) {
                setAttendees(data.data);
            } else {
                setError('Gagal mengambil data RSVP');
            }
        } catch {
            setError('Terjadi kesalahan');
        } finally {
            setLoading(false);
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
        const headers = ['No', 'Nama', 'Asal Sekolah', 'No. WhatsApp', 'Email', 'Kode Tiket', 'Order Number', 'Tanggal Daftar'];
        const rows = filteredAttendees.map((att, i) => [
            i + 1,
            att.name,
            att.schoolOrigin,
            att.whatsappNumber,
            att.email,
            att.ticketCode,
            att.orderNumber,
            formatDate(att.createdAt),
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `rsvp-attendees-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

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
                    <h1 className="text-2xl font-bold text-gray-900">Daftar RSVP</h1>
                    <p className="text-gray-500 mt-1">Total: {attendees.length} peserta terdaftar</p>
                </div>
                <button
                    onClick={exportToCsv}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export CSV
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama, sekolah, email, WA, atau kode tiket..."
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

            {/* Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">No</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nama</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Sekolah</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">No. WA</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Kode Tiket</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAttendees.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                                        {searchQuery ? 'Tidak ada hasil untuk pencarian tersebut' : 'Belum ada data RSVP'}
                                    </td>
                                </tr>
                            ) : (
                                filteredAttendees.map((att, i) => (
                                    <tr key={att.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-900">{att.name}</p>
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
                                        <td className="px-4 py-3 text-xs text-gray-500">{formatDate(att.createdAt)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-blue-600 font-medium">Total Peserta</p>
                    <p className="text-3xl font-bold text-blue-900">{attendees.length}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-sm text-green-600 font-medium">Order Unik</p>
                    <p className="text-3xl font-bold text-green-900">
                        {new Set(attendees.map(a => a.orderNumber)).size}
                    </p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4">
                    <p className="text-sm text-amber-600 font-medium">Hasil Pencarian</p>
                    <p className="text-3xl font-bold text-amber-900">{filteredAttendees.length}</p>
                </div>
            </div>
        </div>
    );
}
