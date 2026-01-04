import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import listBg from '../assets/CartBackground.jpeg';
import Navbar from './navBar';
import Footer from './footer';
import { useAuth } from '../context/AuthContext';
import { cartApi, API_BASE_URL, type CartItem } from '../config/api';

// Extended CartItem with selection state
interface CartItemWithSelection extends CartItem {
    selected: boolean;
}

export default function CartPage() {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    
    const [cartItems, setCartItems] = useState<CartItemWithSelection[]>([]);
    const [selectAll, setSelectAll] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // State Modal Checkout
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    
    // State loading saat proses checkout ke server
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);

    // --- FETCH DATA ---
    const fetchCart = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await cartApi.get();
            
            if (response.success && response.data) {
                const itemsWithSelection = response.data.items.map((item) => ({
                    ...item,
                    selected: true
                }));
                setCartItems(itemsWithSelection);
            } else {
                setError(response.message || 'Gagal memuat keranjang');
            }
        } catch (err) {
            console.error('Failed to fetch cart:', err);
            setError('Gagal terhubung ke server');
        } finally {
            setIsLoading(false);
        }
    };

    // Load data when component mounts
    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            setIsLoading(false);
            return;
        }
        fetchCart();
    }, [user, authLoading]);

    // --- HANDLERS UI ---

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setCartItems(cartItems.map(item => ({ ...item, selected: newSelectAll })));
    };

    const handleSelectItem = (id: string) => {
        const updatedItems = cartItems.map(item =>
            item.id === id ? { ...item, selected: !item.selected } : item
        );
        setCartItems(updatedItems);
        setSelectAll(updatedItems.length > 0 && updatedItems.every(item => item.selected));
    };

    const handleQuantityChange = async (id: string, delta: number) => {
        const item = cartItems.find(i => i.id === id);
        if (!item) return;

        const newQty = item.quantity + delta;

        if (newQty < 1) return;
        if (newQty > item.product.stock) {
            alert(`Stok hanya tersedia ${item.product.stock}`);
            return;
        }
        
        const updatedItems = cartItems.map(i => 
            i.id === id ? { ...i, quantity: newQty } : i
        );
        setCartItems(updatedItems);

        try {
            const response = await cartApi.updateItem(id, newQty);
            if (!response || !response.success) {
                console.error("Gagal update di server:", response?.message);
                setCartItems(cartItems); 
                alert(response?.message || "Gagal mengupdate jumlah barang");
            }
        } catch (error) {
            console.error("API Error:", error);
            setCartItems(cartItems);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Hapus item ini dari keranjang?')) return; // Bisa diganti modal delete custom juga kalau mau

        try {
            const response = await cartApi.removeItem(id);
            if (response.success) {
                setCartItems(cartItems.filter(item => item.id !== id));
            } else {
                alert(response.message || 'Gagal menghapus item');
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert('Terjadi kesalahan koneksi');
        }
    };

    // --- CALCULATIONS ---
    const calculateTotal = () => {
        return cartItems
            .filter(item => item.selected)
            .reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    };

    const getItemTotal = (item: CartItemWithSelection) => {
        return item.product.price * item.quantity;
    };

    const getImageUrl = (imagePath: string | null) => {
        if (!imagePath) return null;
        return `${API_BASE_URL.replace('/api', '')}${imagePath}`;
    };

    // --- CHECKOUT LOGIC ---
    
    // 1. Trigger Modal
    const onCheckoutClick = () => {
        const selectedItems = cartItems.filter(item => item.selected);
        if (selectedItems.length === 0) {
            alert('Pilih minimal satu item untuk checkout');
            return;
        }
        setShowConfirmModal(true);
    };

    // 2. Process Checkout (After Modal Confirm)
    const handleConfirmCheckout = async () => {
        setIsCreatingOrder(true);
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Sesi login berakhir. Silakan login kembali.');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({}) 
            });

            const result = await response.json();

            if (response.ok && result.success) {
                const newOrderId = result.data.id;
                navigate(`/checkout?orderId=${newOrderId}`);
            } else {
                alert(result.message || 'Gagal membuat pesanan. Silakan coba lagi.');
                setShowConfirmModal(false); // Tutup modal jika gagal
            }

        } catch (error) {
            console.error('Checkout error:', error);
            alert('Terjadi kesalahan koneksi saat memproses pesanan.');
            setShowConfirmModal(false);
        } finally {
            setIsCreatingOrder(false);
        }
    };

    // --- RENDER ---

    if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-[#F3CC91]">Loading...</div>;

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-[#F3CC91]">
                <p className="font-bree text-[#1a3c40]">Silakan login terlebih dahulu untuk melihat keranjang.</p>
                <button onClick={() => navigate('/auth')} className="bg-[#1a3c40] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition">Login Sekarang</button>
            </div>
        );
    }

    return (
        <section className="min-h-screen w-full bg-gradient-to-b from-[#EAB775] to-[#F3CC91] flex justify-center overflow-x-hidden">
            
            {/* --- CHECKOUT CONFIRMATION MODAL --- */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 relative overflow-hidden border-4 border-[#CD853F] animate-scale-up">
                        <div className="absolute top-0 left-0 w-full h-2 bg-[#CD853F]"></div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                            </div>
                            
                            <h3 className="text-2xl font-bree text-[#3d2314] mb-2 font-[Lora]">Konfirmasi Pesanan</h3>
                            <p className="text-gray-600 mb-6 text-sm">
                                Anda akan memproses pesanan dengan total:
                                <br/>
                                <span className="text-xl font-bree text-[#CD853F] block mt-2">
                                    Rp{calculateTotal().toLocaleString('id-ID')}
                                </span>
                            </p>
                            
                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={handleConfirmCheckout}
                                    disabled={isCreatingOrder}
                                    className="w-full py-3 bg-[#CD853F] hover:bg-[#B8732F] text-white font-bree rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isCreatingOrder ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            Memproses...
                                        </>
                                    ) : (
                                        'Ya, Lanjut Bayar'
                                    )}
                                </button>
                                <button 
                                    onClick={() => setShowConfirmModal(false)}
                                    disabled={isCreatingOrder}
                                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bree rounded-xl transition-colors disabled:opacity-70"
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div 
                className="w-full max-w-[2000px] min-h-screen flex flex-col relative border-x border-[#3d2314]/30 shadow-2xl bg-white/30"
                style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)), url(${listBg})`,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundAttachment: 'fixed'
                }}
            >
                <Navbar />
                <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 pb-16 pt-24 md:pt-32">
                                <h1 className="text-5xl text-center mb-8 md:mb-12 text-white font-bree tracking-wider"
                                    style={{
                                        fontFamily: 'treamd',
                                        textShadow: '3px 3px 0px #3d2314, 5px 5px 0px rgba(61, 35, 20, 0.5)'
                                    }}>
                                    MY CART
                                </h1>

                    {isLoading ? (
                        <div className="text-center">
                            <div className="bg-white/90 p-8 rounded-2xl shadow-xl inline-block">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a3c40] mx-auto"></div>
                                <p className="mt-4 text-[#1a3c40] font-bree">Memuat keranjang...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-600 bg-white/90 p-6 rounded-lg shadow-lg max-w-md mx-auto">
                            <p className="font-bree mb-4">{error}</p>
                            <button onClick={fetchCart} className="px-6 py-2 bg-[#1a3c40] text-white rounded-lg font-bree">Coba Lagi</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            
                            {/* --- KOLOM KIRI: DAFTAR BARANG --- */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl">
                                    <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-200">
                                        <input
                                            type="checkbox"
                                            checked={selectAll}
                                            onChange={handleSelectAll}
                                            className="w-5 h-5 cursor-pointer accent-[#E19738]"
                                        />
                                        <label className="font-bree text-gray-800 cursor-pointer select-none" onClick={handleSelectAll}>
                                            Semua Produk ({cartItems.length})
                                        </label>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100 sm:border-none">
                                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.selected}
                                                        onChange={() => handleSelectItem(item.id)}
                                                        className="w-5 h-5 cursor-pointer accent-[#E19738] flex-shrink-0"
                                                    />
                                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-lg shadow-md flex-shrink-0 overflow-hidden">
                                                        <img 
                                                            src={getImageUrl(item.product.image) || 'https://via.placeholder.com/150?text=No+Img'} 
                                                            alt={item.product.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Img'; }}
                                                        />
                                                    </div>
                                                    <div className="sm:hidden flex-1 ml-2">
                                                        <h3 className="font-bree text-gray-800 text-sm line-clamp-1">{item.product.name}</h3>
                                                        <p className="text-sm text-gray-600">Rp{item.product.price.toLocaleString('id-ID')}</p>
                                                    </div>
                                                </div>

                                                <div className="hidden sm:block flex-1 min-w-0">
                                                    <h3 className="font-bree text-gray-800 mb-1">{item.product.name}</h3>
                                                    <p className="text-sm text-gray-600">Rp{item.product.price.toLocaleString('id-ID')}</p>
                                                </div>

                                                <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0 gap-4">
                                                    <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-2 py-1 shadow-sm">
                                                        <button onClick={() => handleQuantityChange(item.id, -1)} disabled={item.quantity <= 1} className="w-6 h-6 font-bree disabled:opacity-30">-</button>
                                                        <span className="w-8 text-center font-semibold text-gray-800">{item.quantity}</span>
                                                        <button onClick={() => handleQuantityChange(item.id, 1)} disabled={item.quantity >= item.product.stock} className="w-6 h-6 font-bree disabled:opacity-30">+</button>
                                                    </div>
                                                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 p-2">
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {cartItems.length === 0 && (
                                            <div className="text-center py-10 text-gray-500">
                                                <p className="text-xl mb-4">Keranjang belanja Anda kosong</p>
                                                <button onClick={() => navigate('/merchList')} className="text-[#E19738] underline hover:text-[#E19738]">Mulai Belanja</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* --- KOLOM KANAN: RINGKASAN --- */}
                            <div className="lg:col-span-1">
                                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl sticky top-24">
                                    <h2 className="text-xl font-bree text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
                                        Cart Total
                                    </h2>

                                    <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2">
                                        {cartItems.filter(item => item.selected).map((item) => (
                                            <div key={item.id} className="flex justify-between text-sm">
                                                <span className="text-gray-700 line-clamp-1 flex-1 pr-2">{item.product.name}</span>
                                                <div className="text-right whitespace-nowrap">
                                                    <span className="text-gray-500 text-xs mr-2">{item.quantity}x</span>
                                                    <span className="text-gray-800 font-semibold">
                                                        Rp{getItemTotal(item).toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        {cartItems.filter(item => item.selected).length === 0 && (
                                            <p className="text-gray-500 text-sm italic">Belum ada item dipilih</p>
                                        )}
                                    </div>

                                    <div className="pt-4 mb-6 border-t-2 border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bree text-gray-800">Total:</span>
                                            <span className="text-xl font-bree text-[#E19738]">
                                                Rp{calculateTotal().toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {cartItems.filter(i => i.selected).length} item dipilih
                                        </p>
                                    </div>

                                    <button
                                        onClick={onCheckoutClick} // Mengarahkan ke fungsi Modal
                                        disabled={calculateTotal() === 0}
                                        className={`w-full py-3 rounded-xl font-bree text-black shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center gap-2 ${
                                            calculateTotal() > 0
                                                ? 'bg-[#E19738]'
                                                : 'bg-gray-300 cursor-not-allowed'
                                        }`}
                                    >
                                        Checkout Sekarang
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
                <Footer />
            </div>
        </section>
    );
}