import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi, type User } from '../config/api';
import qrisUIGTC from '../assets/qris/qris.png';
import Navbar from '../salman/navBar'; 
import Footer from '../salman/footer';

// --- DEFINISI TIPE DATA ---
interface Product {
    id: string;
    name: string;
    price: number;
    image: string | null;
    category?: { name: string };
}

interface OrderItem {
    id: string;
    price: number;
    quantity: number;
    product: Product;
}

interface Order {
    id: string;
    userId: string;
    status: string;
    totalAmount: number;
    paymentProof: string | null;
    items: OrderItem[];
    createdAt: string;
}

const API_BASE_URL = 'https://uigtc.id/api';
const IMAGE_BASE_URL = 'https://uigtc.id';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    
    const { user: authUser } = useAuth(); 
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // --- STATE DATA & UI ---
    const [order, setOrder] = useState<Order | null>(null);
    const [userProfile, setUserProfile] = useState<User | null>(null);
    
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- FETCH DATA ---
    useEffect(() => {
        async function fetchData() {
            if (!orderId) {
                setLoading(false);
                return;
            }
            
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Anda belum login.');
                setLoading(false);
                return;
            }

            try {
                // 1. Fetch Order
                const orderRes = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const orderResult = await orderRes.json();

                if (orderRes.ok && orderResult.success) {
                    setOrder(orderResult.data);
                } else {
                    setError(orderResult.message || 'Order tidak ditemukan');
                }

                // 2. Fetch User Profile
                const userRes = await authApi.me();
                if (userRes.success && userRes.data) {
                    setUserProfile(userRes.data);
                }

            } catch (err) {
                setError('Gagal memuat data. Periksa koneksi internet.');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [orderId]);

    // --- HANDLERS ---
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedFile(file);
            setUploadedFileName(file.name);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleConfirm = async () => {
        if (!uploadedFile || !orderId) return;
        setUploading(true);
        setError(null);
        
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('paymentProof', uploadedFile);

            const response = await fetch(`${API_BASE_URL}/orders/${orderId}/upload-proof`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                navigate('/transactionsuccess');
            } else {
                setError(result.message || 'Gagal upload bukti');
            }
        } catch (err) {
            setError('Terjadi kesalahan upload.');
        } finally {
            setUploading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText('1290328292');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatCurrency = (price: number) => new Intl.NumberFormat('id-ID').format(price);

    // --- RENDER HELPERS ---
    const displayName = userProfile?.name || authUser?.name || '-';
    const displayEmail = userProfile?.email || authUser?.email || '-';
    const displaySchool = userProfile?.schoolOrigin || '-'; 
    const displayPhone = userProfile?.phoneNumber || '-';

    // --- LOADING & ERROR STATES ---
    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#61B2DE] text-white font-bold">Loading Order Data...</div>;
    if (!orderId || !order) return <div className="min-h-screen flex items-center justify-center bg-[#61B2DE] text-white font-bold">{error || 'Order Not Found'}</div>;

    return (
        <div className="min-h-screen flex flex-col overflow-auto" style={{ background: 'linear-gradient(135deg, #61B2DE 23%, #7AABB6 100%)' }}>
            

            <div className="flex-1 p-8 md:p-12 max-w-[1600px] mx-auto w-full">

            <Navbar />

                
                {/* Header Page */}
                <div className="flex items-center gap-2 mb-8 text-[#1a3c40] pt-13">
                    <button onClick={() => navigate(-1)} className="hover:opacity-75 transition-opacity">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M16 12H8m0 0l4-4m-4 4l4 4" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-serif font-normal tracking-wide">Order Detail</h1>
                        <p className="text-xs font-bold opacity-60">ID: {order.id}</p>
                    </div>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Column 1: Orderer Detail */}
                    <div className="lg:col-span-3 bg-white rounded-lg p-6 shadow-lg min-h-[250px]">
                        <h2 className="text-2xl font-bold text-[#1a3c40] mb-6 font-serif">Orderer Detail</h2>
                        <div className="space-y-4 text-[#1a3c40] font-serif">
                            <div className="grid grid-cols-[100px_1fr] items-start gap-2">
                                <span className="font-bold text-base">Full Name</span>
                                <span className="text-base text-right md:text-left">{displayName}</span>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] items-start gap-2">
                                <span className="font-bold text-base">School</span>
                                <span className="text-base text-right md:text-left">{displaySchool}</span>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] items-start gap-2">
                                <span className="font-bold text-base">Phone</span>
                                <span className="text-base text-right md:text-left">{displayPhone}</span>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] items-start gap-2">
                                <span className="font-bold text-base">Email</span>
                                <span className="text-base break-all text-right md:text-left">{displayEmail}</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Items */}
                    <div className="lg:col-span-5 bg-white rounded-lg p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-[#1a3c40] mb-6 font-serif">Items</h2>
                        <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {order.items.map((item, index) => (
                                <div key={item.id} className={`flex gap-4 pb-6 ${index !== order.items.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                    <div className="w-24 h-16 rounded-lg shadow-sm bg-gray-100 flex-shrink-0 overflow-hidden">
                                        {item.product?.image ? (
                                            <img 
                                                src={`${IMAGE_BASE_URL}${item.product.image}`} 
                                                alt={item.product.name} 
                                                className="w-full h-full object-cover"
                                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Img'; }}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs">
                                                No Img
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-[#1a3c40] text-sm mb-1 line-clamp-2">{item.product.name}</h3>
                                            <p className="text-xs font-bold text-[#564e3e]">Rp {formatCurrency(item.price)}</p>
                                        </div>
                                        <div className="px-2 py-1 rounded border border-gray-300 text-xs font-bold text-gray-500 whitespace-nowrap ml-2">
                                            {item.quantity} x
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t-2 border-gray-200 flex justify-between items-center text-[#1a3c40]">
                            <span className="font-bold text-lg font-serif">Total Harga:</span>
                            <span className="font-bold text-xl text-gray-600">Rp {formatCurrency(order.totalAmount)}</span>
                        </div>
                    </div>

                    {/* Column 3: Payment Methods */}
                    <div className="lg:col-span-4 bg-white rounded-lg p-6 shadow-lg min-h-[500px] flex flex-col">
                        <h2 className="text-xl font-bold text-[#1a3c40] mb-6 font-serif">Payment Methods</h2>

                        <div className="flex-1 space-y-6">
                            {/* Option 1: QRIS */}
                            <div>
                                <p className="text-xs font-bold text-[#1a3c40] mb-2">Option 1: QR Code</p>
                                <div className="w-full flex justify-center bg-gray-50 border border-gray-200 rounded-lg p-4">
                                     <img 
                                        src={qrisUIGTC}
                                        alt="QRIS UIGTC"
                                        className="w-40 h-40 object-contain mix-blend-multiply"
                                    />
                                </div>
                                <p className="text-[10px] text-center text-gray-400 mt-1">Scan via GoPay, OVO, Dana, BCA, dll.</p>
                            </div>

                            {/* Option 2: Bank Transfer */}
                            <div className="pt-4 border-t border-gray-300">
                                <p className="text-xs font-bold text-[#1a3c40] mb-2">Option 2: Bank Transfer</p>
                                <div className="flex justify-between items-start bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <div>
                                        <p className="font-bold text-[#1a3c40] text-sm">Bank Jago</p>
                                        <p className="text-[10px] text-gray-500 mb-1">a.n. M Naufal Zhafran</p>
                                        <p className="text-lg font-mono text-[#1a3c40] tracking-wide">1290328292</p>
                                    </div>
                                    <button onClick={handleCopy} className="text-gray-500 hover:text-[#1a3c40] transition-colors relative p-2" title="Copy Account Number">
                                        {copied ? (
                                            <span className="text-green-600 text-xs font-bold">Copied!</span>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Buttons & File Upload */}
                        <div className="mt-8 space-y-3">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-200">
                                    {error}
                                </div>
                            )}

                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                                accept="image/*,.pdf"
                            />

                            {!uploadedFile ? (
                                <button
                                    onClick={handleUploadClick}
                                    disabled={uploading}
                                    className="w-full py-3 bg-[#e89c3f] hover:bg-[#d68b2e] text-[#1a3c40] font-bold text-sm rounded-lg shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="17 8 12 3 7 8"></polyline>
                                        <line x1="12" y1="3" x2="12" y2="15"></line>
                                    </svg>
                                    Masukkan Bukti Pembayaran
                                </button>
                            ) : (
                                <div className="flex items-center justify-between gap-2 bg-[#e5e7eb] py-2 px-3 rounded-lg text-[#374151] border border-gray-300">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                            <polyline points="14 2 14 8 20 8"></polyline>
                                            <line x1="16" y1="13" x2="8" y2="13"></line>
                                            <line x1="16" y1="17" x2="8" y2="17"></line>
                                            <polyline points="10 9 9 9 8 9"></polyline>
                                        </svg>
                                        <span className="text-sm font-serif font-medium tracking-wide truncate max-w-[150px]">{uploadedFileName}</span>
                                    </div>
                                    <button 
                                        onClick={() => {setUploadedFile(null); setUploadedFileName(null);}} 
                                        className="text-red-500 hover:text-red-700 font-bold text-lg px-2"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={handleConfirm}
                                disabled={!uploadedFile || uploading}
                                className={`w-full py-3 font-bold text-sm rounded-lg transition-all border-none flex justify-center items-center ${
                                    uploadedFile && !uploading
                                    ? 'bg-[#1a3c40] text-white hover:bg-[#122b2e] cursor-pointer shadow-lg'
                                    : 'bg-[#f5f5f5] text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                {uploading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Uploading...
                                    </>
                                ) : 'Confirm & Finish'}
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Footer di paling bawah */}
            <Footer />
        </div>
    );
}