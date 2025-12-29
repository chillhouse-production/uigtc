import React, { useState, useEffect } from 'react';
import listBg from "../assets/merchListBg.png";
import iconFilter from "../assets/iconFilter.png";
import Navbar from './navBar';
const DUMMY_MERCH_DATA = [
    {
        id: 1,
        name: "Baju Bagus Wow",
        price: "Rp1.000.000.000",
        image: "/placeholder-merch.jpg",
        category: "Baju",
        stock: 10
    },
    {
        id: 2,
        name: "Baju Bagus Wow",
        price: "Rp1.000.000.000",
        image: "/placeholder-merch.jpg",
        category: "Kaos",
        stock: 5
    },
    {
        id: 3,
        name: "Baju Bagus Wow",
        price: "Rp1.000.000.000",
        image: "/placeholder-merch.jpg",
        category: "Keychain",
        stock: 20
    },
    {
        id: 4,
        name: "Baju Bagus Wow",
        price: "Rp1.000.000.000",
        image: "/placeholder-merch.jpg",
        category: "Jaket",
        stock: 8
    },
    {
        id: 5,
        name: "Baju Bagus Wow",
        price: "Rp1.000.000.000",
        image: "/placeholder-merch.jpg",
        category: "Botol",
        stock: 15
    },
    {
        id: 6,
        name: "Baju Bagus Wow",
        price: "Rp1.000.000.000",
        image: "/placeholder-merch.jpg",
        category: "Gantungan Kunci",
        stock: 30
    },
    {
        id: 7,
        name: "Baju Bagus Wow",
        price: "Rp1.000.000.000",
        image: "/placeholder-merch.jpg",
        category: "Totebag",
        stock: 12
    },
    {
        id: 8,
        name: "Baju Bagus Wow",
        price: "Rp1.000.000.000",
        image: "/placeholder-merch.jpg",
        category: "Kaos",
        stock: 7
    },
    {
        id: 9,
        name: "Baju Bagus Wow",
        price: "Rp1.000.000.000",
        image: "/placeholder-merch.jpg",
        category: "Baju",
        stock: 18
    },
];

const CATEGORIES = [
    "Semua",
    "Pakaian",
    "Aksesoris",
    "Tiket",
    "Keychain",
    "Jaket",
    "Other",
    "Botol",
    "Gantungan Kunci",
    "Totebag"
];

