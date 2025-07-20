import { Link, useLocation, useNavigate } from "react-router-dom";
import type { Order } from "../shared/types";
import { useEffect, useState } from "react";

interface LocationState {
  order: Order;
}

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(
    (location.state as LocationState)?.order || null
  );

  useEffect(() => {
    // If there's no order in location state, try to get it from localStorage
    if (!order) {
      const savedOrder = localStorage.getItem("latestOrder");
      if (savedOrder) {
        setOrder(JSON.parse(savedOrder));
      } else {
        // Only navigate to home if we couldn't find an order anywhere
        navigate("/", { replace: true });
      }
    }
  }, [order, navigate]);

  if (!order)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading order details...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
            Thank you for your order!
          </h2>
          <p className="text-gray-700 dark:text-gray-300">Order #{order.id}</p>
          <p className="text-gray-700 dark:text-gray-300">
            A confirmation email will be sent to{" "}
            <span className="font-semibold">{order.customerEmail}</span>
          </p>
        </div>

        {/* Order Details */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Customer Information
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded p-4">
              <p className="text-gray-700 dark:text-gray-300">
                Name: {order.customerName}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Email: {order.customerEmail}
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Shipping Address
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded p-4">
              <p className="text-gray-700 dark:text-gray-300">
                {order.shippingAddress.street}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zipCode}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {order.shippingAddress.country}
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Order Summary
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded p-4">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="py-3 flex justify-between"
                  >
                    <div>
                      <p className="text-gray-900 dark:text-gray-100">
                        {item.productName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="text-gray-900 dark:text-gray-100">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between font-semibold text-gray-900 dark:text-gray-100">
                  <span>Total:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-4">
            <p className="text-blue-700 dark:text-blue-300">
              Your order status is:{" "}
              <span className="font-semibold uppercase">{order.status}</span>
            </p>
          </div>

          <div className="text-center mt-8 flex justify-center gap-4">
            <Link
              // onClick={() => navigate("/products")}
              to={"/products"}
              className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              to="/my-orders"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Track My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
