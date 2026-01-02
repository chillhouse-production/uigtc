import { useState } from 'react';
import listBg from '../assets/CartBackground.jpeg';
import Navbar from './navBar';
import Footer from './footer';

export default function CartPage() {
    const [cartItems, setCartItems] = useState([
        { id: 1, name: "Baju Bagus Wow", price: 1000000, quantity: 1, selected: true },
        { id: 2, name: "Tiket", price: 1000000, quantity: 2, selected: true },
        { id: 3, name: "Celana", price: 1000000, quantity: 1, selected: true },
    ]);

    const [selectAll, setSelectAll] = useState(true);

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setCartItems(cartItems.map(item => ({ ...item, selected: newSelectAll })));
    };

    const handleSelectItem = (id: number) => {
        const updatedItems = cartItems.map(item =>
            item.id === id ? { ...item, selected: !item.selected } : item
        );
        setCartItems(updatedItems);
        setSelectAll(updatedItems.every(item => item.selected));
    };

    const handleQuantityChange = (id: number, delta: number) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    const handleDelete = (id: number) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const calculateTotal = () => {
        return cartItems
            .filter(item => item.selected)
            .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const getItemTotal = (item: any) => {
        return item.price * item.quantity;
    };

    const handleCheckout = () => {
        if (calculateTotal() > 0) {
            alert('Proceeding to checkout...');
        }
    };

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

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-200">
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                    className="w-5 h-5 cursor-pointer accent-orange-500"
                                />
                                <label className="font-bold text-gray-800 cursor-pointer select-none" onClick={handleSelectAll}>
                                    All Products
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
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg shadow-md flex-shrink-0"></div>
                                            <div className="sm:hidden flex-1 ml-2">
                                                <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h3>
                                                <p className="text-sm text-gray-600">Rp{item.price.toLocaleString('id-ID')}</p>
                                            </div>
                                        </div>
                                        <div className="hidden sm:block flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-800 mb-1">{item.name}</h3>
                                            <p className="text-sm text-gray-600">Rp{item.price.toLocaleString('id-ID')}</p>
                                            <p className="text-xs text-gray-400 mt-1">*while available</p>
                                        </div>
                                        <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0 gap-4">
                                            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-2 py-1 shadow-sm">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, -1)}
                                                    className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-orange-600 font-bold transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center font-semibold text-gray-800">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, 1)}
                                                    className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-orange-600 font-bold transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                                title="Remove Item"
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
                                    <div className="text-center py-10 text-gray-500">
                                        Your cart is empty.
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl sticky top-24">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
                                    Cart Total
                                </h2>

                                <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {cartItems.filter(item => item.selected).map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="text-gray-700 line-clamp-1 flex-1 pr-2">{item.name}</span>
                                            <div className="text-right whitespace-nowrap">
                                                <span className="text-gray-500 text-xs mr-2">{item.quantity}x</span>
                                                <span className="text-gray-800 font-semibold">
                                                    Rp{getItemTotal(item).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 mb-6 border-t-2 border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-800">Total:</span>
                                        <span className="text-xl font-bold text-orange-600">
                                            Rp{calculateTotal().toLocaleString('id-ID')}
                                        </span>
                                    </div>
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
                                    Checkout Now
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
                
                <Footer />
            </div>
        </section>
    );
}