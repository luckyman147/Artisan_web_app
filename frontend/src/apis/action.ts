import { Axios } from "./axiosConfig";
import {
  ArtisanInfo,
  CartItem,
  CartList,
  CartProduct,
  CartResponse,
  Category,
  DeliveryAddress,
  Order,
  OrderDetail,
  Product,
  ResetPasswordResponse,
  response,
  ReviewsData,
  UserInfo,
  UserRegister,
  WishlistResponse,
  wishlists,
} from "./interfaces";

export async function Register(
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  phone: number,
  adress: string,
  company_name: string,
  role: string
): Promise<UserRegister | undefined> {
  try {
    // Send the user data as part of the request body
    const { data }: { data: UserRegister } = await Axios().post(
      "/auth/register",
      {
        firstname,
        lastname,
        email,
        password,
        phone,
        adress,
        company_name,
        role,
      }
    );

    // Return the response data
    return data;
  } catch (error) {
    console.error("Error registering user:", error);
    // Return undefined in case of error
    return undefined;
  }
}

export async function verifyEmail(
  token: string
): Promise<response | undefined> {
  try {
    const { data }: { data: response } = await Axios().get(
      `/auth/verify/${token}`
    );
    return data;
  } catch (error) {
    console.error("Error verifying email:", error);
    // Return undefined in case of error
    return undefined;
  }
}

