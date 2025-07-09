import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import ManageProducts from "../pages/ManageProducts";
import ManageOrders from "../pages/ManageOrders";
import PrivateRoute from "./PrivateRoute";
import Layout from "../layout/Layout";
import Product from "../pages/Product";
import NotFound from "../pages/NotFound";
import Confirmation from "../pages/Confirmation";
import Signup from "../pages/Signup";
import MyOrders from "../pages/MyOrders";



const AppRouter: React.FC = () => (
  <Routes>
    
    {/* Public Routes */}
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/products" element={<Product />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected Customer Route */}
      <Route
        path="/checkout"
        element={
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        }
      />
      <Route path="/confirmation" element={<Confirmation />} />
      {/* Admin Routes (Protected) */}
      <Route
        path="/admin"
        element={
          <PrivateRoute requireAdmin>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <PrivateRoute requireAdmin>
            <ManageProducts />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <PrivateRoute requireAdmin>
            <ManageOrders />
          </PrivateRoute>
        }
      />
      {/* NotFound fallback route */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default AppRouter;
