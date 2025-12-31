import HistoryBG from '../assets/history-bg.svg';
import { useNavigate } from 'react-router-dom';

export default function HistoryPage() {
    const navigate = useNavigate();

    // Mock Data based on the reference image
    const orders = [
        {
            id: "ASDNWFOQFNQ",
            status: "Pending",
            date: "31 December 2025 12.59",
            items: [
                { id: 1, name: "Baju Bagus Wow", price: 1000000, quantity: 1, image: "bg-teal-500" },
                { id: 2, name: "Tiket", price: 1000000, quantity: 3, image: "bg-teal-500" },
                { id: 3, name: "Celana", price: 1000000, quantity: 1, image: "bg-teal-500" },
            ],
            total: 4000000
        },
        {
            id: "ASDNWFOQFNQ",
            status: "Accepted",
            date: "31 December 2025 12.59",
            items: [
                { id: 1, name: "Tiket", price: 1000000, quantity: 2, image: "bg-teal-500" },
                { id: 2, name: "Celana", price: 1000000, quantity: 1, image: "bg-teal-500" },
            ],
            total: 3000000 // Corrected based on items
        },
        {
            id: "ASDNWFOQFNQ",
            status: "Rejected",
            date: "31 December 2025 12.59",
            items: [
                { id: 1, name: "Tiket", price: 1000000, quantity: 2, image: "bg-teal-500" },
                { id: 2, name: "Celana", price: 1000000, quantity: 1, image: "bg-teal-500" },
            ],
            total: 3000000 // Corrected based on items
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-[#FCD34D] text-white'; // Yellow
            case 'Accepted': return 'bg-[#6EE7B7] text-white'; // Green
            case 'Rejected': return 'bg-[#EF4444] text-white'; // Red
            default: return 'bg-gray-400 text-white';
        }
    };

    return (
        <div className="min-h-screen overflow-auto relative flex flex-col items-center">
            {/* Background Image */}
            <img
                src={HistoryBG}
                alt="Background"
                className="fixed inset-0 w-full h-full object-cover z-0"
            />

            {/* Content */}
            <div className="relative z-10 w-full max-w-[1200px] p-4 md:p-8 flex flex-col items-center">
                {/* Header */}
                <div className="flex items-center justify-between w-full mb-8 relative">
                    <button onClick={() => navigate('/')} className="hover:opacity-75 transition-opacity">
                        {/* Back Button Placeholder if needed, but not in visual reference explicitly, keeping logic simple */}
                    </button>

                    {/* Title with Bird/Decoration? Using user's text style reference */}
                    <div className="flex-1 text-center">
                        <h1
                            className="text-6xl md:text-7xl font-['Pirata_One'] text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] tracking-wider"
                            style={{
                                textShadow: '-1px -1px 0 #1a3c40, 1px -1px 0 #1a3c40, -1px 1px 0 #1a3c40, 1px 1px 0 #1a3c40'
                            }}
                        >
                            ORDER HISTORY
                        </h1>
                    </div>
                    <div className="w-[40px]"></div> {/* Spacer for centering if back button exists */}
                </div>


                {/* Orders List */}
                <div className="w-full space-y-6">
                    {orders.map((order, index) => (
                        <div key={index} className="bg-[#F8FDFF] rounded-lg shadow-md border border-[#E5F6F8] relative">
                            {/* Card Header */}
                            <div className="px-6 py-4 border-b border-[#E5F6F8] flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-[#1a3c40] font-serif text-sm">Order ID:</span>
                                    <span className="font-serif text-[#1a3c40] text-sm tracking-wide">{order.id}</span>

                                    <span className={`px-4 py-0.5 rounded-full text-xs font-bold ${getStatusColor(order.status)} font-serif tracking-wide ml-2`}>
                                        {order.status}
                                    </span>

                                    {order.status === 'Rejected' && (
                                        <div className="group relative cursor-help ml-1">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a3c40" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                            </svg>

                                            {/* Tooltip */}
                                            <div className="absolute bottom-full  left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] bg-white text-[#1a3c40] text-xs rounded-lg shadow-lg p-3 border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 text-left">
                                                <p className="font-bold mb-1 font-serif">Alasan Penolakan:</p>
                                                <p className="font-serif">Bukti pembayaran tidak valid.</p>
                                                {/* Arrow */}
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <span className="font-bold text-[#1a3c40] font-serif text-sm">{order.date}</span>
                            </div>

                            {/* Card Items */}
                            <div className="px-6 py-4 space-y-4">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex gap-4 items-center">
                                        <div className={`w-20 h-14 rounded-md shadow-sm from-teal-400 to-teal-600 bg-gradient-to-br`}></div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-[#1a3c40] font-serif text-lg">{item.name}</h3>
                                            <p className="text-xs font-bold text-[#8B8B8B] font-serif">Rp{item.price.toLocaleString('id-ID')}</p>
                                        </div>
                                        <div className="px-2 py-1 border border-gray-400 rounded text-xs font-bold text-gray-500 font-serif">
                                            {item.quantity}x
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Card Footer */}
                            <div className="px-6 py-4 border-t border-[#E5F6F8] flex flex-col items-end">
                                <span className="font-bold text-[#1a3c40] font-serif text-sm">Total Harga:</span>
                                <span className="font-bold text-[#1a3c40] font-serif text-xl">Rp{order.items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0).toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
