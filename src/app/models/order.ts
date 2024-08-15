export interface Billing {
  id_cliente: number,
  first_name: string;
  last_name: string;
  identification: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

export interface Shipping {
  first_name: string;
  last_name: string;
  identification: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

export interface LineItem {
  id: number;
  name: string;
  product_id: number;
  quantity: number;
  subtotal: string;
  total: string;
}

export interface Order {
  id: number;
  status: string;
  currency: string;
  date_created: string;
  date_modified: string;
  total: string;
  total_tax: string;
  billing: Billing;
  shipping: Shipping;
  line_items: LineItem[];
}
