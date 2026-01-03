import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import cartBackGround from '../assets/CartBackground.jpeg';
import Navbar from '../salman/navBar';
import Footer from '../salman/footer';
import { useAuth } from '../context/AuthContext'; 
import { authApi, type User } from '../config/api'; 

// --- DEFINISI TIPE DATA ---
interface Product {
    id: string;
    name: string;
    price: number;
    image: string | null;
    category?: { name: string }; // Optional: jika ada category di backend
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
    
    // State Data
    const [order, setOrder] = useState<Order | null>(null);
    const [userProfile, setUserProfile] = useState<User | null>(null);
    
    // State UI
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // State Pembayaran & Modal
    const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bank'>('qris');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    // --- LOGIC DETEKSI TIPE ITEM ---
    const hasTicket = order?.items.some(item => 
        item.product.name.toLowerCase().includes('ticket') || 
        item.product.name.toLowerCase().includes('tiket')
    );
    
    // Asumsi: Jika bukan tiket, maka itu Merchandise/Barang fisik
    const hasMerch = order?.items.some(item => 
        !item.product.name.toLowerCase().includes('ticket') && 
        !item.product.name.toLowerCase().includes('tiket')
    );

    // --- HANDLERS ---
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedFile(file);
            setUploadedFileName(file.name);
        }
    };

    const handleUploadClick = () => fileInputRef.current?.click();

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
                // SUKSES: Tampilkan Modal, Jangan Reload dulu
                setShowSuccessModal(true);
                
                // Update local order state agar background berubah statusnya (opsional)
                setOrder(prev => prev ? { ...prev, paymentProof: 'uploaded', status: 'WAITING_VERIFICATION' } : null);
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
    const getStatusLabel = (status: string) => status.replace(/_/g, ' ').toUpperCase();

    // --- RENDER ---
    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F3CC91]">Loading...</div>;
    if (!orderId || !order) return <div className="min-h-screen flex items-center justify-center bg-[#F3CC91]">Order Not Found</div>;

    const displayName = userProfile?.name || authUser?.name || '-';
    const displayEmail = userProfile?.email || authUser?.email || '-';
    const displaySchool = userProfile?.schoolOrigin || '-'; 
    const displayPhone = userProfile?.phoneNumber || '-';

    return (
        <div className="min-h-screen overflow-auto" style={{
            backgroundImage: `url(${cartBackGround})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
            
            {/* --- CUSTOM SUCCESS MODAL --- */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative overflow-hidden border-4 border-[#CD853F] animate-scale-up">
                        <div className="absolute top-0 left-0 w-full h-2 bg-[#CD853F]"></div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-[#3d2314] mb-2 font-serif">Upload Berhasil!</h3>
                            <p className="text-gray-600 mb-6 text-sm">
                                Terima kasih telah melakukan pembayaran. Admin akan segera memverifikasi pesanan Anda.
                            </p>

                            {/* --- CONDITIONAL CONTENT --- */}
                            <div className="space-y-4 mb-6 text-left bg-[#F3CC91]/20 p-4 rounded-xl border border-[#CD853F]/30">
                                
                                {/* KONDISI 1: JIKA BELI TICKET */}
                                {hasTicket && (
                                    <div className="flex gap-3 items-start">
                                        <div className="mt-1 bg-green-500 text-white p-1 rounded-full shrink-0">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#1a3c40] text-sm">Tiket Event</p>
                                            <p className="text-xs text-gray-600 mb-2">Silakan bergabung ke grup WhatsApp peserta:</p>
                                            <a 
                                                href="https://chat.whatsapp.com/GANTI_LINK_INI" // GANTI LINK WA DISINI
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs font-bold text-white bg-green-600 px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                Gabung Grup WA
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Divider jika beli keduanya */}
                                {hasTicket && hasMerch && <div className="h-px bg-[#CD853F]/30 my-2"></div>}

                                {/* KONDISI 2: JIKA BELI MERCH */}
                                {hasMerch && (
                                    <div className="flex gap-3 items-start">
                                        <div className="mt-1 bg-orange-500 text-white p-1 rounded-full shrink-0">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#1a3c40] text-sm">Merchandise</p>
                                            <p className="text-xs text-gray-600">
                                                Barang dapat diambil pada saat <strong>Main Event UIGTC</strong> berlangsung. Jangan lupa tunjukkan bukti pesanan ini.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <button 
                                onClick={() => navigate('/history')}
                                className="w-full py-3 bg-[#1a3c40] hover:bg-[#122b2e] text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95"
                            >
                                Ke Riwayat Pesanan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto">
                <Navbar />
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 mt-8 md:mt-10 mb-8 text-[#1a3c40]">
                    <button onClick={() => navigate(-1)} className="hover:opacity-75 transition-opacity w-fit">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M16 12H8m0 0l4-4m-4 4l4 4" /></svg>
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-wide">Detail Pesanan</h1>
                        <p className="text-sm font-bold opacity-80">Order ID: {order.id}</p>
                    </div>
                    <div className="md:ml-auto">
                        <span className={`px-4 py-2 rounded-full text-white text-sm font-bold ${
                            order.status === 'COMPLETED' ? 'bg-green-600' : 
                            order.status === 'PENDING_PAYMENT' ? 'bg-orange-500' : 'bg-blue-600'
                        }`}>
                            {getStatusLabel(order.status)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Column 1: User Profile Detail */}
                    <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                        <h2 className="text-xl font-bold text-[#1a3c40] mb-6 font-serif border-b pb-2">Order Details</h2>
                        <div className="space-y-4 text-[#1a3c40]">
                            <div>
                                <p className="text-sm text-gray-500 font-bold mb-1">Full Name</p>
                                <p className="text-lg font-serif">{displayName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-bold mb-1">School</p>
                                <p className="text-lg font-serif">{displaySchool}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-bold mb-1">Phone Number</p>
                                <p className="text-lg font-serif leading-relaxed">{displayPhone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-bold mb-1">Email</p>
                                <p className="text-base font-serif">{displayEmail}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-bold mb-1">Order Date</p>
                                <p className="text-base font-serif">
                                    {new Date(order.createdAt).toLocaleDateString('id-ID', {
                                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Items & Total */}
                    <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-xl border border-gray-100 flex flex-col">
                        <h2 className="text-xl font-bold text-[#1a3c40] mb-6 font-serif border-b pb-2">Barang Belanjaan</h2>
                        <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
                            {order.items.map((item, index) => (
                                <div key={item.id} className={`flex gap-4 pb-4 ${index !== order.items.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                                        {item.product?.image ? (
                                            <img 
                                                src={`${IMAGE_BASE_URL}${item.product.image}`} 
                                                alt={item.product?.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Img'; }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">📦</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-[#1a3c40] text-sm mb-1 line-clamp-2">{item.product?.name}</h3>
                                        <div className="flex justify-between items-center mt-2">
                                            <div className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.quantity} x</div>
                                            <p className="text-sm font-bold text-[#e89c3f]">Rp {formatCurrency(item.price)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-200">
                            <div className="flex justify-between items-center text-[#1a3c40]">
                                <span className="font-bold text-lg">Total Bayar</span>
                                <span className="font-bold text-2xl text-[#e89c3f]">Rp {formatCurrency(order.totalAmount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Payment */}
                    <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-xl border border-gray-100 flex flex-col">
                        <h2 className="text-xl font-bold text-[#1a3c40] mb-4 font-serif border-b pb-2">Metode Pembayaran</h2>
                        
                        {/* Tabs */}
                        <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
                            <button 
                                onClick={() => setPaymentMethod('qris')}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
                                    paymentMethod === 'qris' 
                                    ? 'bg-white text-[#1a3c40] shadow-md transform scale-105' 
                                    : 'text-gray-500 hover:text-[#1a3c40]'
                                }`}
                            >
                                QRIS
                            </button>
                            <button 
                                onClick={() => setPaymentMethod('bank')}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
                                    paymentMethod === 'bank' 
                                    ? 'bg-white text-[#1a3c40] shadow-md transform scale-105' 
                                    : 'text-gray-500 hover:text-[#1a3c40]'
                                }`}
                            >
                                Transfer Bank
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col">
                            {/* Min Height untuk mencegah jumping layout */}
                            <div className="min-h-[250px] transition-all duration-300 ease-in-out">
                                {paymentMethod === 'qris' ? (
                                    <div className="bg-[#1a3c40]/5 p-6 rounded-xl border border-[#1a3c40]/10 text-center h-full flex flex-col justify-center items-center animate-fade-in">
                                        <p className="text-sm font-bold text-[#1a3c40] mb-3">Scan QRIS</p>
                                        <div className="bg-white p-2 rounded-lg inline-block shadow-sm mb-3">
                                            {/* GANTI DENGAN GAMBAR QRIS ASLI ANDA */}
                                            <img 
                                                src="../assets/QRIS.png" 
                                                alt="QRIS UIGTC" 
                                                className="w-40 h-40 object-contain"
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-500 max-w-[200px]">
                                            Menerima GoPay, OVO, Dana, ShopeePay, LinkAja & M-Banking
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-[#1a3c40]/5 p-6 rounded-xl border border-[#1a3c40]/10 h-full flex flex-col justify-center animate-fade-in">
                                        <p className="text-xs font-bold text-[#1a3c40] mb-4 uppercase tracking-wider text-center">Transfer Manual</p>
                                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-4">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="font-bold text-[#1a3c40] text-lg">Bank Jago</p>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-3">a.n. UIGTC</p>
                                            <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                                                <p className="text-xl font-mono font-bold text-[#1a3c40] tracking-widest">1290328292</p>
                                                <button onClick={handleCopy} className="text-gray-400 hover:text-[#1a3c40] transition-colors p-2 rounded-full hover:bg-gray-200" title="Salin">
                                                    {copied ? <span className="text-green-600 font-bold text-sm">Salin!</span> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Upload Section */}
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <p className="text-xs font-bold text-[#1a3c40] mb-2 uppercase tracking-wider">Status Pembayaran</p>
                                
                                {error && (
                                    <div className="mb-3 bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
                                        <span>⚠️</span> {error}
                                    </div>
                                )}

                                {order.paymentProof ? (
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <p className="font-bold text-green-800 text-sm mb-1">Bukti Terupload</p>
                                        <a href={`${IMAGE_BASE_URL}${order.paymentProof}`} target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 underline hover:text-green-900 block mb-2">Lihat Bukti</a>
                                        {['PENDING_PAYMENT', 'waiting_payment'].includes(order.status) && (
                                            <p className="text-[10px] text-gray-500">Salah upload? Upload ulang di bawah.</p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-center text-orange-800 text-sm mb-4">
                                        <p>Menunggu Bukti Transfer</p>
                                    </div>
                                )}

                                {(!order.paymentProof || ['PENDING_PAYMENT', 'waiting_payment'].includes(order.status)) && (
                                    <div className="mt-3">
                                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
                                        {!uploadedFile ? (
                                            <button onClick={handleUploadClick} disabled={uploading} className="w-full py-3 border-2 border-dashed border-gray-300 hover:border-[#e89c3f] hover:bg-[#e89c3f]/5 rounded-xl transition-all flex flex-col items-center justify-center text-gray-500 gap-1 cursor-pointer">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                                <span className="font-bold text-xs">Upload Bukti</span>
                                            </button>
                                        ) : (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                                                    <div className="w-8 h-8 bg-[#1a3c40] text-white rounded flex items-center justify-center text-xs">IMG</div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-gray-700 truncate">{uploadedFileName}</p>
                                                    </div>
                                                    <button onClick={() => {setUploadedFile(null); setUploadedFileName(null);}} className="text-red-500 hover:bg-red-50 p-1 rounded">✕</button>
                                                </div>
                                                <button onClick={handleConfirm} disabled={uploading} className="w-full py-2 bg-[#1a3c40] hover:bg-[#122b2e] text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed text-sm">
                                                    {uploading ? 'Mengupload...' : 'Kirim Bukti'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <Footer/>
        </div>
    );
}