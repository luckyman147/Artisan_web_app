export interface UserInfos {
  id: string | null;
  isVerified: boolean;
  // idUser: string | null;
  token: string;
  role: string;
}

export interface UserRegister {
  firstname: string;
  lastname: string;
  password: string;
  role: string;
  email: string;
  phone: number;
  adress: string;
  company_name: string;
}
export interface UserInfo {
  firstname: string;
  lastname: string;
  role: string;
  email: string;
  phone: number;
  adress: string;
  company_name: string;
}

export interface UserConnectForm {
  email: string;
  password: string;
}

export interface response {
  success: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
}
export interface AuthResponse {
  id: string;
  token: string;
}
export interface Category {
  _id : string ; 
  name : string , 
  description : string 
}
export interface CategoryItem {
  _id : string ; 
  name : string , 
  description : string 
}
export interface ArtisanInfo {
  _id : string ; 
  firstname : string ;
  lastname : string ;
  email : string ; 
  company_name : string ; 
}
export interface Product {
  _id: string;
  name: string;
  photos: string[];
  artisan: ArtisanInfo
  description?: string;
  price: number;
  stock: number;
  category:CategoryItem
  size?: any;
  createdAt: string;
}
export interface WishlistResponse {
  status: number;
  data: any;
}
export interface wishlists {
  _id: string;
  client: string;
  products: any;
}

export interface wishlist {
  _id: string;
  client: string;
  products: string[];
}


export interface ListsState {
  wishlistLength: number;
  cartLength: number;
  wishlistProductLimit: number;
  cartProductLimit: number;
}

export interface CartProduct {
  productId: string;
  quantity: number;
}

export interface CartResponse {
  client: string;
  product: CartProduct[];
  totalPrice: number;
}

export interface CartList {
  _id: string;
  client: string;
  products: CartItem[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}
export interface CartItem {
  productId: Product;
  quantity: number;
  _id: string;
}
export interface ReviewsItem {
  clientId: string;
  firstname: string;
  lastname: string;
}
export interface ReviewsData {
  _id: string;
  productId: string;
  clientId: ReviewsItem;
  rating: Number;
  comment: string;
  reviewDate: Date;
}

export interface DeliveryAddress {
  firstname: string;
  lastname: string;
  address: string;
  zipCode: string;
  country :string
}

export interface OrderDetail {
  produit_id: string;
  quantité: number;
  prix_unitaire: number;
}

export interface Order {
  _id: string;
  clientId: ReviewsItem; 
  statut: "en cours" | "expédiée" | "livrée" | "annulée"; 
  montant_total: number;
  details: OrderDetail[]; 
  delivery_address: DeliveryAddress[]; 
}