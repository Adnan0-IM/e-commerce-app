import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import type { Product } from '../shared/types';

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

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      const product = products.find(p => p.id === productId);
      if (product && newQuantity <= (product.stock || 10)) {
        addToCart(productId, newQuantity - (cart.find(item => item.id === productId)?.quantity || 0));
      }
    }
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };

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
    return <div className="container mx-auto p-6">Loading cart...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  const summary = calculateOrderSummary(products);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="grid grid-cols-1 gap-4">
        {products.map(item => (
          <CartItem
            key={item.id}
            item={item}
            onQuantityChange={(qty) => handleQuantityChange(item.id, qty)}
            onRemove={() => removeFromCart(item.id)}
          />
        ))}
      </div>
      <div className="mt-6 border-t pt-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Subtotal:</span>
            <span>${summary.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tax (10%):</span>
            <span>${summary.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Shipping:</span>
            <span>{summary.shipping === 0 ? 'Free' : `$${summary.shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between items-center text-xl font-semibold pt-2 border-t">
            <span>Total:</span>
            <span>${summary.total.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/checkout', { state: { products, summary } })}
          disabled={products.length === 0}
          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
