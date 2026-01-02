import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import cartBackGround from '../assets/CartBackground.jpeg'
import Navbar from '../salman/navBar';
import Footer from '../salman/footer';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Dummy Data for Items
    const items = [
        { id: 1, name: "Baju Bagus Wow", price: 1000000, quantity: 1, image: "bg-teal-500" },
        { id: 2, name: "Tiket", price: 1000000, quantity: 3, image: "bg-teal-500" },
        { id: 3, name: "Celana", price: 1000000, quantity: 1, image: "bg-teal-500" },
    ];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedFile(file.name);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleConfirm = () => {
        if (uploadedFile) {
            navigate('/transactionsuccess');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText('1290328292');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

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
                                <span className="text-base">John Doe</span>
                            </div>
                            <div className="grid grid-cols-[140px_1fr] items-center">
                                <span className="font-bold text-base">School</span>
                                <span className="text-base">SMAN 1 Makassar</span>
                            </div>
                            <div className="grid grid-cols-[140px_1fr] items-center">
                                <span className="font-bold text-base">Phone Number</span>
                                <span className="text-base">0857212211</span>
                            </div>
                            <div className="grid grid-cols-[140px_1fr] items-center">
                                <span className="font-bold text-base">Email</span>
                                <span className="text-base break-words">johndoe@gmail.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Items (4 cols) */}
                    <div className="lg:col-span-5 bg-white rounded-lg p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-[#1a3c40] mb-6 font-serif">Items</h2>
                        <div className="space-y-6">
                            {items.map((item, index) => (
                                <div key={item.id} className={`flex gap-4 pb-6 ${index !== items.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                    {/* Item Image Placeholder */}
                                    <div className={`w-24 h-16 rounded-lg shadow-sm ${item.image} bg-gradient-to-br from-teal-400 to-teal-600`}></div>

                                    <div className="flex-1 flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-[#1a3c40] text-sm mb-1">{item.name}</h3>
                                            <p className="text-xs font-bold text-[#564e3e]">Rp{item.price.toLocaleString('id-ID')}</p>
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
                            <span className="font-bold text-xl text-gray-600">Rp4.000.000</span>
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
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                                accept="image/*,.pdf"
                            />

                            <button
                                onClick={handleUploadClick}
                                className="w-full py-3 bg-[#e89c3f] hover:bg-[#d68b2e] text-[#1a3c40] font-bold text-sm rounded-lg shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                                Masukkan Bukti Pembayaran
                            </button>

                            {uploadedFile && (
                                <div className="flex items-center justify-center gap-2 bg-[#e5e7eb] py-2 rounded-lg text-[#374151]">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                        <polyline points="10 9 9 9 8 9"></polyline>
                                    </svg>
                                    <span className="text-sm font-serif font-medium tracking-wide">{uploadedFile}</span>
                                </div>
                            )}

                            <button
                                onClick={handleConfirm}
                                disabled={!uploadedFile}
                                className={`w-full py-3 font-bold text-sm rounded-lg transition-all border-none ${uploadedFile
                                    ? 'bg-[#1a3c40] text-white hover:bg-[#122b2e] cursor-pointer shadow-lg'
                                    : 'bg-[#f5f5f5] text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>

                </div>
            </div>
            <Footer/>
        </div>
    );
}
