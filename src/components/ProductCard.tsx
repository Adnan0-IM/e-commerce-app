import React from "react";
import { Link } from "react-router-dom";

export interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  isAdmin?: boolean;
  isAuthenticated?: boolean;
  onAddToCart?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  image,
  isAdmin = false,
  onAddToCart,
}) => (
  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
    <div className="aspect-w-1 aspect-h-1 w-full">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
    </div>
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{name}</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-bold text-gray-900 dark:text-indigo-200">${price.toFixed(2)}</span>
        <div className="flex space-x-2 items-center">
          <Link to={`/product/${id}`} className="text-sm text-blue-600 dark:text-indigo-300 hover:text-blue-800 dark:hover:text-indigo-400">Details</Link>
          {onAddToCart && (
            <button
              onClick={onAddToCart}
              className="bg-blue-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 dark:hover:bg-indigo-800"
              disabled={isAdmin}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default ProductCard; 