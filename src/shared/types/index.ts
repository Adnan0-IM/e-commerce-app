export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageFile?: File;
  category?: string;
  stock: number;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  image: string;
  imageFile?: File;
  category: string;
  stock: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  cardNumber: string; // Last 4 digits only
  cardExpiry: string;
}

export interface Order {
  id: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentInfo: PaymentInfo;
  createdAt: string;
  updatedAt: string;
}