import { Routes, Route } from "react-router-dom"
import MainPage from "./salman/mainPage"
import ProductsPage from "./pages/ProductsPage"
import { useEffect } from "react"

const RedirectToApiDocs = () => {
  useEffect(() => {
    window.location.href = "/test-api/index.html"
  }, [])

  return null
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/test-api" element={<RedirectToApiDocs />} />
      <Route path="*" element={
        <div className="flex h-screen items-center justify-center">
          <h1 className="text-2xl font-bold">404 - Halaman Tidak Ditemukan</h1>
        </div>
      } />
    </Routes>
  )
}
