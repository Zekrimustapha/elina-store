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
  status: 'New' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  notes?: string;
}

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
  isDuplicate?: boolean;
  orderId?: string;
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
