import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { wishlist, wishlistResponseItem } from "../../apis/interfaces";

const initialState: wishlist = {
  products: [],
  wishLength: 0,
};

const wishSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addProductToWishlist(state, action: PayloadAction<wishlistResponseItem>) {
      const existingProduct = state.products.find(
        (product) => product.productId === action.payload.productId
      );
      if (!existingProduct) {
        state.products.push(action.payload);
        state.wishLength += 1;
      }
    },
    removeProductFromWishlist(state, action: PayloadAction<string>) {
      const newProducts = state.products.filter(
        (product) => product.productId !== action.payload
      );
      state.wishLength -= state.products.length - newProducts.length;
      state.products = newProducts;
    },
    clearWishlist(state) {
      state.products = [];
      state.wishLength = 0;
    },
  },
});

export const {
  addProductToWishlist,
  removeProductFromWishlist,
  clearWishlist,
} = wishSlice.actions;

export default wishSlice.reducer;
