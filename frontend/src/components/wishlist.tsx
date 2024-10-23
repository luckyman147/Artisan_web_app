import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
} from "@mui/material";
import Layout from "./layout/Layout";
import { useAppDispatch, useAppSelector } from "../stores/storeHooks";
import { RootState } from "../stores/store";
import { CartProductResponse, Product } from "../apis/interfaces";
import CustomBreadcrumbs from "./layout/Breadcrumbs";
import {
  clearWishlist,
  removeProductFromWishlist,
} from "../stores/slice/wishSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import { addProductToCart } from "../stores/slice/cartSlice";
import {
  addCart,
  deleteAllWishList,
  deleteWishList,
  fetchProductById,
} from "../apis/action";

const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "WishList" }];

const Wishlist = () => {
  const wishlists = useAppSelector((state: RootState) => state.wish.products);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user.userInfos.id);
  const [products, setProducts] = useState<Product[]>([]);
  const [productLimit, setProductLimit] = useState<number>(10);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      try {
        const productPromises = wishlists.map((item) =>
          fetchProductById(item.productId)
        );
        const productResponses: (Product | undefined)[] = await Promise.all(
          productPromises
        );
        const validProducts = productResponses.filter(
          (product): product is Product => product !== undefined
        );
        setProducts(validProducts);
      } catch (error) {
        console.error("Failed to fetch products by IDs:", error);
      }
    };

    fetchWishlistProducts();
  }, [wishlists]);

  const handleDeleteProduct = async (productId: string) => {
    try {
      dispatch(removeProductFromWishlist(productId));
      if (user) {
        await deleteWishList(productId, user);
      }
    } catch (error) {
      console.error("Failed to delete the product from wishlist:", error);
    }
  };

  const handleAddProductToCart = async (
    productId: string,
    price: number,
    quantity: number,
    promo: boolean,
    discountPercentage: number
  ) => {
    try {
      dispatch(
        addProductToCart({
          productId,
          price,
          quantity,
          promo,
          discountPercentage,
        })
      );

      const cartProduct: CartProductResponse = {
        productId: productId,
        quantity: 1,
      };

      if (user) {
        await addCart(user, [cartProduct]);
      }
    } catch (error) {
      console.error("Failed to add the product to the cart:", error);
    }
  };

  const handleClearWishList = async () => {
    try {
      dispatch(clearWishlist());
      if (user) {
        await deleteAllWishList(user);
      }
    } catch (error) {
      console.error("Failed to clear the wishlist:", error);
    }
  };

  return (
    <Layout>
      <CustomBreadcrumbs items={breadcrumbItems} />
      <Box width={{ xs: "100%", sm: "80%", md: "70%" }} mx="auto" p={3}>
        <Typography variant="h4" gutterBottom align="center" mt={5}>
          Wishlist
        </Typography>
        {wishlists && wishlists.length > 0 ? (
          <Box mb={3}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Availability</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.slice(0, productLimit).map((product: Product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteProduct(product._id)}
                            style={{
                              marginLeft: 0,
                              paddingLeft: "0",
                              marginRight: 0,
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <img
                          src={
                            product.photos && product.photos.length > 0
                              ? `${import.meta.env.VITE_API_IMAGE}${product.photos[0]}`
                              : "/default-image.jpg"
                          }
                          alt={product.name}
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                          }}
                        />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>
                        {product.promo && product.discountPercentage ? (
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
                              {product.price.toFixed(2)} TND
                            </Typography>
                            <Typography
                              variant="h6"
                              color="primary"
                              sx={{ display: "inline" }}
                            >
                              {(
                                product.price -
                                (product.price * product.discountPercentage) /
                                  100
                              ).toFixed(2)}{" "}
                              TND
                            </Typography>
                            <Typography
                              variant="body2"
                              color="error"
                              sx={{ display: "inline", marginLeft: 1 }}
                            >
                              ({product.discountPercentage}% off)
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="h6" color="text.primary">
                            {product.price.toFixed(2)} TND
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {product.stock && product.stock > 0 ? (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                          >
                            In Stock
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                          >
                            Out of Stock
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() =>
                              handleAddProductToCart(
                                product._id,
                                product.price,
                                1,
                                product.promo,
                                product.discountPercentage
                              )
                            }
                          >
                            Add to Cart
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: "red", marginTop: 2 }}
                onClick={() => handleClearWishList()}
              >
                Clear Wish
              </Button>
            </TableContainer>
            {wishlists.length > productLimit && (
              <Box textAlign="center" mt={2}>
                <Button
                  variant="outlined"
                  onClick={() => setProductLimit((prev) => prev + 5)}
                >
                  Show More
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          <Typography variant="h6" align="center">
            No products in the wishlist.
          </Typography>
        )}
      </Box>
    </Layout>
  );
};

export default Wishlist;
