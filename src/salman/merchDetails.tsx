import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import listBg from "../assets/merchListBg.png";
import Navbar from './navBar';
import { productApi, API_BASE_URL, type Product } from '../config/api';

const MerchDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedItems, setRelatedItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [selectedThumbnail, setSelectedThumbnail] = useState(0);
    const [selectedColor, setSelectedColor] = useState(0);
    const [selectedSize, setSelectedSize] = useState("M");
    const [quantity, setQuantity] = useState(1);

    const colors = ["#1E3A5F", "#F4A460"];
    const sizes = ["XS", "S", "M", "L", "XL"];

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

    const formatCurrency = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

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

    const handleQuantityChange = (type: 'increase' | 'decrease') => {
        if (type === 'increase' && quantity < product.stock) {
            setQuantity(prev => prev + 1);
        } else if (type === 'decrease' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = () => {
        // TODO: Implement add to cart functionality
        alert(`Added ${quantity}x ${product.name} to cart!`);
    };

    return (
        <section className="relative min-h-screen w-full bg-gradient-to-b from-[#EAB775] to-[#F3CC91]">
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
                <div className="absolute inset-0 bg-gradient-to-b from-amber-200/30 to-amber-300/30"></div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
                    {/* Back Button */}
                    <button 
                        onClick={() => navigate('/merchlist')}
                        className="mb-6 flex items-center gap-2 text-white hover:text-white/80 transition-colors group bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-semibold">Ini Adalah Baju</span>
                    </button>

                    {/* Main Product Card */}
                    <div className="bg-gradient-to-b from-[#FFFFFF]/95 to-[#D1F4FC]/95 rounded-3xl shadow-2xl p-6 lg:p-8 backdrop-blur-md border border-white/30 mb-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Side - Image Gallery */}
                            <div className="space-y-4">
                                {/* Main Image */}
                                <div className="bg-white rounded-2xl p-4 shadow-md">
                                    <div className="aspect-[4/3] bg-gradient-to-br from-[#1E3A5F] to-[#2A4A6F] relative overflow-hidden rounded-xl">
                                        {product.image ? (
                                            <img 
                                                src={`${API_BASE_URL.replace('/api', '')}${product.image}`}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-32 h-32 text-white/30" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                                </svg>
                                            </div>
                                        )}
                                        {product.stock <= 0 && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <span className="bg-red-500 text-white px-6 py-3 rounded-full font-bold text-xl">Stok Habis</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Category Badge */}
                                {product.category && (
                                    <div className="flex justify-center">
                                        <span className="px-4 py-2 bg-[#E3FEF7] text-[#135D66] rounded-full font-semibold">
                                            {product.category.name}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Right Side - Product Info */}
                            <div className="flex flex-col">
                                {/* Product Title */}
                                <h1 className="text-2xl lg:text-3xl font-bold text-[#3d2314] mb-3">
                                    {product.name}
                                </h1>

                                {/* Stock and Price */}
                                <div className="mb-4">
                                    <p className="text-gray-600 text-sm mb-2">
                                        Stocks Available: {product.stock}
                                    </p>
                                    <p className="text-[#3d2314] font-bold text-3xl">
                                        {formatCurrency(product.price)}
                                    </p>
                                </div>

                                {/* Description */}
                                <p className="text-gray-700 text-sm leading-relaxed mb-6">
                                    {product.description || 'Tidak ada deskripsi untuk produk ini.'}
                                </p>

                                {/* Color Selection - Show only for certain product types */}
                                {product.productType === 'merchandise' && (
                                    <div className="mb-6">
                                        <label className="block text-[#3d2314] font-bold mb-3">Colours:</label>
                                        <div className="flex gap-3">
                                            {colors.map((color, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedColor(index)}
                                                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                                                        selectedColor === index 
                                                            ? 'border-[#3d2314] scale-110 shadow-lg' 
                                                            : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Size Selection - Show only for clothing items */}
                                {product.productType === 'merchandise' && (
                                    <div className="mb-6">
                                        <label className="block text-[#3d2314] font-bold mb-3">Size:</label>
                                        <div className="flex gap-2">
                                            {sizes.map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${
                                                        selectedSize === size
                                                            ? 'bg-[#CD853F] text-white shadow-md'
                                                            : 'bg-gray-100 text-[#3d2314] hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Quantity and Add to Cart */}
                                <div className="flex gap-3">
                                    {/* Quantity Selector */}
                                    <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => handleQuantityChange('decrease')}
                                            className="w-10 h-10 bg-white hover:bg-gray-100 text-[#3d2314] font-bold text-lg flex items-center justify-center transition-colors"
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            readOnly
                                            className="w-16 h-10 text-center border-x-2 border-gray-300 font-semibold text-[#3d2314] bg-white"
                                        />
                                        <button
                                            onClick={() => handleQuantityChange('increase')}
                                            className="w-10 h-10 bg-white hover:bg-gray-100 text-[#3d2314] font-bold text-lg flex items-center justify-center transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button 
                                        onClick={handleAddToCart}
                                        disabled={product.stock <= 0}
                                        className={`flex-1 px-6 py-3 rounded-lg font-bold transition-colors shadow-lg hover:shadow-xl ${
                                            product.stock > 0 
                                                ? 'bg-[#CD853F] hover:bg-[#B8732F] text-white cursor-pointer'
                                                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                        }`}
                                    >
                                        {product.stock > 0 ? 'Add To Cart' : 'Stok Habis'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Items Section */}
                    <div className="bg-gradient-to-b from-[#FFFFFF]/95 to-[#D1F4FC]/95 rounded-3xl shadow-2xl p-6 lg:p-8 backdrop-blur-md border border-white/30">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-8 bg-[#CD853F] rounded-full"></div>
                            <h2 className="text-2xl font-bold text-[#3d2314]">Related Items</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {relatedItems.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => navigate(`/product/${item.id}`)}
                                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer p-3"
                                >
                                    <div className="aspect-square bg-gradient-to-br from-[#89CFF0] to-[#5FB8D9] rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
                                        {item.image ? (
                                            <img 
                                                src={`${API_BASE_URL.replace('/api', '')}${item.image}`}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <svg className="w-16 h-16 text-white/30" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                            </svg>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-[#3d2314] text-sm mb-1 line-clamp-1">
                                        {item.name}
                                    </h3>
                                    <p className="text-[#CD853F] font-bold text-sm">
                                        {formatCurrency(item.price)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MerchDetails;