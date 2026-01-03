import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import cartBackGround from '../assets/CartBackground.jpeg'
import Navbar from '../salman/navBar';
import Footer from '../salman/footer';
import { useAuth } from '../context/AuthContext';
import { ordersApi, API_BASE_URL, type Order } from '../config/api';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();
    
    const orderId = searchParams.get('orderId');
    
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function fetchOrder() {
            if (!orderId) {
                setLoading(false);
                return;
            }
            
            try {
                const response = await ordersApi.getById(orderId);
                if (response.success && response.data) {
                    setOrder(response.data);
                } else {
                    setError('Order tidak ditemukan');
                }
            } catch (err) {
                console.error('Failed to fetch order:', err);
                setError(err instanceof Error ? err.message : 'Gagal memuat order');
            } finally {
                setLoading(false);
            }
        }
        fetchOrder();
    }, [orderId]);

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
            const response = await ordersApi.uploadProof(orderId, uploadedFile);
            
            if (response.success) {
                navigate('/transactionsuccess');
            } else {
                setError(response.message || 'Gagal upload bukti pembayaran');
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError(err instanceof Error ? err.message : 'Gagal upload bukti pembayaran');
        } finally {
            setUploading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText('1290328292');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatCurrency = (price: number) => {
        return new Intl.NumberFormat('id-ID').format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${cartBackGround})`, backgroundSize: 'cover' }}>
                <div className="text-center bg-white/90 p-8 rounded-2xl">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a3c40] mx-auto"></div>
                    <p className="mt-4 text-[#1a3c40]">Memuat order...</p>
                </div>
            </div>
        );
    }

    if (!orderId || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${cartBackGround})`, backgroundSize: 'cover' }}>
                <div className="text-center bg-white/90 p-8 rounded-2xl">
                    <h2 className="text-2xl font-bold text-[#1a3c40] mb-4">Order tidak ditemukan</h2>
                    <p className="text-gray-600 mb-4">{error || 'Silakan buat order terlebih dahulu'}</p>
                    <button 
                        onClick={() => navigate('/merchlist')}
                        className="px-6 py-2 bg-[#1a3c40] text-white rounded-lg"
                    >
                        Belanja Sekarang
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen overflow-auto" style={{
            backgroundImage: `url(${cartBackGround})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
            <div className="p-8 md:p-12 max-w-[1600px] mx-auto">
                {/* Header */}
                <Navbar />
                <div className="flex items-center gap-2 mt-10 mb-8 text-[#1a3c40]">
                    <button onClick={() => navigate(-1)} className="hover:opacity-75 transition-opacity">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M16 12H8m0 0l4-4m-4 4l4 4" />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-serif font-normal tracking-wide">Order Detail</h1>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Column 1: Orderer Detail (3 cols) */}
                    <div className="lg:col-span-3 bg-white rounded-lg p-6 shadow-lg min-h-[250px]">
                        <h2 className="text-2xl font-bold text-[#1a3c40] mb-6 font-serif">Orderer Detail</h2>
                        <div className="space-y-4 text-[#1a3c40] font-serif">
                            <div className="grid grid-cols-[140px_1fr] items-center">
                                <span className="font-bold text-base">Full Name</span>
                                <span className="text-base">{order.shippingName || user?.name || '-'}</span>
                            </div>
                            <div className="grid grid-cols-[140px_1fr] items-center">
                                <span className="font-bold text-base">Phone Number</span>
                                <span className="text-base">{order.shippingPhone || '-'}</span>
                            </div>
                            <div className="grid grid-cols-[140px_1fr] items-center">
                                <span className="font-bold text-base">Address</span>
                                <span className="text-base break-words">{order.shippingAddress || '-'}</span>
                            </div>
                            <div className="grid grid-cols-[140px_1fr] items-center">
                                <span className="font-bold text-base">Order ID</span>
                                <span className="text-base text-gray-500">{order.id.substring(0, 8)}...</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Items (4 cols) */}
                    <div className="lg:col-span-5 bg-white rounded-lg p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-[#1a3c40] mb-6 font-serif">Items</h2>
                        <div className="space-y-6">
                            {order.items.map((item, index) => (
                                <div key={item.id} className={`flex gap-4 pb-6 ${index !== order.items.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                    {/* Item Image */}
                                    {item.product?.image ? (
                                        <img 
                                            src={`${API_BASE_URL.replace('/api', '')}${item.product.image}`}
                                            alt={item.product?.name}
                                            className="w-24 h-16 rounded-lg shadow-sm object-cover"
                                        />
                                    ) : (
                                        <div className="w-24 h-16 rounded-lg shadow-sm bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white">
                                            📦
                                        </div>
                                    )}

                                    <div className="flex-1 flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-[#1a3c40] text-sm mb-1">{item.product?.name || 'Product'}</h3>
                                            <p className="text-xs font-bold text-[#564e3e]">Rp{formatCurrency(item.price)}</p>
                                        </div>
                                        <div className="px-2 py-1 rounded border border-gray-300 text-xs font-bold text-gray-500">
                                            {item.quantity}x
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t-2 border-gray-200 flex justify-between items-center text-[#1a3c40]">
                            <span className="font-bold text-lg font-serif">Total Harga:</span>
                            <span className="font-bold text-xl text-gray-600">Rp{formatCurrency(order.totalAmount)}</span>
                        </div>
                    </div>

                    {/* Column 3: Payment Methods (5 cols) */}
                    <div className="lg:col-span-4 bg-white rounded-lg p-6 shadow-lg min-h-[500px] flex flex-col">
                        <h2 className="text-xl font-bold text-[#1a3c40] mb-6 font-serif">Payment Methods</h2>

                        <div className="flex-1 space-y-6">
                            {/* Option 1 */}
                            <div>
                                <p className="text-xs font-bold text-[#1a3c40] mb-2">Option 1: QR Code</p>
                                <div className="w-full aspect-square bg-gray-300 rounded-lg"></div>
                            </div>

                            {/* Option 2 */}
                            <div className="pt-4 border-t border-gray-300">
                                <p className="text-xs font-bold text-[#1a3c40] mb-2">Option 2: Bank Transfer</p>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-[#1a3c40] text-sm">Bank Jago a.n. UIGTC</p>
                                        <p className="text-lg text-[#1a3c40]">1290328292</p>
                                    </div>
                                    <button onClick={handleCopy} className="text-gray-500 hover:text-[#1a3c40] transition-colors relative" title="Copy Account Number">
                                        {copied ? (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        ) : (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {order.paymentProof ? (
                                <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg text-center">
                                    <p className="font-bold mb-2">✅ Bukti pembayaran sudah diupload</p>
                                    <a 
                                        href={`${API_BASE_URL.replace('/api', '')}${order.paymentProof}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-800 underline"
                                    >
                                        Lihat Bukti
                                    </a>
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                    />

                                    <button
                                        onClick={handleUploadClick}
                                        disabled={uploading}
                                        className="w-full py-3 bg-[#e89c3f] hover:bg-[#d68b2e] text-[#1a3c40] font-bold text-sm rounded-lg shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="17 8 12 3 7 8"></polyline>
                                            <line x1="12" y1="3" x2="12" y2="15"></line>
                                        </svg>
                                        Masukkan Bukti Pembayaran
                                    </button>

                                    {uploadedFileName && (
                                        <div className="flex items-center justify-center gap-2 bg-[#e5e7eb] py-2 rounded-lg text-[#374151]">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                <polyline points="14 2 14 8 20 8"></polyline>
                                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                                <polyline points="10 9 9 9 8 9"></polyline>
                                            </svg>
                                            <span className="text-sm font-serif font-medium tracking-wide">{uploadedFileName}</span>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleConfirm}
                                        disabled={!uploadedFile || uploading}
                                        className={`w-full py-3 font-bold text-sm rounded-lg transition-all border-none ${
                                            uploadedFile && !uploading
                                                ? 'bg-[#1a3c40] text-white hover:bg-[#122b2e] cursor-pointer shadow-lg'
                                                : 'bg-[#f5f5f5] text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        {uploading ? 'Uploading...' : 'Confirm'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                </div>
            </div>
            <Footer/>
        </div>
    );
}
