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
  address: string;
  company_name: string;
}
export interface UserInfo {
  _id : string;
  firstname: string;
  lastname: string;
  password: string;
  role: string;
  email: string;
  phone: number;
  address: string;
  company_name: string;
  avatar : string;
  shopDescription : string;
  isVerified : boolean ;
}
export interface AdminInfo {
  _id : string;
  firstname: string;
  lastname: string;
  password: string;
  role: string;
  email: string;
  phone: number;
  address: string;
  company_name: string;
  avatar : string;
  shopDescription : string;
  isVerified : boolean ;
}
export interface UsersInfo {
  _id : string;
  firstname: string;
  lastname: string;
  password: string;
  role: string;
  email: string;
  phone: string;
  address: string;
  company_name: string;
  avatar : string;
  shopDescription : string;
  isVerified : boolean ;
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
  address : string , 
  phone : string ,
  avatar : string , 
  shopDescription : string ; 
  isVerified : boolean ;
}
export interface SelcteArtisanInfo {
  id : string ; 
  firstname : string ;
  lastname : string ;
  email : string ; 
  company_name : string ; 
  address : string , 
  phone : string ,
  avatar : string , 
  shopDescription : string ; 
  isVerified : boolean ;
}

export interface SelcteUserInfo {
  id : string ; 
  firstname : string ;
  lastname : string ;
  email : string ; 
  company_name : string ; 
  address : string ,
  role : string, 
  phone : string ,
  avatar : string , 
  shopDescription : string ; 
  isVerified : boolean ;
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
  promo: boolean
  discountPercentage: number ;
  createdAt: number;  
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
export interface wishlistProduct {
  _id: string;
  photos: string[];
  name: string;
  price: number;
  stock: number;
}
export interface wishlistItem {
  productId: string;
  photos: string[];
  name: string;
  price: number;
  stock: number;
}
export interface wishlistResponseItem {
  productId: string;
}
export interface wishlist {
  products: wishlistResponseItem[]; 
  wishLength : number ; 
}


export interface CartProductResponse {
  productId: string;
  quantity: number;
}
export interface CartProduct {
  productId: string;
  photos: string[],
  name: string,
  price: number,
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
export interface CartItemSlice {
  productId: string; 
  quantity: number;
}

export interface CartListSlice {
  products: CartItemSlice[];
  totalPrice: number;
  cartLength: number;
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

export interface  Order {
  _id: string;
  client_id: string;
  date_commande: string;
  statut: 'en cours' | 'expédiée' | 'livrée' | 'annulée';
  montant_total: number;
  details: OrderDetail[];
  delivery_address: DeliveryAddress[];
  createdAt: string

}

export interface OrderDetail {
  produit_id: Product;
  quantité: number;
  prix_unitaire: number;
  accepte : "en cours"| "accepte"| "annulée"
}

export interface DeliveryAddress {
  firstname?: string;
  lastname?: string;
  address?: string;
  country?: string;
  zipCode?: string;
  phone : number;
}
export interface ArtisanInfoThisMonth {
  artisanId: string;
  artisanName: string;
  totalSales: number;
  artisanPhoto : string;
}

export interface ArtisanStatistics {
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
  bestSellingProducts: {
    _id: string;
    productName: string;
    totalSold: number;
  }[];
  orderStatistics: {
    _id: string; 
    count: number;
  }[];
}

export interface RevenueData {
  dailyRevenue: Record<string, number>;
  weeklyRevenue: Record<string, number>;
  monthlyRevenue: Record<string, number>;
}
