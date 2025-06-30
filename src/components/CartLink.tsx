import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const CartLink = ({isActiveLink}: {isActiveLink: boolean}) => {
  const { cart } = useCart();
  const itemCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link to="/cart" className={`nav-link relative ${isActiveLink ? "active" : ""}`}>
      <span>Cart</span>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
};
