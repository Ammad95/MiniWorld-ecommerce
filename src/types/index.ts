export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: AgeCategory;
  description: string;
  features: string[];
  images: string[];
  thumbnailIndex?: number;
  inStock: boolean;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isFeatured?: boolean;
  // Inventory Management Fields
  stockQuantity: number;
  lowStockThreshold?: number;
  maxStockQuantity?: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export type AgeCategory = '0-6-months' | '6-12-months' | '1-3-years' | '3-5-years';

export interface CategoryInfo {
  id: AgeCategory;
  name: string;
  displayName: string;
  description: string;
  bannerImages: string[];
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

// Payment and Order Types
export interface PaymentAccountDetails {
  id: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  paymentMethodType: 'bank_transfer';
  routingNumber?: string;
  swiftCode?: string;
  iban?: string;
  // Additional details
  branchCode?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CreditCardInfo {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
}

export type PaymentMethod = 'bank_transfer' | 'cash_on_delivery';

export interface PaymentInfo {
  method: PaymentMethod;
  creditCard?: CreditCardInfo;
  selectedAccount?: PaymentAccountDetails;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentInfo: PaymentInfo;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
  trackingNumber?: string;
  notes?: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled'
  | 'completed'
  | 'dispatched'
  | 'payment_due'
  | 'returned';

export interface OrderState {
  orders: Order[];
  currentOrder?: Order;
  loading: boolean;
  error?: string;
}

export interface PaymentState {
  accountDetails: PaymentAccountDetails[];
  loading: boolean;
  error?: string;
}

// Admin User Types
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'sub_admin';
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
} 