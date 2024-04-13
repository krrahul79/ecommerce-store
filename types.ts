export interface Product {
  _id: string;
  name: string;
  oldprice: string;
  newprice: string;
  calculatesize: string;
  isChildProduct: boolean;
  images: string[];
  showSize: string;
  typeToDisplay: string;
  childProducts: Product[];
}

export interface CartProduct {
  _id: string;
  name: string;
  newprice: string;
  calculatesize: string;
  images: string[];
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
}
