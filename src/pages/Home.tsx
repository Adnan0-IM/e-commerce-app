import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Product } from '../shared/types';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const savedProducts = localStorage.getItem('products');
        const products = savedProducts 
          ? JSON.parse(savedProducts)
          : (await (await fetch('/src/data/products.json')).json());

        // Get featured products (newest 4 products)
        const featured = [...products]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 4);
        setFeaturedProducts(featured);

        // Extract unique categories
        const uniqueCategories = [...new Set(products.map((product: Product) => product.category || ''))].filter(Boolean) as string[];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (productId: string) => {
    const product = featuredProducts.find(p => p.id === productId);
    if (product && product.stock && product.stock > 0) {
      addToCart(productId, 1);
      toast.success(`${product.name} added to cart!`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.error('Sorry, this item is out of stock!', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate('/products', { state: { selectedCategory: category } });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with enhanced design */}
      <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <svg
            className="absolute left-0 top-0 w-full h-full opacity-10 pointer-events-none"
            viewBox="0 0 800 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="200" cy="200" r="200" fill="#fff" />
            <circle cx="700" cy="100" r="120" fill="#fff" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center md:text-left max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                Welcome to{" "}
                <span className="bg-white/20 px-3 py-1 rounded-xl text-yellow-300">
                  ShopEase
                </span>
                <span className="text-2xl md:text-3xl font-semibold text-white/80 block mt-4">
                  Your one-stop shop for everything!
                </span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Discover{" "}
                <span className="font-semibold text-yellow-200">
                  exclusive deals
                </span>
                , trending products, and a seamless shopping experience. Fast
                delivery, secure checkout, and 24/7 support.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-3 bg-yellow-300 text-blue-900 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-yellow-200 transition-all transform hover:scale-105"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v3"
                  />
                </svg>
                Shop Now
              </Link>
            </div>
            {/* Hero image with animation */}
            <div className="hidden md:block flex-1 transform hover:scale-105 transition-transform duration-500">
              <img
              src='/shopping.webp'
              alt="Shopping illustration"
              className="w-full max-w-xs mx-auto rounded-2xl shadow-2xl border-4 border-white/30 hover:border-white/50 transition-colors"
              loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Featured Products Section */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <svg className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Featured Products
              </h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all group"
            >
              View All 
              <span aria-hidden="true" className="transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Loading products...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  category={product.category || ""}
                  stock={product.stock || 0}
                  isAdmin={user?.role === "admin"}
                  isAuthenticated={!!user}
                  onAddToCart={() => handleAddToCart(product.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Categories Section */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
            <svg className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className="group p-6 text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/0 to-purple-600/0 group-hover:from-blue-600/10 group-hover:via-blue-600/10 group-hover:to-purple-600/10 transition-colors duration-300"></div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white relative z-10">
                  {category}
                </h3>
              </button>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Browse our full collection of products and find exactly what you're looking for.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors transform hover:scale-105"
          >
            View All Products
            <span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Home;
