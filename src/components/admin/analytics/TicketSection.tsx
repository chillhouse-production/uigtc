import type { TicketAnalytics } from "../../../services/analytics";

interface Props {
    data: TicketAnalytics | null;
    loading: boolean;
}

export default function TicketSection({ data, loading }: Props) {
    if (loading || !data) return <div>Loading...</div>;

    const schoolList = Object.entries(data.salesBySchool).sort(([, a], [, b]) => b - a);
    const typeList = Object.entries(data.salesByType).sort(([, a], [, b]) => b - a);

    return (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">🎫 Analisis Tiket</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* By School */}
                <div>
                    <h3 className="font-semibold text-gray-600 mb-4">Penjualan per Sekolah</h3>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-80 overflow-y-auto">
                        {schoolList.map(([school, count]) => (
                            <div key={school} className="flex justify-between items-center py-2 border-b last:border-0 border-gray-200">
                                <span className="text-sm font-medium truncat md:max-w-xs">{school}</span>
                                <span className="text-sm font-bold bg-white px-2 py-0.5 rounded shadow-sm">{count}</span>
                            </div>
                        ))}
                        {schoolList.length === 0 && <p className="text-sm text-gray-400 italic">Belum ada data sekolah.</p>}
                    </div>
                </div>

                {/* By Type */}
                <div>
                    <h3 className="font-semibold text-gray-600 mb-4">Jenis Tiket</h3>
                    <div className="space-y-3">
                        {typeList.map(([type, count]) => (
                            <div key={type} className="relative pt-1">
                                <div className="flex mb-2 items-center justify-between">
                                    <div>
                                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                            {type}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-semibold inline-block text-blue-600">
                                            {count}
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                                    <div style={{ width: `${(count / data.totalTicketsSold) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
