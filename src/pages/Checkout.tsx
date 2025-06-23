import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { Product, Order, OrderItem } from '../shared/types';

interface CartProduct extends Product {
  quantity: number;
}

interface OrderSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

interface LocationState {
  products: CartProduct[];
  summary: OrderSummary;
}

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

interface FormErrors {
  [key: string]: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const state = location.state as LocationState;
  
  if (!state?.products || !state?.summary) {
    navigate('/cart');
    return null;
  }

  const { products, summary } = state;

  const [form, setForm] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  });

  // Validation functions
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    return /^\+?[\d\s-]{10,}$/.test(phone);
  };

  const validateZipCode = (zipCode: string): boolean => {
    // Supports formats: 12345 and 12345-6789
    return /^\d{5}(-\d{4})?$/.test(zipCode);
  };

  const validateCardNumber = (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s+/g, '');
    return /^\d{16}$/.test(cleaned);
  };

  const validateExpiry = (expiry: string): boolean => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    
    const [month, year] = expiry.split('/').map(num => parseInt(num));
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    
    return month >= 1 && month <= 12 && 
           year >= currentYear &&
           (year > currentYear || month >= currentMonth);
  };

  const validateCVC = (cvc: string): boolean => {
    return /^\d{3,4}$/.test(cvc);
  };

  // Format functions
  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\s+/g, '').replace(/\D/g, '');
    const groups = cleaned.match(/(\d{1,4})/g);
    return groups ? groups.join(' ').substr(0, 19) : '';
  };

  const formatExpiry = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substr(0, 2)}/${cleaned.substr(2, 2)}`;
    }
    return cleaned;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Clear the error when the user starts typing
    setErrors(prev => ({ ...prev, [name]: '' }));

    // Format inputs
    switch (name) {
      case 'cardNumber':
        formattedValue = formatCardNumber(value);
        break;
      case 'cardExpiry':
        formattedValue = formatExpiry(value);
        break;
      case 'cardCvc':
        formattedValue = value.replace(/\D/g, '').substr(0, 4);
        break;
      case 'phone':
        formattedValue = value.replace(/[^\d\s-+]/g, '');
        break;
      case 'zipCode':
        formattedValue = value.replace(/[^\d-]/g, '');
        break;
    }

    setForm(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validation
    Object.entries(form).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = 'This field is required';
      }
    });

    // Email validation
    if (form.email && !validateEmail(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (form.phone && !validatePhone(form.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // ZIP code validation
    if (form.zipCode && !validateZipCode(form.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code';
    }

    // Card number validation
    if (form.cardNumber && !validateCardNumber(form.cardNumber)) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }

    // Expiry validation
    if (form.cardExpiry && !validateExpiry(form.cardExpiry)) {
      newErrors.cardExpiry = 'Please enter a valid future date (MM/YY)';
    }

    // CVC validation
    if (form.cardCvc && !validateCVC(form.cardCvc)) {
      newErrors.cardCvc = 'Please enter a valid CVC (3-4 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create order with all required information
      const order: Order = {
        id: Date.now().toString(), // Use timestamp as ID
        customerName: `${form.firstName} ${form.lastName}`,
        customerEmail: form.email,
        items: products.map(p => ({
          productId: p.id,
          productName: p.name,
          quantity: p.quantity,
          price: p.price
        })),
        total: summary.total,
        status: 'pending',
        shippingAddress: {
          street: form.address,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          country: form.country
        },
        paymentInfo: {
          cardNumber: form.cardNumber.slice(-4),
          cardExpiry: form.cardExpiry
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save order to localStorage
      const existingOrders = localStorage.getItem('orders');
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));

      // Clear cart after successful order
      clearCart();

      // Navigate to confirmation page
      navigate('/confirmation', { state: { order } });
    } catch (error) {
      console.error('Error processing order:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'There was an error processing your order. Please try again.'
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {errors.submit}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white ${
                        errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      placeholder="+1 234-567-8900"
                      className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white ${
                        errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white ${
                        errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white ${
                          errors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={form.state}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white ${
                          errors.state ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-500">{errors.state}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={form.zipCode}
                        onChange={handleInputChange}
                        placeholder="12345"
                        className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white ${
                          errors.zipCode ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {errors.zipCode && (
                        <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={form.country}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white ${
                          errors.country ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {errors.country && (
                        <p className="mt-1 text-sm text-red-500">{errors.country}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Payment Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={form.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white ${
                        errors.cardNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.cardNumber && (
                      <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={form.cardExpiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white ${
                          errors.cardExpiry ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {errors.cardExpiry && (
                        <p className="mt-1 text-sm text-red-500">{errors.cardExpiry}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        name="cardCvc"
                        value={form.cardCvc}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength={4}
                        className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white ${
                          errors.cardCvc ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {errors.cardCvc && (
                        <p className="mt-1 text-sm text-red-500">{errors.cardCvc}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full px-6 py-3 bg-blue-600 text-white rounded-md transition-colors ${
                  loading 
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-700'
                }`}
              >
                {loading ? 'Processing...' : `Pay $${summary.total.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Quantity: {product.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ${(product.price * product.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${summary.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Tax</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${summary.tax.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {summary.shipping === 0 ? 'Free' : `$${summary.shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">Total</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          ${summary.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
