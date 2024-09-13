import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
} from "@mui/material";
import Layout from "./layout/Layout";
import {
  getCartListById,
  deleteCartList,
  editQuantityCart,
} from "../apis/action";
import { useAppDispatch, useAppSelector } from "../stores/storeHooks";
import { RootState } from "../stores/store";
import { CartList } from "../apis/interfaces";
import CartItemComponent from "./CartItemComponent";
import { Snackbar } from "@mui/material";
import { setCartLength } from "../stores/slice/listsSlice";

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartList | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });
  const dispatch = useAppDispatch();

  const id = useAppSelector((state: RootState) => state.user.userInfos.id);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response: CartList | undefined = await getCartListById(id!);
        if (response) {
          setCart(response);
          const cartLength = response.products.length;
          dispatch(setCartLength(cartLength));
        }
        setLoading(false);
      } catch (error: any) {
        setError(error.message || "An error occurred");
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [id]);

  const handleRemoveItem = async (productId: string) => {
    try {
      await deleteCartList(id!, productId);
      setCart((prevCart) => ({
        ...prevCart!,
        products: prevCart!.products.filter((item) => item._id !== productId),
      }));
      setSnackbar({ open: true, message: "Item removed successfully" });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to remove item",
      });
    }
  };
  const handleQuantityChange = async (
    productId: string,
    newQuantity: number
  ) => {
    try {
      const quantity = newQuantity;
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error("Quantity must be a valid number greater than zero.");
      }

      await editQuantityCart(id!, [{ productId, quantity }]);

      setCart((prevCart) => ({
        ...prevCart!,
        products: prevCart!.products.map((item) =>
          item.productId._id === productId ? { ...item, quantity } : item
        ),
      }));
    } catch (error: any) {
      setError(error.message || "Failed to update quantity");
    }
  };

  const calculateTotal = () => {
    return (
      cart?.products.reduce((total, item) => {
        const price = item.productId?.price ?? 0;
        const quantity = item.quantity ?? 1;
        return total + price * quantity;
      }, 0) ?? 0
    );
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Layout>
      <Box sx={{ padding: 3, marginLeft: 30, marginRight: 30, marginTop: 20 }}>
        <Typography variant="h4" gutterBottom align="center">
          Your Shopping Cart
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Remove</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart?.products.map((item) => (
                <CartItemComponent
                  key={item.productId._id}
                  item={item}
                  onRemove={handleRemoveItem}
                  onQuantityChange={handleQuantityChange}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            marginTop: 3,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#ffffff",
              padding: 2,
              borderRadius: 1,
              boxShadow: 1,
              width: "30%",
              textAlign: "center",
            }}
          >
            <Typography variant="h6">Cart Totals</Typography>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              Subtotal: <strong>${calculateTotal().toFixed(2)}</strong>
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              Total: <strong>${calculateTotal().toFixed(2)}</strong>
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 2, marginLeft: 2 }}
          >
            Proceed To Checkout
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        message={snackbar.message}
        onClose={() => setSnackbar({ open: false, message: "" })}
      />
    </Layout>
  );
};

export default Cart;
