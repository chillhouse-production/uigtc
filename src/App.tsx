import { Routes, Route, } from "react-router-dom"
import { useState } from 'react';
import MainPage from "./salman/mainPage"
import ProductsPage from "./pages/ProductsPage"
import ProfilePage from "./pages/ProfilePage"
import CheckoutPage from "./pages/CheckoutPage"
import TransactionSuccessPage from "./pages/TransactionSuccessPage"
import HistoryPage from "./pages/HistoryPage"
import SignIn from './SignIn';
import SignUp from './SignUp';
import './App.css';
import MerchList from "./salman/merchList";
import MerchDetails from "./salman/merchDetails";
import CartPage from "./salman/cartDetails";
import AdminGuard from "./components/AdminGuard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminLayout from "./pages/admin/AdminLayout";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import RsvpPage from "./pages/RsvpPage";
import RsvpStatusPage from "./pages/RsvpStatusPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState('signin');

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/transactionsuccess" element={<TransactionSuccessPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/merchlist" element={<MerchList />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/rsvp" element={<RsvpPage />} />
      <Route path="/rsvp/status" element={<RsvpStatusPage />} />

      <Route path="/product/:id" element={<MerchDetails />} />
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
      <Route
        path="/admin"
        element={
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>
      <Route path="*" element={
        <div className="flex h-screen items-center justify-center">
          <h1 className="text-2xl font-bold">404 - Halaman Tidak Ditemukan</h1>
        </div>
      } />
    </Routes>
  )
}