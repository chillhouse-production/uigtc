import type { TransferAudit } from "../../../services/analytics";

interface Props {
    data: TransferAudit | null;
    loading: boolean;
}

export default function TransferSection({ data, loading }: Props) {
    if (loading || !data) return <div>Loading audit...</div>;

    const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

    return (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🏦 Transfer & Audit Rekap
            </h2>
            <p className="text-sm text-gray-500 mb-6">
                Simulasi pemisahan dana berdasarkan jenis produk dalam pesanan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="border p-4 rounded-lg bg-green-50 border-green-200">
                    <h3 className="text-lg font-semibold text-green-800">Dana Tiket (Estimasi)</h3>
                    <p className="text-3xl font-bold text-green-900 mt-2">{formatIDR(data.ticketFundTotal)}</p>
                    <p className="text-xs text-green-700 mt-1">Harus masuk ke Rekening A</p>
                </div>
                <div className="border p-4 rounded-lg bg-purple-50 border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-800">Dana Merch (Estimasi)</h3>
                    <p className="text-3xl font-bold text-purple-900 mt-2">{formatIDR(data.merchFundTotal)}</p>
                    <p className="text-xs text-purple-700 mt-1">Harus masuk ke Rekening B</p>
                </div>
            </div>

            {data.mixedOrdersCount > 0 && (
                <div className="border-t pt-6">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    <span className="font-bold">⚠️ Perhatian:</span> Ditemukan {data.mixedOrdersCount} transaksi yang menggabungkan Tiket & Merchandise. Total dana tercampur.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm whitespace-nowrap">
                            <thead className="uppercase tracking-wider border-b-2 border-gray-100 bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-gray-600 font-bold">Order ID</th>
                                    <th className="px-6 py-3 text-gray-600 font-bold">Total</th>
                                    <th className="px-6 py-3 text-green-600 font-bold">Bagian Tiket</th>
                                    <th className="px-6 py-3 text-purple-600 font-bold">Bagian Merch</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.mixedOrders.map((order) => (
                                    <tr key={order.orderId} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium font-mono">{order.orderId}</td>
                                        <td className="px-6 py-4 font-bold">{formatIDR(order.total)}</td>
                                        <td className="px-6 py-4 text-green-700">{formatIDR(order.ticketPart)}</td>
                                        <td className="px-6 py-4 text-purple-700">{formatIDR(order.merchPart)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
