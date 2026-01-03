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

    // Fetch cart data
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
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan koneksi');
        } finally {
            setIsLoading(false);
        }
    };

    // Load data when component mounts and user is available
    useEffect(() => {
        if (authLoading) return;
        
        if (!user) {
            setIsLoading(false);
            return;
        }
        
        fetchCart();
    }, [user, authLoading]);

    // --- HANDLERS ---

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
        setSelectAll(updatedItems.every(item => item.selected));
    };

    const handleQuantityChange = async (id: string, delta: number) => {
        const item = cartItems.find(i => i.id === id);
        if (!item) return;

        const newQty = Math.max(1, item.quantity + delta);
        
        // Optimistic UI Update
        const updatedItems = cartItems.map(i => 
            i.id === id ? { ...i, quantity: newQty } : i
        );
        setCartItems(updatedItems);

        // Try to update on server (if endpoint exists)
        try {
            await cartApi.updateItem(id, newQty);
        } catch {
            // If update endpoint doesn't exist, just keep local state
            console.log('Update quantity locally (API may not support this)');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Hapus item ini dari keranjang?')) return;

        try {
            const response = await cartApi.removeItem(id);
            
            if (response.success) {
                // Update local state
                setCartItems(cartItems.filter(item => item.id !== id));
            } else {
                alert(response.message || 'Gagal menghapus item');
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert(err instanceof Error ? err.message : 'Terjadi kesalahan koneksi');
        }
    };

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

    const handleCheckout = () => {
        const selectedItems = cartItems.filter(item => item.selected);
        if (selectedItems.length === 0) {
            alert('Pilih minimal satu item untuk checkout');
            return;
        }
        
        // Navigate to checkout with selected items
        navigate('/checkout', { 
            state: { 
                cartItems: selectedItems,
                totalAmount: calculateTotal()
            } 
        });
    };

    // Show loading while auth is being checked
    if (authLoading) {
        return (
            <section className="min-h-screen w-full bg-gradient-to-b from-[#EAB775] to-[#F3CC91] flex items-center justify-center">
                <div className="text-center bg-white/90 p-8 rounded-2xl shadow-xl">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a3c40] mx-auto"></div>
                    <p className="mt-4 text-[#1a3c40]">Loading...</p>
                </div>
            </section>
        );
    }

    // Show login prompt if not logged in
    if (!user) {
        return (
            <section className="min-h-screen w-full bg-gradient-to-b from-[#EAB775] to-[#F3CC91] flex items-center justify-center">
                <div className="text-center bg-white/90 p-8 rounded-2xl shadow-xl max-w-md">
                    <h2 className="text-2xl font-bold text-[#1a3c40] mb-4">Anda harus login terlebih dahulu</h2>
                    <p className="text-gray-600 mb-6">Silakan login untuk melihat keranjang belanja Anda</p>
                    <button 
                        onClick={() => navigate('/auth')}
                        className="px-8 py-3 bg-[#1a3c40] text-white rounded-lg font-bold hover:bg-[#0d2526] transition-colors"
                    >
                        Login
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen w-full bg-gradient-to-b from-[#EAB775] to-[#F3CC91] flex justify-center overflow-x-hidden">
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
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 md:mb-12 text-white" style={{
                        textShadow: '3px 3px 0px rgba(0,0,0,0.3), -1px -1px 0px rgba(0,0,0,0.1)',
                        fontFamily: 'treamd, sans-serif',
                        letterSpacing: '2px'
                    }}>
                        My Cart
                    </h1>

                    {isLoading ? (
                        <div className="text-center">
                            <div className="bg-white/90 p-8 rounded-2xl shadow-xl inline-block">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a3c40] mx-auto"></div>
                                <p className="mt-4 text-[#1a3c40] font-bold">Memuat keranjang...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-600 bg-white/90 p-6 rounded-lg shadow-lg max-w-md mx-auto">
                            <p className="font-bold mb-4">{error}</p>
                            <button 
                                onClick={fetchCart} 
                                className="px-6 py-2 bg-[#1a3c40] text-white rounded-lg font-bold hover:bg-[#0d2526] transition-colors"
                            >
                                Coba Lagi
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* --- CART ITEMS LIST --- */}
                            <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-200">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                        className="w-5 h-5 cursor-pointer accent-orange-500"
                                    />
                                    <label className="font-bold text-gray-800 cursor-pointer select-none" onClick={handleSelectAll}>
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
                                                    className="w-5 h-5 cursor-pointer accent-orange-500 flex-shrink-0"
                                                />
                                                {/* Image */}
                                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-lg shadow-md flex-shrink-0 overflow-hidden">
                                                    {item.product.image ? (
                                                        <img 
                                                            src={getImageUrl(item.product.image) || ''} 
                                                            alt={item.product.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Img';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-400 to-teal-600 text-white text-xs">
                                                            No Image
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Mobile Info */}
                                                <div className="sm:hidden flex-1 ml-2">
                                                    <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{item.product.name}</h3>
                                                    <p className="text-sm text-gray-600">Rp{item.product.price.toLocaleString('id-ID')}</p>
                                                </div>
                                            </div>

                                            {/* Desktop Info */}
                                            <div className="hidden sm:block flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-800 mb-1">{item.product.name}</h3>
                                                <p className="text-sm text-gray-600">Rp{item.product.price.toLocaleString('id-ID')}</p>
                                                <p className="text-xs text-gray-400 mt-1">Stok: {item.product.stock}</p>
                                            </div>

                                            <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0 gap-4">
                                                <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-2 py-1 shadow-sm">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, -1)}
                                                        disabled={item.quantity <= 1}
                                                        className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-orange-600 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-8 text-center font-semibold text-gray-800">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, 1)}
                                                        disabled={item.quantity >= item.product.stock}
                                                        className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-orange-600 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <div className="hidden sm:block text-right min-w-[100px]">
                                                    <p className="font-bold text-orange-600">
                                                        Rp{getItemTotal(item).toLocaleString('id-ID')}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                                    title="Hapus Item"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {cartItems.length === 0 && (
                                        <div className="text-center py-10">
                                            <p className="text-gray-500 mb-4">Keranjang Anda kosong</p>
                                            <button 
                                                onClick={() => navigate('/merchlist')}
                                                className="px-6 py-2 bg-[#1a3c40] text-white rounded-lg font-bold hover:bg-[#0d2526] transition-colors"
                                            >
                                                Belanja Sekarang
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* --- SUMMARY SIDEBAR --- */}
                            <div className="lg:col-span-1">
                                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl sticky top-24">
                                    <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
                                        Ringkasan Belanja
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
                                            <p className="text-gray-400 text-sm text-center py-4">
                                                Pilih item untuk checkout
                                            </p>
                                        )}
                                    </div>

                                    <div className="pt-4 mb-6 border-t-2 border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-gray-800">Total:</span>
                                            <span className="text-xl font-bold text-orange-600">
                                                Rp{calculateTotal().toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {cartItems.filter(i => i.selected).length} item dipilih
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleCheckout}
                                        disabled={calculateTotal() === 0}
                                        className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                                            calculateTotal() > 0
                                                ? 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 cursor-pointer'
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
