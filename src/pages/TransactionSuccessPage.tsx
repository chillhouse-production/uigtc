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
import BadgeCheck from '../assets/badge-check.svg';
import Navbar from '../salman/navBar';

const API_BASE_URL = 'https://uigtc.id/api';

export default function TransactionSuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // State
    const [orderId, setOrderId] = useState<string | null>(searchParams.get('orderId'));
    const [loading, setLoading] = useState(!searchParams.get('orderId')); // Loading jika ID belum ada di URL
    const [copied, setCopied] = useState(false);

    // --- FETCHING LOGIC ---
    useEffect(() => {
        // Jika orderId sudah ada dari URL, tidak perlu fetch
        if (orderId) return;

        const fetchLatestOrder = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                // Jika tidak ada token, redirect atau biarkan kosong (tergantung flow)
                setLoading(false);
                return;
            }

            try {
                // Fetch daftar order user
                const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await response.json();

                if (response.ok && result.success && result.data && result.data.length > 0) {
                    // Ambil order paling pertama (asumsi API mengembalikan order terbaru di index 0)
                    // Jika API tidak sort by date, kita bisa sort manual di sini:
                    // const sorted = result.data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    setOrderId(result.data[0].id);
                }
            } catch (error) {
                console.error("Gagal mengambil Order ID:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestOrder();
    }, [orderId]);

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
            <img src={Vector69} alt="" className="absolute top-20 right-1/4 w-12" />
            <img src={Vector71} alt="" className="absolute top-40 left-20 w-16" />
            <img src={Vector72} alt="" className="absolute bottom-1/3 right-10 w-10" />
            <img src={Vector73} alt="" className="absolute top-10 left-1/2 w-8" />

            <div
                className={`relative z-10 bg-white shadow-xl flex flex-col items-center text-center
                    /* HP (Mobile) */
                    w-[90%] max-w-sm p-8 rounded-3xl mb-8

                    /* iPad (Tablet) */
                    md:max-w-xl md:p-12

                    /* Laptop (Desktop) */
                    lg:max-w-2xl lg:p-16 lg:rounded-[1rem]
                `}
            >
                <div className="mb-6 relative">
                    <img src={BadgeCheck} alt="Success Badge" className="w-[120px] h-[120px] drop-shadow-md" />
                </div>

                <h1 className="text-4xl md:text-5xl font-['Pirata_One'] text-[#1a3c40] mb-8 font-normal tracking-wide">
                    PEMESANAN BERHASIL!
                </h1>

                <div className="bg-[#CFE3E8] rounded-lg px-8 py-4 flex items-center gap-4 text-[#1a3c40] mb-2 w-full max-w-sm border border-[#4FB4CE]/30">
                    <span className="font-bold text-lg font-serif">Order ID:</span>
                    
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
            </div>
            
            <button
                onClick={() => navigate('/')}
                className="relative z-10 px-10 py-3 bg-[#133033] hover:bg-[#0b1c1e] text-white font-serif font-bold text-lg rounded-lg shadow-lg transition-colors"
            >
                Back To Home
            </button>
        </div>
    );
}