import { Routes, Route } from "react-router-dom"
import { useState } from 'react';
import MainPage from "./salman/mainPage"
import ProductsPage from "./pages/ProductsPage"
import SignIn from './SignIn';
import SignUp from './SignUp';
import './App.css';
import MerchList from "./salman/merchList";

export default function App() {
  const [currentPage, setCurrentPage] = useState<'signin' | 'signup'>('signin');

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/merchlist" element={<MerchList/>}/>
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