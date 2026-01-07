import { MerchAnalytics } from "../../../services/analytics";

interface Props {
    data: MerchAnalytics | null;
    loading: boolean;
}

export default function MerchSection({ data, loading }: Props) {
    if (loading || !data) return <div>Loading...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">👕 Analisis Merchandise</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="font-semibold text-gray-600 mb-4">Top 5 Produk Terlaris</h3>
                    <ul className="divide-y divide-gray-100">
                        {data.topProducts.map((prod, idx) => (
                            <li key={idx} className="flex items-center justify-between py-3">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                                        {idx + 1}
                                    </span>
                                    <span className="text-sm text-gray-800 font-medium">{prod.name}</span>
                                </div>
                                <span className="text-sm font-bold text-purple-600">{prod.count} terjual</span>
                            </li>
                        ))}
                        {data.topProducts.length === 0 && <p className="text-gray-400 italic">Belum ada penjualan merch.</p>}
                    </ul>
                </div>

                <div>
                    {/* Placeholder for more merch details */}
                    <div className="bg-purple-50 p-6 rounded-lg text-center h-full flex flex-col items-center justify-center">
                        <p className="text-purple-800 font-bold text-2xl">{data.totalItemsSold}</p>
                        <p className="text-purple-600 text-sm">Total Item Terjual</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
