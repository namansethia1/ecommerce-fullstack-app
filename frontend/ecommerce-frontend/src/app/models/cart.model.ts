import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id?: number;
  orderTrackingNumber?: string;
  totalPrice: number;
  totalQuantity: number;
  status?: string;
  dateCreated?: Date;
  lastUpdated?: Date;
  orderItems: OrderItem[];
  shippingAddress?: Address;
  billingAddress?: Address;
}

export interface OrderItem {
  id?: number;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  product: Product;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface CheckoutInfo {
  shippingAddress: Address;
  billingAddress: Address;
  creditCard: CreditCard;
}

export interface CreditCard {
  cardType: string;
  nameOnCard: string;
  cardNumber: string;
  securityCode: string;
  expirationMonth: number;
  expirationYear: number;
}
