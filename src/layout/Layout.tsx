import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  // Calculate total items in cart
  const cartItemsCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Helper function to render cart link with badge
  const CartLink = () => (
    <div className="relative inline-block">
      <Link to="/cart" className="hover:underline">Cart</Link>
      {cartItemsCount > 0 && (
        <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {cartItemsCount}
        </span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-300">E-Commerce</Link>
        <nav className="space-x-4">
          {/* Show different navigation based on user role */}
          {!user ? (
            <>
              {/* Public links */}
              <Link to="/products" className="hover:underline">Products</Link>
              <CartLink />
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/signup" className="hover:underline">Sign Up</Link>
            </>
          ) : user.role === "user" ? (
            <>
              {/* Customer links */}
              <Link to="/products" className="hover:underline">Products</Link>
              <CartLink />
              <button onClick={handleLogout} className="hover:underline">Logout</button>
            </>
          ) : (
            <>
              {/* Admin links */}
              <Link to="/admin" className="hover:underline">Dashboard</Link>
              <Link to="/admin/products" className="hover:underline">Manage Products</Link>
              <Link to="/admin/orders" className="hover:underline">Manage Orders</Link>
              <button onClick={handleLogout} className="hover:underline">Logout</button>
            </>
          )}
        </nav>
      </header>
      <main className="">
        <Outlet />
      </main>
      <footer className="bg-white dark:bg-gray-800 text-center p-4 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} E-Commerce Store
      </footer>
    </div>
  );
};

export default Layout;
