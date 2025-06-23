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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Pending Orders</h3>
          <p className="text-3xl font-bold">{stats.pendingOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Order ID</th>
                  <th className="text-left py-3">Customer</th>
                  <th className="text-left py-3">Total</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Date</th>
                  <th className="text-left py-3"></th>
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

      {/* Quick Links */}
      <div className="mt-8 space-x-4">
        <Link to="/admin/orders" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          View All Orders
        </Link>
        <Link to="/admin/products" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Manage Products
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
