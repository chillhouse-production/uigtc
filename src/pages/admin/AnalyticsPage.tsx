import { useEffect, useState } from "react";
import { AnalyticsOverview, AnalyticsService, MerchAnalytics, TicketAnalytics, TransferAudit } from "../../services/analytics";
import OverviewCards from "../../components/admin/analytics/OverviewCards";
import TicketSection from "../../components/admin/analytics/TicketSection";
import MerchSection from "../../components/admin/analytics/MerchSection";
import TransferSection from "../../components/admin/analytics/TransferSection";

export default function AnalyticsPage() {
    const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
    const [tickets, setTickets] = useState<TicketAnalytics | null>(null);
    const [merch, setMerch] = useState<MerchAnalytics | null>(null);
    const [transfer, setTransfer] = useState<TransferAudit | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [ov, tk, mc, tr] = await Promise.all([
                AnalyticsService.getOverview(),
                AnalyticsService.getTicketAnalytics(),
                AnalyticsService.getMerchAnalytics(),
                AnalyticsService.getTransferAudit()
            ]);

            if (ov.ok) setOverview(ov.data);
            if (tk.ok) setTickets(tk.data);
            if (mc.ok) setMerch(mc.data);
            if (tr.ok) setTransfer(tr.data);
        } catch (error) {
            console.error("Failed to load analytics", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Sales Analytics Dashboard</h1>
                <button
                    onClick={fetchData}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm font-medium"
                >
                    Diff Refresh
                </button>
            </div>

            <OverviewCards data={overview} loading={loading} />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <TicketSection data={tickets} loading={loading} />
                <MerchSection data={merch} loading={loading} />
            </div>

            <TransferSection data={transfer} loading={loading} />
        </div>
    );
}
