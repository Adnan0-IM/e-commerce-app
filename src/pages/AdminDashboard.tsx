import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Order, Product, OrderStatus } from '../shared/types';

interface OrderDetails {
  id: string;
  customer: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  customerEmail: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
  totalRevenue: number;
  recentOrders: OrderDetails[];
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const updateStats = () => {
      // Get data from localStorage
      const ordersData = localStorage.getItem('orders');
      const productsData = localStorage.getItem('products');
      
      const orders: Order[] = ordersData ? JSON.parse(ordersData) : [];
      const products: Product[] = productsData ? JSON.parse(productsData) : [];

      // Calculate dashboard statistics
      const totalOrders = orders.length;
      const totalProducts = products.length;
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const totalRevenue = orders.reduce((sum: number, order: Order) => sum + order.total, 0);

      // Get recent orders (last 5)
      const recentOrders = orders
        .sort((a: Order, b: Order) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5)
        .map((order: Order) => ({
          id: order.id,
          customer: order.customerName,
          customerEmail: order.customerEmail,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
          items: order.items,
          shippingAddress: order.shippingAddress
        }));

      setStats({
        totalOrders,
        totalProducts,
        pendingOrders,
        totalRevenue,
        recentOrders
      });
    };

    // Initial update
    updateStats();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'orders' || e.key === 'products') {
        updateStats();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <div className="sm:flex space-x-4 hidden ">
     
        <Link to="/admin/orders" className=" bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
         Manage Orders
        </Link>
        <Link to="/admin/products" className=" bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          Manage Products
        </Link>
          </div>
        </div>
      
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Orders</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Products</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalProducts}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Pending Orders</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pendingOrders}</p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Revenue</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
            </div>
            <Link 
              to="/admin/orders"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
            >
              View All
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 dark:text-gray-100">Order ID</th>
                  <th className="text-left py-3 dark:text-gray-100">Customer</th>
                  <th className="text-left py-3 dark:text-gray-100">Total</th>
                  <th className="text-left py-3 dark:text-gray-100">Status</th>
                  <th className="text-left py-3 dark:text-gray-100">Date</th>
                  <th className="text-left py-3 dark:text-gray-100"></th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr 
                      className="border-b cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleOrderExpansion(order.id)}
                    >
                      <td className="py-3">{order.id}</td>
                      <td className="py-3">{order.customer}</td>
                      <td className="py-3">${order.total.toFixed(2)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 text-right">
                        <button 
                          className="text-gray-500 hover:text-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleOrderExpansion(order.id);
                          }}
                        >
                          {expandedOrderId === order.id ? '▼' : '▶'}
                        </button>
                      </td>
                    </tr>
                    {expandedOrderId === order.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={6} className="py-4 px-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Customer Details</h4>
                              <p>{order.customer}</p>
                              <p>{order.customerEmail}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Shipping Address</h4>
                              <p>{order.shippingAddress.street}</p>
                              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                              <p>{order.shippingAddress.country}</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <h4 className="font-semibold mb-2">Order Items</h4>
                            <div className="bg-white rounded border">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                  <tr className="bg-gray-100">
                                    <th className="py-2 px-4 text-left">Product</th>
                                    <th className="py-2 px-4 text-right">Quantity</th>
                                    <th className="py-2 px-4 text-right">Price</th>
                                    <th className="py-2 px-4 text-right">Subtotal</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {order.items.map((item, index) => (
                                    <tr key={index}>
                                      <td className="py-2 px-4">{item.productName}</td>
                                      <td className="py-2 px-4 text-right">{item.quantity}</td>
                                      <td className="py-2 px-4 text-right">${item.price.toFixed(2)}</td>
                                      <td className="py-2 px-4 text-right">${(item.quantity * item.price).toFixed(2)}</td>
                                    </tr>
                                  ))}
                                  <tr className="bg-gray-50 font-semibold">
                                    <td colSpan={3} className="py-2 px-4 text-right">Total:</td>
                                    <td className="py-2 px-4 text-right">${order.total.toFixed(2)}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      
      </div>
    </div>
  );
};

export default AdminDashboard;
