import { AnalyticsOverview } from "../../../services/analytics";

interface Props {
    data: AnalyticsOverview | null;
    loading: boolean;
}

export default function OverviewCards({ data, loading }: Props) {
    if (loading || !data) {
        return <div className="p-4">Loading overview...</div>;
    }

    const cards = [
        { label: "Total Revenue", value: data.totalRevenue, color: "bg-blue-100 text-blue-800" },
        { label: "Ticket Revenue", value: data.ticketRevenue, color: "bg-green-100 text-green-800" },
        { label: "Merch Revenue", value: data.merchRevenue, color: "bg-purple-100 text-purple-800" },
        { label: "Total Transactions", value: data.totalTransactions, color: "bg-gray-100 text-gray-800", isCurrency: false },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card, idx) => (
                <div key={idx} className={`p-6 rounded-lg shadow-sm ${card.color}`}>
                    <h3 className="text-sm font-semibold uppercase tracking-wider opacity-75">{card.label}</h3>
                    <p className="text-2xl font-bold mt-2">
                        {card.isCurrency !== false
                            ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(card.value)
                            : card.value}
                    </p>
                </div>
            ))}
        </div>
    );
}
