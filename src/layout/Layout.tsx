import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { CartLink } from "../components/CartLink";
import { useMobileMenu } from "../shared/hooks/useMobileMenu";
import {useLocation } from "react-router-dom";
import {Sun, Moon} from "lucide-react"; 

const Layout: React.FC = () => {
  const { user, logout } = useAuth();

  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { isOpen, toggle } = useMobileMenu();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

const location = useLocation();
const isLinkActive = (path: string): boolean => {
  return location.pathname === path;
};

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="bg-gray-50 dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 ">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-300">
              E-Commerce
            </Link>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                type="button"
                onClick={toggle}
                data-mobile-menu-button
                className=" rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-4 ">
              {/* Show different navigation based on user role */}
              {!user ? (
                <>
                  {/* Public links */}
            <Link to="/products" className={`nav-link ${isLinkActive("/products") ? "active" : ""}`}>Products</Link>
                  <CartLink isActiveLink={isLinkActive("/cart")} />
                  <Link to="/login" className={`nav-link ${isLinkActive("/login") ? "active" : ""}`}>Login</Link>
                  <Link to="/signup" className={`nav-link ${isLinkActive("/signup") ? "active" : ""}`}>Sign Up</Link>
                </>
              ) : user.role === "user" ? (
                <>
                  {/* Customer links */}
                  <Link to="/products" className={`nav-link ${isLinkActive("/products") ? "active" : ""}`}>Products</Link>
                  <CartLink isActiveLink={isLinkActive("/cart")} />
                  <button onClick={handleLogout} className="nav-link">Logout</button>
                </>
              ) : (
                <>
                  {/* Admin links */}
                  <Link to="/admin" className={`nav-link ${isLinkActive("/admin") ? "active" : ""}`}>Dashboard</Link>
                  <Link to="/admin/products" className={`nav-link ${isLinkActive("/admin/products") ? "active" : ""}`}>Products</Link>
                  <Link to="/admin/orders" className={`nav-link ${isLinkActive("/admin/orders") ? "active" : ""}`}>Orders</Link>
                  <button onClick={handleLogout} className="nav-link">Logout</button>
                </>
              )}

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ml-2"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Mobile menu */}
        <div 
          data-mobile-menu
          className={`${isOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-200 dark:border-gray-700`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {!user ? (
              <>
                <Link to="/products" className="mobile-nav-link">Products</Link>
                <CartLink isActiveLink={isLinkActive("/cart")}/>
                <Link to="/login" className="mobile-nav-link">Login</Link>
                <Link to="/signup" className="mobile-nav-link">Sign Up</Link>
              </>
            ) : user.role === "user" ? (
              <>
                <Link to="/products" className="mobile-nav-link">Products</Link>
                <CartLink isActiveLink={isLinkActive("/cart")}/>
                <button onClick={handleLogout} className="mobile-nav-link w-full text-left">Logout</button>
              </>
            ) : (
              <>
                <Link to="/admin" className="mobile-nav-link">Dashboard</Link>
                <Link to="/admin/products" className="mobile-nav-link">Manage Products</Link>
                <Link to="/admin/orders" className="mobile-nav-link">Manage Orders</Link>
                <button onClick={handleLogout} className="mobile-nav-link w-full text-left">Logout</button>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="mobile-nav-link w-full text-left flex items-center"
            >
              <span>Toggle Theme</span>
              <span className="ml-2">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-600" />
                )}
              </span>
            </button>
          </div>
        </div>
      </header>

   

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-white dark:bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-6">
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/products" className="footer-link">Products</Link>
              <Link to="/cart" className="footer-link">Cart</Link>
              <Link to="/about" className="footer-link">About Us</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
            </nav>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} E-Commerce Store. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
