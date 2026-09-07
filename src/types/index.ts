export interface Order {
  id?: string;
  created_at?: string;
  full_name: string;
  phone_number: string;
  normalized_phone: string;
  wilaya: string;
  commune: string;
  address: string;
  size?: string;
  product_name: string;
  product_price: number;
  shipping_price: number;
  total_price: number;
  status: OrderStatus;
  notes?: string;
}

/**
 * Active call-center / fulfillment statuses.
 * Legacy values (Processing/Shipped/Delivered) remain part of the union so
 * historical orders stay type-safe and readable, but they are not offered
 * in the admin dropdown anymore.
 */
export type OrderStatus =
  | 'New'
  | 'Confirmed'
  | 'NoAnswer1'
  | 'NoAnswer2'
  | 'NoAnswer3'
  | 'Cancelled'
  // legacy — historical compatibility only:
  | 'Processing'
  | 'Shipped'
  | 'Delivered';

export interface OrderFormData {
  full_name: string;
  phone_number: string;
  wilaya: string;
  commune: string;
  address: string;
  notes?: string;
  website_hp?: string; // invisible honeypot field
  turnstile_token?: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  /** True ONLY when a genuinely new order row was created (gates Meta Purchase). */
  isNewOrder?: boolean;
  isDuplicate?: boolean;
  orderId?: string;
  /** Server-confirmed order total for the Purchase event value. */
  total_price?: number;
}

export interface WilayaData {
  code: string;
  name: string;
  nameAr: string;
  shippingPrice: number;
}

export interface CommuneData {
  name: string;
  nameAr: string;
  wilayaCode: string;
}
