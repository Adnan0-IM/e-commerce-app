import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Order, OrderStatus } from '../shared/types';

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Fetch user's orders
  useEffect(() => {
    const fetchUserOrders = () => {
      try {
        setLoading(true);
        
        // Get the current user email - in a real app, this would come from auth context
        const userEmail = localStorage.getItem('userEmail'); // You'll need to implement this
        if (!userEmail) {
          setError('Please log in to view your orders');
          setLoading(false);
          return;
        }
        
        // Get all orders from localStorage
        const savedOrders = localStorage.getItem('orders');
        const allOrders: Order[] = savedOrders ? JSON.parse(savedOrders) : [];
        
        // Filter orders for the current user
        const userOrders = allOrders.filter(
          order => order.customerEmail === userEmail
        );
        
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load your orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
    
    // Listen for changes to orders in localStorage (real-time updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'orders') {
        fetchUserOrders();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Helper function to get status badge styling
  const getStatusBadgeClass = (status: OrderStatus): string => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };
  
  // Format date helper
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">Loading your orders...</p>
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
            <p className="text-xl font-semibold mb-2">Error Loading Orders</p>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <Link
              to="/"
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-block"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <svg className="w-24 h-24 mx-auto mb-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Orders Yet</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
          <Link
            to="/products"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Continue Shopping
          </Link>
        </div>

        {/* Orders List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map(order => (
              <div key={order.id} className="p-6">
                <div className="flex flex-col lg:flex-row justify-between mb-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mr-3">
                        Order #{order.id.slice(-8)}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="mt-4 lg:mt-0 flex items-center">
                    <p className="font-medium text-gray-900 dark:text-white mr-4">
                      Total: ${order.total.toFixed(2)}
                    </p>
                    <button 
                      onClick={() => setSelectedOrderId(selectedOrderId === order.id ? null : order.id)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {selectedOrderId === order.id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                </div>
                
                {/* Order Details (Expandable) */}
                {selectedOrderId === order.id && (
                  <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                    {/* Order Status Timeline */}
                    <div className="mb-6">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Order Status</h4>
                      <div className="flex items-center justify-between w-full max-w-3xl mx-auto">
                        <div className={`flex flex-col items-center ${order.status !== 'cancelled' ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${order.status !== 'cancelled' ? 'border-green-600 dark:border-green-400 bg-green-100 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-700'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-xs mt-2">Confirmed</span>
                        </div>
                        
                        <div className={`flex-1 h-1 ${(order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') && order.status !== 'cancelled' ? 'bg-green-600 dark:bg-green-400' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                        
                        <div className={`flex flex-col items-center ${(order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') && order.status !== 'cancelled' ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${(order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') && order.status !== 'cancelled' ? 'border-green-600 dark:border-green-400 bg-green-100 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-700'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="text-xs mt-2">Processing</span>
                        </div>
                        
                        <div className={`flex-1 h-1 ${(order.status === 'shipped' || order.status === 'delivered') && order.status !== 'cancelled' ? 'bg-green-600 dark:bg-green-400' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                        
                        <div className={`flex flex-col items-center ${(order.status === 'shipped' || order.status === 'delivered') && order.status !== 'cancelled' ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${(order.status === 'shipped' || order.status === 'delivered') && order.status !== 'cancelled' ? 'border-green-600 dark:border-green-400 bg-green-100 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-700'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                          </div>
                          <span className="text-xs mt-2">Shipped</span>
                        </div>
                        
                        <div className={`flex-1 h-1 ${order.status === 'delivered' && order.status !== 'cancelled' ? 'bg-green-600 dark:bg-green-400' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                        
                        <div className={`flex flex-col items-center ${order.status === 'delivered' && order.status !== 'cancelled' ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${order.status === 'delivered' && order.status !== 'cancelled' ? 'border-green-600 dark:border-green-400 bg-green-100 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-700'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                          </div>
                          <span className="text-xs mt-2">Delivered</span>
                        </div>
                      </div>
                      
                      {order.status === 'cancelled' && (
                        <div className="mt-4 p-2 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 text-sm text-center rounded">
                          This order has been cancelled
                        </div>
                      )}
                    </div>
                    
                    {/* Order Items */}
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Order Items</h4>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                          {order.items.map(item => (
                            <tr key={item.productId}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{item.productName}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">{item.quantity}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">${item.price.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Shipping Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Shipping Address</h4>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <p className="text-gray-800 dark:text-gray-300">
                            {order.shippingAddress.street}<br />
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                            {order.shippingAddress.country}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Payment Information</h4>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <p className="text-gray-800 dark:text-gray-300">
                            Card ending in: **** **** **** {order.paymentInfo.cardNumber}<br />
                            Exp: {order.paymentInfo.cardExpiry}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;