import React from "react";
import type { Product } from "../shared/types";

interface CartItemProps {
  item: Product & { quantity: number };
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onQuantityChange, onRemove }) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 object-cover rounded"
        />
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-gray-600">${item.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onQuantityChange(item.quantity - 1)}
            className="px-2 py-1 border rounded"
          >
            -
          </button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => onQuantityChange(item.quantity + 1)}
            className="px-2 py-1 border rounded"
            disabled={item.quantity >= item.stock}
          >
            +
          </button>
        </div>
        <button
          onClick={onRemove}
          className="text-red-600 hover:text-red-800"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;