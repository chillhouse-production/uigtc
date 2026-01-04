import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import listBg from "../assets/merchListBg.png";
import Navbar from './navBar';
import { productApi, API_BASE_URL, type Product } from '../config/api';

const MerchDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // --- STATE ---
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedItems, setRelatedItems] = useState<Product[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    
    // State untuk Modal Pop-up
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [quantity, setQuantity] = useState(1);

    // --- FETCH PRODUCT ---
    useEffect(() => {
        async function fetchProduct() {
            if (!id) return;
            
            try {
                setLoading(true);
                const response = await productApi.getById(id);
                
                if (response.success && response.data) {
                    setProduct(response.data);
                    
                    // Fetch related products
                    const allProductsRes = await productApi.getAll();
                    if (allProductsRes.success && allProductsRes.data) {
                        const related = allProductsRes.data
                            .filter(item => item.id !== id)
                            .slice(0, 4);
                        setRelatedItems(related);
                    }
                } else {
                    setError('Product tidak ditemukan');
                }
            } catch (err) {
                console.error('Failed to fetch product:', err);
                setError(err instanceof Error ? err.message : 'Gagal memuat produk');
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [id]);

    // --- HELPERS ---
    const formatCurrency = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    // --- LOGIC STOCK VISIBILITY ---
    const shouldShowStock = (item: Product) => {
        // Asumsi: 'category' object memiliki properti 'type' (seperti di MerchList)
        // Jika type 'ticket' dan stock >= 10, sembunyikan angka
        if (item.category?.type === 'ticket') {
            return item.stock < 10; 
        }
        // Selain tiket (merch), selalu tampilkan
        return true;
    };

    const handleQuantityChange = (type: 'increase' | 'decrease') => {
        if (!product) return;
        if (type === 'increase' && quantity < product.stock) {
            setQuantity(prev => prev + 1);
        } else if (type === 'decrease' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    // --- ADD TO CART HANDLER ---
    const handleAddToCart = async () => {
        if (!product) return;

        const token = localStorage.getItem('token');
        if (!token) {
            alert("Silakan login terlebih dahulu untuk berbelanja!");
            return;
        }

        setIsAddingToCart(true);

        try {
            const response = await fetch(`${API_BASE_URL}/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: product.id,
                    quantity: quantity
                })
            });

            const result = await response.json();

            if (response.ok) {
                setShowSuccessModal(true);
            } else {
                alert(result.message || "Gagal menambahkan ke keranjang.");
            }

        } catch (error) {
            console.error("Add to cart error:", error);
            alert("Terjadi kesalahan koneksi saat menambahkan ke keranjang.");
        } finally {
            setIsAddingToCart(false);
        }
    };

    // --- RENDER LOADING / ERROR ---
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#EAB775] to-[#F3CC91] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2314] mx-auto"></div>
                    <p className="mt-4 text-[#3d2314] font-serif">Memuat produk...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#EAB775] to-[#F3CC91] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">{error || 'Product Not Found'}</h1>
                    <button 
                        onClick={() => navigate('/merchlist')}
                        className="bg-white text-[#3d2314] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <section className="relative min-h-screen w-full bg-gradient-to-b from-[#EAB775] to-[#F3CC91]">
            
            {/* --- CUSTOM SUCCESS MODAL --- */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 relative overflow-hidden border-4 border-[#CD853F] animate-scale-up">
                        <div className="absolute top-0 left-0 w-full h-2 bg-[#CD853F]"></div>
                        
                        <div className="text-center mt-2">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-[#3d2314] mb-2 font-serif">Berhasil Masuk Keranjang!</h3>
                            <p className="text-gray-600 mb-6 text-sm">
                                <span className="font-bold text-[#CD853F]">{quantity}x {product.name}</span> telah ditambahkan.
                            </p>
                            
                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={() => navigate('/cart')} 
                                    className="w-full py-3 bg-[#CD853F] hover:bg-[#B8732F] text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                    Lihat Keranjang
                                </button>
                                
                                <button 
                                    onClick={() => setShowSuccessModal(false)}
                                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                                >
                                    Lanjut Belanja
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div
                className="relative w-full min-h-screen"
                style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)), url(${listBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <Navbar />
                <div className="absolute inset-0 bg-gradient-to-b from-amber-200/30 to-amber-300/30 pointer-events-none"></div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
                    {/* Back Button */}
                    <button 
                        onClick={() => navigate('/merchlist')}
                        className="mb-6 flex items-center gap-2 text-white hover:text-white/80 transition-colors group bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full w-fit"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-semibold">Kembali ke Daftar</span>
                    </button>

                    {/* Main Product Card */}
                    <div className="bg-gradient-to-b from-[#FFFFFF]/95 to-[#D1F4FC]/95 rounded-3xl shadow-2xl p-6 lg:p-8 backdrop-blur-md border border-white/30 mb-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            
                            {/* Left Side - Image Gallery */}
                            <div className="space-y-4">
                                <div className="bg-white rounded-2xl p-4 shadow-md">
                                    <div className="aspect-[4/3] bg-gradient-to-br from-[#1E3A5F] to-[#2A4A6F] relative overflow-hidden rounded-xl group">
                                        {product.image ? (
                                            <img 
                                                src={`${API_BASE_URL.replace('/api', '')}${product.image}`}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                                }}
                                            />
                                        ) : null}
                                        
                                        <div className={`w-full h-full flex items-center justify-center ${product.image ? 'hidden' : ''}`}>
                                            <svg className="w-32 h-32 text-white/30" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                            </svg>
                                        </div>

                                        {product.stock <= 0 && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                                                <span className="bg-red-500 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg rotate-[-10deg]">
                                                    STOK HABIS
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {product.category && (
                                    <div className="flex justify-center">
                                        <span className="px-4 py-2 bg-[#E3FEF7] text-[#135D66] rounded-full font-semibold shadow-sm border border-[#135D66]/20">
                                            {product.category.name}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Right Side - Product Info */}
                            <div className="flex flex-col h-full">
                                <h1 className="text-3xl lg:text-4xl font-bold text-[#3d2314] mb-2 font-serif leading-tight">
                                    {product.name}
                                </h1>

                                {/* Stock and Price */}
                                <div className="flex items-center gap-4 mb-6">
                                    <p className="text-[#CD853F] font-bold text-3xl">
                                        {formatCurrency(product.price)}
                                    </p>
                                    <div className="h-6 w-px bg-gray-300"></div>
                                    
                                    {/* --- LOGIC VISIBILITY STOK --- */}
                                    {shouldShowStock(product) ? (
                                        <p className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                            {product.stock > 0 ? `Tersedia: ${product.stock} Unit` : 'Stok Habis'}
                                        </p>
                                    ) : (
                                        <p className="text-sm font-bold text-green-600">
                                            Tersedia
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="bg-white/50 rounded-xl p-4 mb-8 border border-white/50 flex-1">
                                    <h3 className="font-bold text-[#3d2314] mb-2 text-sm uppercase tracking-wide opacity-70">Deskripsi Produk</h3>
                                    <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                                        {product.description || 'Tidak ada deskripsi untuk produk ini.'}
                                    </p>
                                </div>

                                {/* Action Area */}
                                <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 mt-auto">
                                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                                        {/* Quantity Selector */}
                                        <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden w-full sm:w-auto h-12 bg-gray-50">
                                            <button
                                                onClick={() => handleQuantityChange('decrease')}
                                                disabled={product.stock <= 0 || isAddingToCart || quantity <= 1}
                                                className="w-12 h-full hover:bg-gray-200 text-[#3d2314] font-bold text-xl flex items-center justify-center transition-colors disabled:opacity-30"
                                            >
                                                −
                                            </button>
                                            <div className="w-14 h-full flex items-center justify-center font-bold text-[#3d2314] bg-white border-x-2 border-gray-200">
                                                {quantity}
                                            </div>
                                            <button
                                                onClick={() => handleQuantityChange('increase')}
                                                disabled={product.stock <= 0 || isAddingToCart || quantity >= product.stock}
                                                className="w-12 h-full hover:bg-gray-200 text-[#3d2314] font-bold text-xl flex items-center justify-center transition-colors disabled:opacity-30"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Add to Cart Button */}
                                        <button 
                                            onClick={handleAddToCart}
                                            disabled={product.stock <= 0 || isAddingToCart}
                                            className={`flex-1 w-full h-12 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${
                                                product.stock > 0 && !isAddingToCart
                                                    ? 'bg-gradient-to-r from-[#CD853F] to-[#B8732F] text-white hover:shadow-orange-200/50 hover:scale-[1.02] active:scale-[0.98]'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                        >
                                            {isAddingToCart ? (
                                                <>
                                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                    Memproses...
                                                </>
                                            ) : product.stock > 0 ? (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                                    Add to Cart
                                                </>
                                            ) : (
                                                'Stok Habis'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Items Section */}
                    {relatedItems.length > 0 && (
                        <div className="bg-white/80 rounded-3xl shadow-xl p-6 lg:p-8 backdrop-blur-md border border-white/50">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-8 bg-[#CD853F] rounded-full"></div>
                                <h2 className="text-2xl font-bold text-[#3d2314] font-serif">Mungkin Anda Suka</h2>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {relatedItems.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => navigate(`/product/${item.id}`)}
                                        className="group cursor-pointer bg-white rounded-xl p-3 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
                                    >
                                        <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
                                            {item.image ? (
                                                <img 
                                                    src={`${API_BASE_URL.replace('/api', '')}${item.image}`}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                                    }}
                                                />
                                            ) : null}
                                            <div className={`w-full h-full flex items-center justify-center absolute inset-0 bg-gray-200 ${item.image ? 'hidden' : ''}`}>
                                                <span className="text-2xl opacity-30">📦</span>
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-[#3d2314] text-sm mb-1 line-clamp-2 h-10 group-hover:text-[#CD853F] transition-colors">
                                            {item.name}
                                        </h3>
                                        <p className="text-[#CD853F] font-bold text-sm">
                                            {formatCurrency(item.price)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default MerchDetails;