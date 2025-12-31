import { Routes, Route } from "react-router-dom"
import { useState } from 'react';
import MainPage from "./salman/mainPage"
import ProductsPage from "./pages/ProductsPage"
import ProfilePage from "./pages/ProfilePage"
import CheckoutPage from "./pages/CheckoutPage"
import TransactionSuccessPage from "./pages/TransactionSuccessPage"
import SignIn from './SignIn';
import SignUp from './SignUp';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'signin' | 'signup'>('signin');

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/transactionsuccess" element={<TransactionSuccessPage />} />
      <Route path="/auth" element={
        <>
          {currentPage === 'signin' && (
            <SignIn onSwitchToSignUp={() => setCurrentPage('signup')} />
          )}
          {currentPage === 'signup' && (
            <SignUp onSwitchToSignIn={() => setCurrentPage('signin')} />
          )}
        </>
      } />
      <Route path="*" element={
        <div className="flex h-screen items-center justify-center">
          <h1 className="text-2xl font-bold">404 - Halaman Tidak Ditemukan</h1>
        </div>
      } />
    </Routes>
  )
}