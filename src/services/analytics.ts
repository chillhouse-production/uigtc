import { apiCall } from './api';

export interface AnalyticsOverview {
    totalRevenue: number;
    ticketRevenue: number;
    merchRevenue: number;
    totalTransactions: number;
}

export interface TicketAnalytics {
    totalTicketsSold: number;
    totalRevenue: number;
    salesBySchool: Record<string, number>;
    salesByType: Record<string, number>;
}

export interface MerchAnalytics {
    totalItemsSold: number;
    totalRevenue: number;
    topProducts: { name: string; count: number }[];
    salesByProduct: Record<string, number>;
}

export interface MixedOrder {
    orderId: string;
    total: number;
    ticketPart: number;
    merchPart: number;
    user: string;
}

export interface TransferAudit {
    ticketFundTotal: number;
    merchFundTotal: number;
    mixedOrdersCount: number;
    mixedOrders: MixedOrder[];
}

export const AnalyticsService = {
    getOverview: async () => {
        return apiCall<AnalyticsOverview>('/admin/analytics/overview');
    },
    getTicketAnalytics: async () => {
        return apiCall<TicketAnalytics>('/admin/analytics/tickets');
    },
    getMerchAnalytics: async () => {
        return apiCall<MerchAnalytics>('/admin/analytics/merch');
    },
    getTransferAudit: async () => {
        return apiCall<TransferAudit>('/admin/analytics/transfers');
    },
};
