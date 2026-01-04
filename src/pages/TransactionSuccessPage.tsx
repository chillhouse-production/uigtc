import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Ellipse26 from '../assets/background-TS/Ellipse 26.svg';
import Ellipse27 from '../assets/background-TS/Ellipse 27.svg';
import Ellipse28 from '../assets/background-TS/Ellipse 28.svg';
import Ellipse29 from '../assets/background-TS/Ellipse 29.svg';
import Vector69 from '../assets/background-TS/Vector 69.svg';
import Vector71 from '../assets/background-TS/Vector 71.svg';
import Vector72 from '../assets/background-TS/Vector 72.svg';
import Vector73 from '../assets/background-TS/Vector 73.svg';
import Navbar from '../salman/navBar';

// --- TYPE DEFINITIONS ---
interface Product {
    id: string;
    name: string;
    productType: string; // Pastikan backend mengirim field ini (e.g., 'ticket_single', 'merchandise')
    category?: { type: string }; // Atau cek via category type
}

interface OrderItem {
    id: string;
    product: Product;
}

interface Order {
    id: string;
    items: OrderItem[];
}

const API_BASE_URL = 'https://uigtc.id/api';
// Ganti dengan Link Grup WhatsApp/Line yang asli
const GROUP_LINK = "https://chat.whatsapp.com/BV8ugzbi8zhI6Ds7lFvpQH";

