import { useEffect, useState } from 'react';
import { productApi } from '../config/api';
import type { Product, Category } from '../config/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await productApi.getMerchandiseCategories();
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    }
    fetchCategories();
  }, []);

  // Fetch products when category changes
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {
        const response = await productApi.getMerchandise(selectedCategory || undefined);
        if (response.success && response.data) {
          setProducts(response.data);
        } else {
          setError(response.message || 'Failed to fetch products');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCategory]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-amber-800">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-700 mb-2">Gagal Memuat Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">🛍️ Merchandise UIGTC</h1>
          <p className="text-amber-700">Koleksi merchandise resmi UI Goes to Celebes</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full transition ${
              !selectedCategory
                ? 'bg-amber-600 text-white'
                : 'bg-white text-amber-800 hover:bg-amber-100'
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full transition ${
                selectedCategory === cat.slug
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-amber-800 hover:bg-amber-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-amber-700 text-lg">Belum ada produk tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
              >
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 relative">
                  {product.image ? (
                    <img
                      src={`http://localhost:3001${product.image}`}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-6xl">📦</span>
                    </div>
                  )}
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                        Habis
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {product.category && (
                    <span className="text-xs text-amber-600 font-medium uppercase tracking-wide">
                      {product.category.name}
                    </span>
                  )}
                  <h3 className="font-bold text-gray-900 mt-1 line-clamp-2">{product.name}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold text-amber-700">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-sm text-gray-500">Stok: {product.stock}</span>
                  </div>

                  <button
                    disabled={product.stock <= 0}
                    className={`w-full mt-4 py-2 rounded-lg font-medium transition ${
                      product.stock > 0
                        ? 'bg-amber-500 text-white hover:bg-amber-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {product.stock > 0 ? 'Beli Sekarang' : 'Stok Habis'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

