// redux/slices/listsSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ListsState } from "../../apis/interfaces";

const initialState: ListsState = {
  wishlistLength: 0,
  cartLength: 0,
  wishlistProductLimit: 5,
  cartProductLimit: 5,
};

const listsSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    setWishlist(state, action: PayloadAction<number>) {
      state.wishlistLength = action.payload;
    },
    setCartLength(state, action: PayloadAction<number>) {
      state.cartLength = action.payload;
    },
    setWishlistProductLimit(state, action: PayloadAction<number>) {
      state.wishlistProductLimit = action.payload;
    },
    setCartProductLimit(state, action: PayloadAction<number>) {
      state.cartProductLimit = action.payload;
    },
  },
});

export const {
  setWishlist,
  setCartLength,
  setWishlistProductLimit,
  setCartProductLimit,
} = listsSlice.actions;

export default listsSlice.reducer;
