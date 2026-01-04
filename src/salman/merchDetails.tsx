import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import listBg from "../assets/merchListBg.png";
import Navbar from './navBar';

const DUMMY_MERCH_DATA = [
    {
        id: 1,
        name: "ini adalah baju",
        price: "Rp20000",
        image: "/placeholder-merch.jpg",
        category: "Baju",
        stock: 24,
        description: "PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess free removal Pressure sensitive.",
        colors: ["#1E3A5F", "#F4A460"],
        sizes: ["XS", "S", "M", "L", "XL"],
        thumbnails: ["/placeholder-1.jpg", "/placeholder-2.jpg", "/placeholder-3.jpg", "/placeholder-4.jpg"]
    },
    {
        id: 2,
        name: "Kaos Keren Banget",
        price: "Rp15000",
        image: "/placeholder-merch.jpg",
        category: "Kaos",
        stock: 15,
        description: "Kaos premium dengan bahan yang adem dan tidak mudah luntur. Nyaman untuk daily wear.",
        colors: ["#1E3A5F", "#F4A460"],
        sizes: ["XS", "S", "M", "L", "XL"],
        thumbnails: ["/placeholder-1.jpg", "/placeholder-2.jpg", "/placeholder-3.jpg", "/placeholder-4.jpg"]
    },
    {
        id: 3,
        name: "Gantungan Kunci Lucu",
        price: "Rp5000",
        image: "/placeholder-merch.jpg",
        category: "Keychain",
        stock: 50,
        description: "Gantungan kunci dengan desain unik dan tahan lama. Cocok untuk koleksi atau hadiah.",
        colors: ["#1E3A5F", "#F4A460"],
        sizes: ["XS", "S", "M", "L", "XL"],
        thumbnails: ["/placeholder-1.jpg", "/placeholder-2.jpg", "/placeholder-3.jpg", "/placeholder-4.jpg"]
    },
    {
        id: 4,
        name: "Jaket Stylish Premium",
        price: "Rp150000",
        image: "/placeholder-merch.jpg",
        category: "Jaket",
        stock: 8,
        description: "Jaket stylish yang cocok untuk berbagai suasana. Material berkualitas tinggi.",
        colors: ["#1E3A5F", "#F4A460"],
        sizes: ["XS", "S", "M", "L", "XL"],
        thumbnails: ["/placeholder-1.jpg", "/placeholder-2.jpg", "/placeholder-3.jpg", "/placeholder-4.jpg"]
    },
];

const MerchDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const product = DUMMY_MERCH_DATA.find(item => item.id === parseInt(id || '0'));
    
    const [selectedThumbnail, setSelectedThumbnail] = useState(0);
    const [selectedColor, setSelectedColor] = useState(0);
    const [selectedSize, setSelectedSize] = useState("M");
    const [quantity, setQuantity] = useState(1);

    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#EAB775] to-[#F3CC91] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">Product Not Found</h1>
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

    const relatedItems = DUMMY_MERCH_DATA.filter(item => item.id !== product.id).slice(0, 4);

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
                    <button 
                        onClick={() => navigate('/merchlist')}
                        className="mb-6 flex items-center gap-2 text-white hover:text-white/80 transition-colors group bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-semibold">Ini Adalah Baju</span>
                    </button>
                    <div className="bg-gradient-to-b from-[#FFFFFF]/95 to-[#D1F4FC]/95 rounded-3xl shadow-2xl p-6 lg:p-8 backdrop-blur-md border border-white/30 mb-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">

                                <div className="bg-white rounded-2xl p-4 shadow-md">
                                    <div className="aspect-[4/3] bg-gradient-to-br from-[#1E3A5F] to-[#2A4A6F] relative overflow-hidden rounded-xl">
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-32 h-32 text-white/30" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    {product.thumbnails.map((thumb, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedThumbnail(index)}
                                            className={`bg-white rounded-xl p-2 shadow-sm transition-all ${
                                                selectedThumbnail === index 
                                                    ? 'ring-2 ring-[#5B9BD5] shadow-md' 
                                                    : 'hover:shadow-md'
                                            }`}
                                        >
                                            <div className="aspect-square bg-gradient-to-br from-[#1E3A5F] to-[#2A4A6F] rounded-lg flex items-center justify-center relative overflow-hidden">
                                                <svg className="w-8 h-8 text-white/30" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                                </svg>
                                                {index === 3 && (
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-2xl lg:text-3xl font-bold text-[#3d2314] mb-3">
                                    {product.name}
                                </h1>
                                <div className="mb-4">
                                    <p className="text-gray-600 text-sm mb-2">
                                        Stocks Available: {product.stock}
                                    </p>
                                    <p className="text-[#3d2314] font-bold text-3xl">
                                        {product.price}
                                    </p>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed mb-6">
                                    {product.description}
                                </p>
                                <div className="mb-6">
                                    <label className="block text-[#3d2314] font-bold mb-3">Colours:</label>
                                    <div className="flex gap-3">
                                        {product.colors.map((color, index) => (
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
                                <div className="mb-6">
                                    <label className="block text-[#3d2314] font-bold mb-3">Size:</label>
                                    <div className="flex gap-2">
                                        {product.sizes.map((size) => (
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
                                <div className="flex gap-3">
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
                                    <button className="flex-1 bg-[#CD853F] hover:bg-[#B8732F] text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-lg hover:shadow-xl">
                                        Add To Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
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
                                    <div className="aspect-square bg-gradient-to-br from-red-400 to-red-600 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
                                        <svg className="w-16 h-16 text-white/30" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-[#3d2314] text-sm mb-1 line-clamp-1">
                                        {item.name}
                                    </h3>
                                    <p className="text-[#CD853F] font-bold text-sm">
                                        {item.price}
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