import { ServerMonitoringMode } from "mongodb";

export interface Product {
  _id: string;
  name: string;
  oldprice: string;
  newprice: string;
  calculateSize: string;
  isChildProduct: boolean;
  categoryIds: string[];
  isFeatured: boolean;
  isArchived: boolean;
  priority: number;
  images: string[];
  showSize: string;
  typeToDisplay: string;
  childProducts: ChildProduct[];
  createdAt: Date;
  isOutOfStock: boolean;
}

export interface ChildProduct {
  _id: string;
  oldprice: string;
  newprice: string;
  showSize: string;
  calculateSize: string;
  isChildProduct: boolean;
}

export interface CartProduct {
  _id: string;
  name: string;
  newprice: string;
  calculatesize: string;
  images: string[];
}

export interface Config {
  length: number;
  _id: string;
  maxWeight: string;
  deliveryCharge: string;
  minAmount: string;
  users: string[];
}

export interface Cart {
  cartProduct: CartProduct;
  quantity: number;
}

export interface Image {
  url: string;
}

export interface Billboard {
  id: string;
  label: string;
  imageUrl: string;
}

export interface Category {
  _id: string;
  name: string;
  image: string;
  priority: number;
  products: string[];
}

export interface CategoryArray {
  value: string;
  label: string;
}

export interface Brand {
  _id: string;
  name: string;
  image: string;
  priority: number;
  products: string[];
}

export interface Order {
  _id: string;
  isPaid: boolean;
  orderItems: OrderItem[];
  deliveryCharge: string;
  totalAmount: string;
  address: string;
  phone: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Admin {
  isAdmin: boolean;
}