export async function forgetPassword(
  email: string
): Promise<Response | undefined> {
  try {
    const { data }: { data: Response } = await Axios().post(
      "/auth/forgotpassword",
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  } catch (error) {
    console.error("Error verifying email:", error);
    return undefined;
  }
}

export async function resetPassword(
  resetToken: string,
  password: string
): Promise<ResetPasswordResponse | undefined> {
  try {
    const { data } = await Axios().put<ResetPasswordResponse>(
      `/auth/resetpassword/${resetToken}`,
      { password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  } catch (error) {
    console.error("Error resetting password:", error);
  }
}

export async function resendVerificationEmail(
  email: string
): Promise<Response | undefined> {
  try {
    const { data }: { data: Response } = await Axios().post(
      "/auth/resend-verification",
      { email }
    );
    return data;
  } catch (error) {
    console.error("Error verifying email:", error);
    return undefined;
  }
}

export async function fetchProduct(): Promise<Product[]> {
  try {
    const response = await Axios().get<Product[]>("/products");
    return response.data;
  } catch (error) {
    console.log("Unexpected error fetching products:", error);
    return [];
  }
}

export async function fetchProductByArtisanId(id: string): Promise<Product[]> {
  try {
    const response = await Axios().get<Product[]>(
      `/products/allProductByUser/${id}`
    );
    console.log(response.data, "Fetched products");
    return response.data;
  } catch (error) {
    console.error("Unexpected error fetching products:", error);
    return [];
  }
}

export async function fetchProductById(
  id: string
): Promise<Product | undefined> {
  try {
    const response = await Axios().get<Product>(`/products/${id}`);
    console.log(response.data, "Fetched products");
    return response.data;
  } catch (error) {
    console.error("Unexpected error fetching products:", error);
  }
}

export async function addProduct(
  productData: FormData,
  token: string
): Promise<Product> {
  const axiosInstance = Axios();

  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  console.log("Request Headers:", axiosInstance.defaults.headers);

  try {
    const response = await axiosInstance.post<Product>(
      "/products",
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to add product:",
      error.response?.data || error.message || error
    );
    throw error;
  }
}

export async function editProduct(
  _id: string,
  productData: FormData,
  token: string
): Promise<Product | null> {
  const axiosInstance = Axios();

  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  try {
    const response = await axiosInstance.put<Product>(
      `/products/${_id}`,
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Return the updated product data
    return response.data;
  } catch (error) {
    console.error("Unexpected error updating product:", error);
    return null; // Return null or an empty object if preferred
  }
}

export const deleteProduct = async (
  productId: string,
  token: string
): Promise<void> => {
  try {
    const response = await Axios().delete(`/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Product deleted successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to delete product:",
      error.response?.data || error.message || error
    );
    throw error;
  }
};

export async function addWishList(
  client: string,
  products: any
): Promise<WishlistResponse | undefined> {
  try {
    const { data }: { data: WishlistResponse } = await Axios().post(
      "/wishlists",
      { client, products }
    );
    return data;
  } catch (error) {
    console.error("Error add wishlist:", error);
    return undefined;
  }
}

export async function getAllWishList(): Promise<wishlists | undefined> {
  try {
    const { data }: { data: wishlists } = await Axios().get("/wishlists", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return data;
  } catch (error) {
    console.error("Error getAllWishList:", error);
    return undefined;
  }
}
export async function getWishListById(
  id: string
): Promise<wishlists[] | undefined> {
  try {
    const { data }: { data: wishlists[] } = await Axios().get(
      `/wishlists/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  } catch (error) {
    console.error("Error getWishListById:", error);
    return undefined;
  }
}

export const deleteWishList = async (
  productId: string,
  clientId: string
): Promise<void> => {
  try {
    const response = await Axios().delete(
      `/wishlists/${productId}/${clientId}`
    );
    console.log("Wishlist product deleted successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to delete product:",
      error.response?.data || error.message || error
    );
    throw error;
  }
};

export async function getAllcategories(): Promise<Category[] | undefined> {
  try {
    const { data }: { data: Category[] } = await Axios().get("/categories");

    return data;
  } catch (error) {
    console.error("Error get categories:", error);
    return undefined;
  }
}

export async function addCart(
  client: string,
  products: CartProduct[]
): Promise<CartResponse | undefined> {
  try {
    const { data }: { data: CartResponse } = await Axios().post("/carts", {
      client,
      products,
    });
    return data;
  } catch (error: any) {
    console.error(
      "Error adding cart:",
      error.response ? error.response.data : error.message
    );
    return undefined;
  }
}

export async function getCartListById(
  id: string
): Promise<CartList | undefined> {
  try {
    const { data }: { data: CartList } = await Axios().get(`/carts/${id}`);

    return data;
  } catch (error: any) {
    console.error(
      "Error fetching cart:",
      error.response ? error.response.data : error.message
    );
    return undefined;
  }
}

export const deleteCartList = async (
  clientId: string,
  productId: string
): Promise<void> => {
  try {
    const response = await Axios().delete(`/carts/${clientId}/${productId}`);
    console.log("cart list product deleted successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to delete product:",
      error.response?.data || error.message || error
    );
    throw error;
  }
};

export async function editQuantityCart(
  id: string,
  products: { productId: string; quantity: number }[]
): Promise<CartItem | null> {
  try {
    const response = await Axios().put<CartItem>(`/carts/${id}`, { products });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating product:",
      error.response?.data || error.message
    );
    return null; // Return null or handle error appropriately
  }
}

export async function addReviews(
  productId: string,
  clientId: string,
  comment: string,
  rating: Number
): Promise<Response | undefined> {
  try {
    const { data }: { data: Response } = await Axios().post("/reviews", {
      clientId,
      productId,
      comment,
      rating,
    });
    return data;
  } catch (error: any) {
    console.error(
      "Error adding cart:",
      error.response ? error.response.data : error.message
    );
    return undefined;
  }
}

export async function getReviewsById(
  id: string
): Promise<ReviewsData | undefined> {
  try {
    const { data }: { data: ReviewsData } = await Axios().get(`/reviews/${id}`);

    return data;
  } catch (error: any) {
    console.error(
      "Error fetching cart:",
      error.response ? error.response.data : error.message
    );
    return undefined;
  }
}

export async function addOrder(
  clientId: string,
  details: OrderDetail[],
  delivery_address?: DeliveryAddress[]
): Promise<Order | undefined> {
  try {
    const { data }: { data: Order } = await Axios().post("/orders", {
      clientId,
      details,
      ...(delivery_address && { delivery_address }), 
    });
    return data;
  } catch (error: any) {
    console.error(
      "Error adding Order:",
      error.response ? error.response.data : error.message
    );
    return undefined;
  }
}

export async function getUserById(
  userId: string,
  token: string
): Promise<UserInfo | undefined> {
  try {
    // Make the GET request with the token in headers
    const { data }: { data: UserInfo } = await Axios().get(`/auth/me/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error: any) {
    console.error("Error fetching user:", error.response ? error.response.data : error.message);
    return undefined;
  }
}

export async function getArtisanById(
  userId: string,
  token: string
): Promise<ArtisanInfo[] | undefined> {
  try {
    // Make the GET request with the token in headers
    const { data }: { data: ArtisanInfo[] } = await Axios().get(`/auth/artisan/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error: any) {
    console.error("Error fetching Artisan:", error.response ? error.response.data : error.message);
    return undefined;
  }
}