const MerchList = () => {
    const [filteredData, setFilteredData] = useState(DUMMY_MERCH_DATA);
    const [selectedCategory, setSelectedCategory] = useState("Semua");

    useEffect(() => {
        if (selectedCategory === "Semua") {
            setFilteredData(DUMMY_MERCH_DATA);
        } else {
            const filtered = DUMMY_MERCH_DATA.filter(
                item => item.category.toLowerCase() === selectedCategory.toLowerCase()
            );
            setFilteredData(filtered);
        }
    }, [selectedCategory]);

    return (
        <>
            <section className="hidden lg:flex relative overflow-hidden min-h-screen w-full bg-gradient-to-b from-[#EAB775] to-[#F3CC91] overflow-x-hidden justify-center">
                <div
                    className="relative w-full max-w-[2000px] overflow-hidden border-l border-r border-[#3d2314]/30 flex flex-col items-center pt-24 bg-gradient-to-b from-[#EAB775] to-[#F3CC91]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), url(${listBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    <Navbar />
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-200/40 to-amber-300/40"></div>
                    <div className="relative z-10 w-full max-w-[1600px] flex flex-col items-center px-8">
                        <div className="w-full mb-8">
                            <div className="text-center">
                                <h1 className="text-4xl text-white font-bold"
                                    style={{
                                        fontFamily: 'serif',
                                        textShadow: '2px 2px 0px #3d2314, 4px 4px 0px rgba(61, 35, 20, 0.6), 6px 6px 0px rgba(61, 35, 20, 0.4)'
                                    }}>
                                    Banner - Our Merchandise
                                </h1>
                            </div>
                        </div>
                        <div className="w-full flex gap-6 pb-16">
                            <div className="w-64 flex-shrink-0">
                                <div className="bg-white/95 rounded-3xl shadow-2xl p-6 backdrop-blur-md border border-white/30 sticky top-24">
                                    <div className="flex items-center gap-3 mb-6">
                                        <svg className="w-6 h-6 text-[#3d2314]" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                                        </svg>
                                        <h2 className="text-lg font-bold text-[#3d2314]">Filter</h2>
                                    </div>
                                    <div className="space-y-2">
                                        {CATEGORIES.map((category) => (
                                            <button
                                                key={category}
                                                onClick={() => setSelectedCategory(category)}
                                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${selectedCategory === category
                                                    ? 'bg-[#5B9BD5] text-white shadow-lg'
                                                    : 'bg-gray-100 text-[#3d2314] hover:bg-gray-200'
                                                    }`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="bg-white/95 rounded-3xl shadow-2xl p-8 backdrop-blur-md border border-white/30">
                                    {filteredData.length === 0 ? (
                                        <div className="text-center py-20">
                                            <p className="text-gray-600 text-lg">No items found in this category</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                            {filteredData.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="group bg-gradient-to-br from-[#D4F1F9] to-[#A8E0F0] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
                                                >
                                                    {/* Image Container */}
                                                    <div className="aspect-square bg-gradient-to-br from-[#89CFF0] to-[#5FB8D9] relative overflow-hidden">
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <svg className="w-20 h-20 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                                            </svg>
                                                        </div>
                                                        {item.stock < 10 && (
                                                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                                Low Stock
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Info Container */}
                                                    <div className="p-4">
                                                        <h3 className="font-bold text-[#3d2314] text-base mb-2 line-clamp-2">
                                                            {item.name}
                                                        </h3>
                                                        <p className="text-[#3d2314] font-semibold text-sm mb-1">
                                                            {item.price}
                                                        </p>
                                                        <p className="text-gray-600 text-xs">
                                                            Stock: {item.stock}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="lg:hidden relative min-h-screen w-full bg-gradient-to-b from-[#EAB775] to-[#F3CC91]">
                <Navbar />
                <div
                    className="relative w-full min-h-screen bg-gradient-to-b from-[#EAB775] to-[#F3CC91]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), url(${listBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-200/40 to-amber-300/40"></div>

                    <div className="relative z-10 w-full">
                        {/* Banner Section */}
                        <div className="px-4 pt-20 pb-4">
                            <div className="text-center">
                                <h1 className="text-2xl text-white font-bold"
                                    style={{
                                        fontFamily: 'serif',
                                        textShadow: '2px 2px 0px #3d2314, 4px 4px 0px rgba(61, 35, 20, 0.6), 6px 6px 0px rgba(61, 35, 20, 0.4)'
                                    }}>
                                    Banner - Our Merchandise
                                </h1>
                            </div>
                        </div>

                        {/* Filter Section - Horizontal Scroll */}
                        <div className="px-4 pb-4">
                            <div className="bg-white/95 rounded-2xl shadow-xl p-4 backdrop-blur-md border border-white/30">
                                <div className="flex items-center gap-2 mb-3">
                                    <svg className="w-5 h-5 text-[#3d2314]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                                    </svg>
                                    <h2 className="text-base font-bold text-[#3d2314]">Filter</h2>
                                </div>

                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {CATEGORIES.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${selectedCategory === category
                                                ? 'bg-[#5B9BD5] text-white shadow-lg'
                                                : 'bg-gray-100 text-[#3d2314]'
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="px-4 pb-8">
                            <div className="bg-white/95 rounded-2xl shadow-xl p-4 backdrop-blur-md border border-white/30">
                                {filteredData.length === 0 ? (
                                    <div className="text-center py-16">
                                        <p className="text-gray-600 text-sm">No items found in this category</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        {filteredData.map((item) => (
                                            <div
                                                key={item.id}
                                                className="bg-gradient-to-br from-[#D4F1F9] to-[#A8E0F0] rounded-xl overflow-hidden shadow-md active:scale-95 transition-transform"
                                            >
                                                <div className="aspect-square bg-gradient-to-br from-[#89CFF0] to-[#5FB8D9] relative">
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <svg className="w-12 h-12 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                                        </svg>
                                                    </div>
                                                    {item.stock < 10 && (
                                                        <div className="absolute top-1 right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                                            Low Stock
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-3">
                                                    <h3 className="font-bold text-[#3d2314] text-sm mb-1 line-clamp-2">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-[#3d2314] font-semibold text-xs mb-1">
                                                        {item.price}
                                                    </p>
                                                    <p className="text-gray-600 text-[10px]">
                                                        Stock: {item.stock}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </>
    );
};

export default MerchList;