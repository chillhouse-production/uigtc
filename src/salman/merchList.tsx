import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import listBg from "../assets/merchListBg.png";
import iconFilter from "../assets/iconFilter.png";
import Navbar from './navBar';
import Footer from './footer';

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

const CATEGORIES: string[] = [
    "Ticket",
    "Keychain",
    "Memopad",
    "Sticker",
    "Photocard",
    "Sticker Set",
    "Totebag"
];

const MerchList = () => {
    const navigate = useNavigate();
    const [selectedCategoriesDesktop, setSelectedCategoriesDesktop] = useState<string[]>([]);
    const [filteredDataDesktop, setFilteredDataDesktop] = useState(DUMMY_MERCH_DATA);
    const [selectedCategoryMobile, setSelectedCategoryMobile] = useState("Semua");
    const [filteredDataMobile, setFilteredDataMobile] = useState(DUMMY_MERCH_DATA);

    useEffect(() => {
        if (selectedCategoriesDesktop.length === 0) {
            setFilteredDataDesktop(DUMMY_MERCH_DATA);
        } else {
            const filtered = DUMMY_MERCH_DATA.filter(item =>
                selectedCategoriesDesktop.some(category =>
                    item.category.toLowerCase() === category.toLowerCase()
                )
            );
            setFilteredDataDesktop(filtered);
        }
    }, [selectedCategoriesDesktop]);

    useEffect(() => {
        if (selectedCategoryMobile === "Semua") {
            setFilteredDataMobile(DUMMY_MERCH_DATA);
        } else {
            const filtered = DUMMY_MERCH_DATA.filter(
                item => item.category.toLowerCase() === selectedCategoryMobile.toLowerCase()
            );
            setFilteredDataMobile(filtered);
        }
    }, [selectedCategoryMobile]);

    const handleCheckboxChange = (category: string) => {
        setSelectedCategoriesDesktop(prev => {
            if (prev.includes(category)) {
                return prev.filter(c => c !== category);
            } else {
                return [...prev, category];
            }
        });
    };

    return (
        <>
<section className="hidden lg:flex absolute min-h-screen w-full bg-gradient-to-b from-[#EAB775] to-[#F3CC91] overflow-x-hidden justify-center" >

    <div
        // 1. Tambahkan min-h-screen dan flex flex-col di sini
        className="relative w-full max-w-[2000px] min-h-screen overflow-hidden border-l border-r border-[#3d2314]/30 flex flex-col items-center pt-24 bg-gradient-to-b from-[#EAB775] to-[#F3CC91]"
        style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)), url(${listBg})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed'
        }}
    >
        <Navbar />
        
        {/* Overlay gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-200/30 to-amber-300/30 pointer-events-none"></div>

        {/* 2. Tambahkan flex-1 di sini agar konten mengisi ruang kosong dan mendorong Footer ke bawah */}
        <div className="relative z-10 w-full max-w-[1600px] flex-1 flex flex-col items-center px-8 pb-16">

            <div className="w-full mb-8">
                <div className="text-center">
                    <h1 className="text-5xl text-white font-bold tracking-wider"
                        style={{
                            fontFamily: 'treamd',
                            textShadow: '3px 3px 0px #3d2314, 5px 5px 0px rgba(61, 35, 20, 0.5)'
                        }}>
                        MERCHANDISE AND TICKET
                    </h1>
                </div>
            </div>

            <div className="w-full flex gap-6">
                {/* Sidebar Filter */}
                <div className="w-64 flex-shrink-0">
                    <div className="bg-gradient-to-b from-[#FFFFFF] to-[#D1F4FC] rounded-3xl shadow-2xl p-6 backdrop-blur-md border border-white/30 sticky top-32">
                        <div className="flex items-center gap-2 mb-6">
                            <svg className="w-5 h-5 text-[#3d2314]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                            </svg>
                            <h2 className="text-lg font-bold text-[#3d2314]">Filter</h2>
                        </div>

                        <div className="space-y-3">
                            {CATEGORIES.map((category) => (
                                <label
                                    key={category}
                                    className="flex items-center gap-3 cursor-pointer group"
                                >
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategoriesDesktop.includes(category)}
                                            onChange={() => handleCheckboxChange(category)}
                                            className="w-5 h-5 rounded border-2 border-gray-300 text-[#5B9BD5] focus:ring-2 focus:ring-[#5B9BD5] cursor-pointer"
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-[#3d2314] group-hover:text-[#5B9BD5] transition-colors">
                                        {category}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Grid Content */}
                <div className="flex-1">
                    <div className="bg-gradient-to-b from-[#FFFFFF] to-[#D1F4FC] rounded-3xl shadow-2xl p-6 backdrop-blur-md border border-white/30 min-h-[500px]">
                        {filteredDataDesktop.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-gray-600 text-lg">No items found in selected categories</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredDataDesktop.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => navigate(`/product/${item.id}`)}
                                        className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer p-4"
                                    >
                                        <div className="aspect-[4/3] bg-gradient-to-br from-[#89CFF0] to-[#5FB8D9] relative overflow-hidden rounded-2xl mb-4">
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-20 h-20 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                                </svg>
                                            </div>
                                        </div>

                                        <div className="px-2">
                                            <h3 className="font-bold text-[#3d2314] text-lg mb-3 line-clamp-2">
                                                {item.name}
                                            </h3>
                                            <p className="text-[#8B4513] font-bold text-xl mb-2">
                                                {item.price}
                                            </p>
                                            <p className="text-gray-500 text-sm font-medium">
                                                Stocks Available: {item.stock}
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

        <Footer />
        
    </div>
</section>

            <section className="lg:hidden relative min-h-screen w-full bg-gradient-to-b from-[#EAB775] to-[#F3CC91]">
                <Navbar />
                <div
                    className="relative w-full min-h-screen bg-gradient-to-b from-[#EAB775] to-[#F3CC91]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)), url(${listBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-200/30 to-amber-300/30"></div>

                    <div className="relative z-10 w-full">
                        <div className="px-4 pt-20 pb-4">
                            <div className="text-center">
                                <h1 className="text-2xl text-white font-bold"
                                    style={{
                                        fontFamily: 'treamd',
                                        textShadow: '2px 2px 0px #3d2314, 4px 4px 0px rgba(61, 35, 20, 0.6)'
                                    }}>
                                    MERCHANDISE AND TICKET
                                </h1>
                            </div>
                        </div>

                        <div className="px-4 pb-4">
                            <div className="bg-white/95 rounded-2xl shadow-xl p-4 backdrop-blur-md border border-white/30">
                                <div className="flex items-center gap-2 mb-3">
                                    <svg className="w-5 h-5 text-[#3d2314]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                                    </svg>
                                    <h2 className="text-base font-bold text-[#3d2314]">Filter</h2>
                                </div>

                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    <button
                                        onClick={() => setSelectedCategoryMobile("Semua")}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${selectedCategoryMobile === "Semua"
                                                ? 'bg-[#5B9BD5] text-white shadow-lg'
                                                : 'bg-gray-100 text-[#3d2314]'
                                            }`}
                                    >
                                        Semua
                                    </button>
                                    {CATEGORIES.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategoryMobile(category)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${selectedCategoryMobile === category
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
                        <div className="px-4 pb-32">
                            <div className="bg-white/95 rounded-2xl shadow-xl p-4 backdrop-blur-md border border-white/30">
                                {filteredDataMobile.length === 0 ? (
                                    <div className="text-center py-16">
                                        <p className="text-gray-600 text-sm">No items found in this category</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        {filteredDataMobile.map((item) => (
                                            <div
                                                key={item.id}
                                                onClick={() => navigate(`/product/${item.id}`)}
                                                className="bg-white rounded-3xl shadow-lg active:scale-95 transition-transform p-3"
                                            >
                                                <div className="aspect-[4/3] bg-gradient-to-br from-[#89CFF0] to-[#5FB8D9] relative rounded-2xl mb-3">
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <svg className="w-12 h-12 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="px-1">
                                                    <h3 className="font-bold text-[#3d2314] text-base mb-2 line-clamp-2">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-[#8B4513] font-bold text-base mb-1">
                                                        {item.price}
                                                    </p>
                                                    <p className="text-gray-500 text-xs font-medium">
                                                        Stocks Available: {item.stock}
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
                <div className="bottom-0 left-0 w-full z-50">
                    <Footer />
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