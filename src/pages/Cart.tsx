import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import type { Product } from '../shared/types';
import { useAuth } from '../context/AuthContext';


interface CartProduct extends Product {
  quantity: number;
  stock: number;  // Make stock required for cart products
}

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCart } = useCart();
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get products from localStorage or fall back to initial data
        const savedProducts = localStorage.getItem('products');
        const allProducts: Product[] = savedProducts 
          ? JSON.parse(savedProducts)
          : await (await fetch('/src/data/products.json')).json();
        
        // Map cart items to products
        const cartProducts = cart
          .map(cartItem => {
            const product = allProducts.find(p => p.id === cartItem.id);
            if (!product || !product.stock) return null;
            return {
              ...product,
              stock: product.stock,
              quantity: Math.min(cartItem.quantity, product.stock)
            };
          })
          .filter((p): p is CartProduct => p !== null);
        
        setProducts(cartProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load cart items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [cart]);



  const calculateSubtotal = (items: CartProduct[]): number => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateOrderSummary = (items: CartProduct[]) => {
    const subtotal = calculateSubtotal(items);
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;

    return {
      subtotal,
      tax,
      shipping,
      total
    };
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      const product = products.find(p => p.id === id);
      if (product && newQuantity <= product.stock) {
        updateCart(cart.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        ));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-red-600 dark:text-red-400 text-center">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl font-semibold mb-2">Error Loading Cart</p>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <svg className="w-24 h-24 mx-auto mb-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
        <div className="flex gap-4 justify-center">
            <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Start Shopping
          </button>
             <button
   onClick={() => navigate('/my-orders')}
    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
  >
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
    Track My Orders
  </button>
        </div>
        </div>
      </div>
    );
  }

  const summary = calculateOrderSummary(products);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 ">
       
        <div className="flex items-center justify-between mb-8">
  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
  <div className="flex items-center gap-4">
    <button
      onClick={() => navigate('/products')}
      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
      </svg>
      Continue Shopping
    </button>
    <button
      onClick={() => navigate('/my-orders')}
      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      View My Orders
    </button>
  </div>
</div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {products.map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQuantityChange={(qty) => handleQuantityChange(item.id, qty)}
                    onRemove={() => removeFromCart(item.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 sticky top-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white font-medium">${summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax (10%)</span>
                  <span className="text-gray-900 dark:text-white font-medium">${summary.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {summary.shipping === 0 ? (
                      <span className="text-green-500">Free</span>
                    ) : (
                      `$${summary.shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-gray-900 dark:text-white">Total</span>
                    <span className="text-xl font-semibold text-gray-900 dark:text-white">
                      ${summary.total.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {summary.shipping === 0 ? 
                      "✓ Free shipping applied" : 
                      `Add ${((100 - summary.subtotal).toFixed(2))} more for free shipping`
                    }
                  </p>
                </div>

                {/* <button
                  onClick={() => navigate('/checkout', { state: { products, summary } })}
                  disabled={products.length === 0}
                  className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Proceed to Checkout
                </button> */}
                <button
  onClick={() => {
    if (user) {  // Add this check
      navigate('/checkout', { state: { products, summary } })
    } else {
      // If not logged in, redirect to login with return path
      navigate('/login', { state: { from: '/cart' } })
    }
  }}
  disabled={products.length === 0}
  className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
>
  {user ? 'Proceed to Checkout' : 'Login to Checkout'}
</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
