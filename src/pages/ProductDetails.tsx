import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Product } from '../shared/types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Get products from localStorage or fall back to initial data
        const savedProducts = localStorage.getItem('products');
        const products = savedProducts 
          ? JSON.parse(savedProducts)
          : await (await fetch('/src/data/products.json')).json();
        
        const foundProduct = products.find((p: Product) => String(p.id) === id);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          navigate('/404');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        navigate('/404');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
      toast.success(`${product.name} added to cart`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
       <ToastContainer/>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {product.name}
              </h1>
              {product.category && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Category: {product.category}
                </p>
              )}
            </div>

            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${product.price.toFixed(2)}
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
            <div className="text-sm">
              {product.stock && product.stock > 0 ? (
                <span className="text-green-600 dark:text-green-400">
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-red-600 dark:text-red-400">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Add to Cart Section */}
            {!user?.role?.includes('admin') && product.stock && product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label htmlFor="quantity" className="text-gray-700 dark:text-gray-300">
                    Quantity:
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {[...Array(Math.min(10, product.stock))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Add to Cart
                </button>
              </div>
            )}

            {/* Additional Info */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">SKU</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    #{product.id}
                  </p>
                </div>
                {product.category && (
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Category</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {product.category}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