export default function TransactionSuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // State
    const [orderId, setOrderId] = useState<string | null>(searchParams.get('orderId'));
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    
    // State untuk logic tampilan
    const [hasTicket, setHasTicket] = useState(false);
    const [hasMerch, setHasMerch] = useState(false);

    // --- FETCHING LOGIC ---
    useEffect(() => {
        const fetchOrderData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                let currentOrderId = orderId;

                // 1. Jika ID tidak ada di URL, fetch latest order user
                if (!currentOrderId) {
                    const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const result = await response.json();
                    if (response.ok && result.success && result.data.length > 0) {
                        currentOrderId = result.data[0].id;
                        setOrderId(currentOrderId);
                    }
                }

                // 2. Jika sudah punya Order ID, fetch detailnya untuk cek Item Type
                if (currentOrderId) {
                    const detailRes = await fetch(`${API_BASE_URL}/orders/${currentOrderId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const detailJson = await detailRes.json();

                    if (detailRes.ok && detailJson.success) {
                        const orderData: Order = detailJson.data;
                        
                        // Cek isi item
                        let ticketFound = false;
                        let merchFound = false;

                        orderData.items.forEach(item => {
                            // Cek berdasarkan productType atau category type dari backend
                            const type = item.product.productType || item.product.category?.type || '';
                            
                            if (type.includes('ticket')) {
                                ticketFound = true;
                            } else if (type.includes('merchandise') || type === 'merch') {
                                merchFound = true;
                            }
                        });

                        setHasTicket(ticketFound);
                        setHasMerch(merchFound);
                    }
                }

            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderData();
    }, [orderId]); // Dependency array cukup orderId, logic fetch handling di dalam

    const handleCopy = () => {
        if (orderId) {
            navigator.clipboard.writeText(orderId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #61B2DE 23%, #7AABB6 100%)' }}>
            <Navbar/>
            {/* Background Assets */}
            <img src={Ellipse26} alt="" className="absolute top-10 left-10 opacity-60" />
            <img src={Ellipse27} alt="" className="absolute bottom-20 right-20 opacity-60" />
            <img src={Ellipse28} alt="" className="absolute top-1/2 left-1/4 opacity-60" />
            <img src={Ellipse29} alt="" className="absolute bottom-10 left-1/3 opacity-60" />
            
            {/* Bird Decorations - menggunakan SVG untuk burung */}
            <svg className="absolute top-20 left-20 w-12 h-8 opacity-70" viewBox="0 0 48 32" fill="none">
                <path d="M2 16C2 16 8 8 16 8C24 8 28 14 32 14C36 14 42 8 46 8" stroke="#2C5F6F" strokeWidth="2" strokeLinecap="round"/>
                <path d="M32 14C32 14 34 10 36 10C38 10 40 12 40 12" stroke="#2C5F6F" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            
            <svg className="absolute top-32 right-20 w-12 h-8 opacity-70" viewBox="0 0 48 32" fill="none">
                <path d="M2 16C2 16 8 8 16 8C24 8 28 14 32 14C36 14 42 8 46 8" stroke="#2C5F6F" strokeWidth="2" strokeLinecap="round"/>
                <path d="M32 14C32 14 34 10 36 10C38 10 40 12 40 12" stroke="#2C5F6F" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            
            <svg className="absolute bottom-40 left-32 w-10 h-6 opacity-60" viewBox="0 0 48 32" fill="none">
                <path d="M2 16C2 16 8 8 16 8C24 8 28 14 32 14C36 14 42 8 46 8" stroke="#2C5F6F" strokeWidth="2" strokeLinecap="round"/>
                <path d="M32 14C32 14 34 10 36 10C38 10 40 12 40 12" stroke="#2C5F6F" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            
            <svg className="absolute bottom-1/3 right-32 w-10 h-6 opacity-60" viewBox="0 0 48 32" fill="none">
                <path d="M2 16C2 16 8 8 16 8C24 8 28 14 32 14C36 14 42 8 46 8" stroke="#2C5F6F" strokeWidth="2" strokeLinecap="round"/>
                <path d="M32 14C32 14 34 10 36 10C38 10 40 12 40 12" stroke="#2C5F6F" strokeWidth="2" strokeLinecap="round"/>
            </svg>

            <img src={Vector69} alt="" className="absolute top-20 right-1/4 w-12" />
            <img src={Vector71} alt="" className="absolute top-40 left-20 w-16" />
            <img src={Vector72} alt="" className="absolute bottom-1/3 right-10 w-10" />
            <img src={Vector73} alt="" className="absolute top-10 left-1/2 w-8" />

            <div
                className={`relative z-10 bg-white shadow-xl flex flex-col items-center text-center border-4 border-[#5DAECC]
                    /* HP (Mobile) */
                    w-[90%] max-w-sm p-8 rounded-3xl mb-8
                    md:max-w-xl md:p-12

                    /* Laptop (Desktop) */
                    lg:max-w-2xl lg:p-16 lg:rounded-[2rem]
                `}
            >
                {/* Custom Checkmark Badge - menggantikan BadgeCheck.svg */}
                <div className="mb-6 relative">
                    <div className="w-[120px] h-[120px] rounded-full border-[6px] border-[#5DAECC] bg-white flex items-center justify-center shadow-lg">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#5DAECC" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-['Pirata_One'] text-[#1a3c40] mb-8 font-normal tracking-wide">
                    PEMESANAN BERHASIL!
                </h1>

                <div className="bg-[#CFE3E8] rounded-lg px-8 py-4 flex items-center gap-4 text-[#1a3c40] mb-2 w-full max-w-sm border border-[#5DAECC]/30">
                    <span className="font-bree text-lg font-serif">Order ID:</span>
                    
                    <span className="font-serif text-lg tracking-wider flex-1 text-left truncate">
                        {loading ? (
                            <span className="animate-pulse">Loading...</span>
                        ) : (
                            orderId || "-"
                        )}
                    </span>

                    <button
                        onClick={handleCopy}
                        disabled={loading || !orderId}
                        className="text-[#1a3c40] hover:text-[#0f2426] transition-colors relative disabled:opacity-50"
                        aria-label="Copy Order ID"
                    >
                        {copied ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        )}
                    </button>
                </div>

                {/* --- CONDITIONAL INFO --- */}
                {!loading && (
                    <div className="w-full max-w-md space-y-4 ">
                        
                        {/* 1. TICKET: Tampilkan Link Grup */}
                        {hasTicket && (
                            <div className="bg-[#e0f2fe] border border-blue-200 rounded-xl p-4 text-left">
                                <h3 className="text-[#0369a1] font-bold text-lg mb-2 flex items-center gap-2">
                                    🎟️ Info Peserta
                                </h3>
                                <p className="text-sm text-[#0c4a6e] mb-3">
                                    Terima kasih telah membeli tiket! Silakan bergabung ke grup peserta melalui link di bawah ini untuk informasi lebih lanjut.
                                </p>
                                <a 
                                    href={GROUP_LINK}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center py-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold rounded-lg transition-colors"
                                >
                                    Gabung Grup WhatsApp
                                </a>
                            </div>
                        )}

                        {/* 2. MERCHANDISE: Tampilkan Info Pengambilan */}
                        {hasMerch && (
                            <div className="bg-[#fff7ed] border border-orange-200 rounded-xl p-4 text-left">
                                <h3 className="text-[#c2410c] font-bold text-lg mb-2 flex items-center gap-2">
                                    🛍️ Info Pengambilan Merchandise
                                </h3>
                                <p className="text-sm text-[#7c2d12]">
                                    Merchandise yang kamu beli dapat diambil secara langsung pada saat <b>Main Event UIGTC</b> di tanggal 24 Januari 2026. Harap tunjukkan bukti transaksi ini kepada panitia di booth merchandise.
                                    <p className="font-serif text-[#1a3c40] text-xl mb-4">Belum ada riwayat pesanan.</p>
                            <button 
                                onClick={() => navigate('/merchlist')}
                                className="px-6 py-2 bg-[#e89c3f] text-[#1a3c40] font-bold rounded shadow hover:bg-[#d68b2e] transition-colors"
                            >
                                Mulai Belanja
                            </button>
                                </p>
                            </div>
                        )}

                    </div>
                )}

            </div>
            
            {/* Button Group - menambahkan tombol Order History */}
            <div className="relative z-10 flex flex-col md:flex-row gap-4 items-center">
                <button
                    onClick={() => navigate('/')}
                    className="px-10 py-3 bg-[#E89F3C] hover:bg-[#d68f2a] text-white font-serif font-bree text-lg rounded-lg shadow-lg transition-colors min-w-[180px]"
                >
                    Back To Home
                </button>
                <button
                    onClick={() => navigate('/history')}
                    className="px-10 py-3 bg-[#133033] hover:bg-[#0b1c1e] text-white font-serif font-bree text-lg rounded-lg shadow-lg transition-colors min-w-[180px]"
                >
                    Order History
                </button>
            </div>
        </div>
    );
}