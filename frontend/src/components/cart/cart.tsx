import React, { useState, useEffect, useCallback } from "react";
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
  TextField,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "../layout/Layout";
import { useAppDispatch, useAppSelector } from "../../stores/storeHooks";
import { RootState } from "../../stores/store";
import {
  clearCart,
  removeProductFromCart,
  updateProductQuantity,
} from "../../stores/slice/cartSlice";
import {
  addCart,
  deleteAllCartList,
  deleteCartList,
  editQuantityCart,
  fetchProductById,
} from "../../apis/action";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import theme from "../../utils/theme";

const Cart: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, totalPrice, cartLength } = useAppSelector(
    (state: RootState) => state.cart
  );
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [productData, setProductData] = useState<
    {
      _id: string;
      name: string;
      price: number;
      photos: string[];
      quantity: number;
      stock: number;
      promo: boolean;
      discountPercentage: number;
    }[]
  >([]);
  const user = useAppSelector((state: RootState) => state.user.userInfos.id);

  const handleRemoveItem = async (productId: string) => {
    dispatch(removeProductFromCart(productId));
    if (user) {
      await deleteCartList(user, productId);
      dispatch(removeProductFromCart(productId));
    }
  };

  const handleQuantityChangeDebounced = useCallback(
    debounce(async (productId: string, newQuantity: number) => {
      try {
        if (isNaN(newQuantity) || newQuantity <= 0) {
          throw new Error("Quantity must be a valid number greater than zero.");
        }
        dispatch(updateProductQuantity({ productId, newQuantity }));

        if (user) {
          await editQuantityCart(user!, [{ productId, quantity: newQuantity }]);
        }
        dispatch(updateProductQuantity({ productId, newQuantity }));
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    }, 500),
    [dispatch, user]
  );
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      console.error("Quantity must be greater than zero.");
      return;
    }

    handleQuantityChangeDebounced(productId, newQuantity);
  };

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const productsWithDetails = await Promise.all(
          products.map(async (item) => {
            if (!item.productId) {
              return null;
            }

            console.log(`Fetching product details for ID: ${item.productId}`);
            const fetchedProduct = await fetchProductById(item.productId);
            if (fetchedProduct) {
              return {
                ...fetchedProduct,
                quantity: item.quantity,
                photos: fetchedProduct.photos || [],
              };
            }
            return null;
          })
        );

        setProductData(productsWithDetails.filter((item) => item !== null));
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (products.length > 0) {
      fetchProductData();
    } else {
      setProductData([]);
    }
  }, [products]);

  const handelCheckout = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const cartProducts = products.map((prod) => ({
      productId: prod.productId,
      quantity: prod.quantity,
    }));

    try {
      await addCart(user, cartProducts);
      navigate("/checkout");
    } catch (error) {
      console.error("Failed to proceed to checkout:", error);
    }
  };

  const handleRemoveAllItem = async () => {
    dispatch(clearCart());
    if (user) {
      await deleteAllCartList(user);
    }
  };

  return (
    <Layout>
      <Box sx={{ padding: 3, marginX: 2, marginTop: 8 }}>
        <Typography variant="h4" gutterBottom align="center">
          Your Shopping Cart
        </Typography>
        {loading ? (
          <Typography variant="h6" align="center">
            Loading...
          </Typography>
        ) : cartLength === 0 ? (
          <Typography variant="h6" align="center">
            Your cart is empty.
          </Typography>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Stock Status</TableCell>
                    <TableCell>Remove</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productData.map((item, index) => {
                    const discountedPrice =
                      item.promo && item.discountPercentage
                        ? item.price -
                          (item.price * item.discountPercentage) / 100
                        : null;

                    return (
                      <TableRow key={`${item._id}-${index}`}>
                        <TableCell>
                          <img
                            src={`${import.meta.env.VITE_API_IMAGE}${
                              item.photos[0] || ""
                            }`}
                            alt={item.name}
                            style={{
                              width: 80,
                              height: 80,
                              objectFit: "cover",
                            }}
                          />
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          {discountedPrice ? (
                            <>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  textDecoration: "line-through",
                                  fontSize: "0.9rem",
                                  display: "inline",
                                  marginRight: 1,
                                }}
                              >
                                {item.price.toFixed(2)} TND
                              </Typography>
                              <Typography
                                variant="h6"
                                color="primary"
                                sx={{ display: "inline" }}
                              >
                                {discountedPrice.toFixed(2)} TND
                              </Typography>
                              <Typography
                                variant="body2"
                                color="error"
                                sx={{ display: "inline", marginLeft: 1 }}
                              >
                                ({item.discountPercentage}% off)
                              </Typography>
                            </>
                          ) : (
                            <Typography variant="h6" color="text.primary">
                              {item.price.toFixed(2)} TND
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item._id,
                                parseInt(e.target.value, 10)
                              )
                            }
                            inputProps={{ min: 1, max: item.stock }}
                            sx={{ width: 100 }}
                          />
                        </TableCell>
                        <TableCell>
                          {item.stock > 0 ? "In Stock" : "Out of Stock"}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleRemoveItem(item._id)}
                            color="error"
                            sx={{ padding: 1 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#f5f5f5",
                  padding: 3,
                  borderRadius: 1,
                  boxShadow: 1,
                  width: "100%",
                  textAlign: "right",
                  marginBottom: 2,
                }}
              >
                <Typography variant="h6">Cart Totals</Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  Subtotal: <strong>{(totalPrice ?? 0).toFixed(2)} TND</strong>
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                  Total: <strong>{(totalPrice ?? 0).toFixed(2)} TND</strong>
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                sx={{ padding: "12px 24px" }}
                onClick={() => handelCheckout()}
              >
                Proceed To Checkout
              </Button>
            </Box>
            <Button
              sx={{
                padding: "12px 24px",
                backgroundColor: "red", 
                color: "white",
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark, 
                  opacity: 0.9, 
                },
                borderRadius: "4px", 
                transition: "background-color 0.3s ease", 
              }}
              onClick={() => handleRemoveAllItem()}
            >
              Clear Cart
            </Button>
          </>
        )}
      </Box>
    </Layout>
  );
};

export default Cart;
