import { useState } from 'react';
import listBg from '../assets/CartBackground.jpeg';

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
        <div className="min-h-screen" style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)), url(${listBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
            <div className="max-w-7xl mx-auto p-8 pb-16">
                {/* Header */}
                <h1 className="text-5xl font-bold text-center mb-12 text-white pt-4" style={{
                    textShadow: '3px 3px 0px rgba(0,0,0,0.3), -1px -1px 0px rgba(0,0,0,0.1)',
                    fontFamily: 'Georgia, serif',
                    letterSpacing: '2px'
                }}>
                    My Cart
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Section - Products List */}
                    <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                        {/* Select All Checkbox */}
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-200">
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                                className="w-5 h-5 cursor-pointer accent-orange-500"
                            />
                            <label className="font-bold text-gray-800 cursor-pointer" onClick={handleSelectAll}>
                                All Products
                            </label>
                        </div>

                        {/* Product Items */}
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                                    {/* Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={item.selected}
                                        onChange={() => handleSelectItem(item.id)}
                                        className="w-5 h-5 cursor-pointer accent-orange-500 flex-shrink-0"
                                    />

                                    {/* Product Image */}
                                    <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg shadow-md flex-shrink-0"></div>

                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-800 mb-1">{item.name}</h3>
                                        <p className="text-sm text-gray-600">Rp{item.price.toLocaleString('id-ID')}</p>
                                        <p className="text-xs text-gray-400 mt-1">*while available 2X</p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-2 py-1 flex-shrink-0">
                                        <button
                                            onClick={() => handleQuantityChange(item.id, -1)}
                                            className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 font-bold"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center font-semibold text-gray-800">{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(item.id, 1)}
                                            className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 font-bold"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Section - Cart Total */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl sticky top-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
                                Cart Total
                            </h2>

                            {/* Items Summary */}
                            <div className="space-y-3 mb-6">
                                {cartItems.filter(item => item.selected).map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-gray-700">{item.name}</span>
                                        <div className="text-right">
                                            <span className="text-gray-600">{item.quantity}x</span>
                                            <span className="ml-2 text-gray-800 font-semibold">
                                                Rp{getItemTotal(item).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div className="pt-4 mb-6 border-t-2 border-gray-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-800">Total:</span>
                                    <span className="text-xl font-bold text-gray-800">
                                        Rp{calculateTotal().toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={handleCheckout}
                                disabled={calculateTotal() === 0}
                                className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
                                    calculateTotal() > 0
                                        ? 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 cursor-pointer'
                                        : 'bg-gray-300 cursor-not-allowed'
                                }`}
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}