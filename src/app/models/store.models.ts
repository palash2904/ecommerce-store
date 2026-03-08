export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
}

export interface StoreData {
  categories: string[];
  products: Product[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
