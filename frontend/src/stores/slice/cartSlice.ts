import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  productId: string;
  price: number;
  quantity: number;
  promo: boolean; 
  discountPercentage: number;
}

interface CartState {
  products: CartItem[];
  totalPrice: number;
  cartLength: number;
}

const initialState: CartState = {
  products: [],
  totalPrice: 0,
  cartLength: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProductToCart(state, action: PayloadAction<CartItem>) {
      const { productId, price, quantity, promo, discountPercentage } = action.payload;
      const existingProductIndex = state.products.findIndex(
        (item) => item.productId === productId
      );

      if (existingProductIndex !== -1) {
        state.products[existingProductIndex].quantity += quantity;
      } else {
        state.products.push({ productId, price, quantity, promo, discountPercentage });
      }

      state.cartLength = state.products.length;
      cartSlice.caseReducers.updateTotalPrice(state);
    },

    removeProductFromCart(state, action: PayloadAction<string>) {
      const productId = action.payload;
      const productIndex = state.products.findIndex(
        (item) => item.productId === productId
      );

      if (productIndex !== -1) {
        state.products.splice(productIndex, 1);
      }

      state.cartLength = state.products.length;
      cartSlice.caseReducers.updateTotalPrice(state);
    },

    updateProductQuantity(state, action: PayloadAction<{ productId: string; newQuantity: number }>) {
      const { productId, newQuantity } = action.payload;
      const existingProduct = state.products.find(
        (item) => item.productId === productId
      );

      if (existingProduct && newQuantity > 0) {
        existingProduct.quantity = newQuantity;
      }

      cartSlice.caseReducers.updateTotalPrice(state);
    },

    updateTotalPrice(state) {
      state.totalPrice = state.products.reduce((total, item) => {

        const effectivePrice = item.promo
          ? item.price * (item.quantity - item.discountPercentage / 100) 
          : item.price; 
          
        return total + effectivePrice * item.quantity;
      }, 0);
    },

    clearCart(state) {
      state.products = [];
      state.totalPrice = 0;
      state.cartLength = 0;
    },
  },
});

export const {
  addProductToCart,
  removeProductFromCart,
  updateProductQuantity,
  clearCart,
  updateTotalPrice,
} = cartSlice.actions;

export default cartSlice.reducer;
