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
import { deleteWishList, getWishListById } from "../apis/action";
import { useAppDispatch, useAppSelector } from "../stores/storeHooks";
import { RootState } from "../stores/store";
import { Product, wishlists } from "../apis/interfaces";
import CustomBreadcrumbs from "./layout/Breadcrumbs";
import { setWishlist } from "../stores/slice/listsSlice";
import DeleteIcon from "@mui/icons-material/Delete";

const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "WishList" }];

const Wishlist = () => {
  const id = useAppSelector((state: RootState) => state.user.userInfos.id);
  const [wishlists, setWishlists] = useState<wishlists[] | null>(null);
  const [productLimit, setProductLimit] = useState<number>(10);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchWishlist = async (userId: string) => {
      try {
        const wishlistData = await getWishListById(userId);
        if (wishlistData) {
          
          setWishlists(wishlistData);
          const wishlength = wishlistData.reduce(
            (acc, wishlist) => acc + (wishlist.products?.length || 0),
            0
          );
          dispatch(setWishlist(wishlength));
          console.log(wishlistData, "Wishlist fetched");
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    if (id) {
      fetchWishlist(id);
    }
  }, [id, dispatch]);

  const handleDeleteProduct = async (productId: string, clientId: string) => {
    try {
      // Call API to delete the product from the wishlist
      await deleteWishList(productId, clientId);
  
      // Update the local state after deletion
      setWishlists((prevWishlists) =>
        prevWishlists
          ? prevWishlists.map((wishlist) =>
              wishlist.products
                ? {
                    ...wishlist,
                    products: wishlist.products.filter(
                      (product: Product) => product._id !== productId
                    ),
                  }
                : wishlist
            )
          : null
      );
  
      // Recalculate and update the wishlist length in the global state
      const updatedWishlistData = await getWishListById(id!);
      const wishlength = updatedWishlistData?.reduce(
        (acc, wishlist) => acc + (wishlist.products?.length || 0),
        0
      );  
      if (wishlength !== undefined) {
        dispatch(setWishlist(wishlength));
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
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
          wishlists.map((wishlist) => (
            <Box key={wishlist._id} mb={3}>
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
                    {wishlist.products && wishlist.products.length > 0 ? (
                      wishlist.products
                        .slice(0, productLimit)
                        .map((product: Product) => (
                          <TableRow key={product._id}>
                            <TableCell>
                              <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                              >
                                <IconButton
                                  color="error"
                                  onClick={() =>
                                    handleDeleteProduct(
                                      product._id,
                                      id!
                                    )
                                  }
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
                                    ? `http://localhost:5000/${product.photos[0]}`
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
                              $
                              {product.price
                                ? product.price.toFixed(2)
                                : "0.00"}
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
                                >
                                  Add to Cart
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No product found in the wishlist.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {wishlist.products.length > productLimit && (
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
          ))
        ) : (
          <Typography variant="h6" align="center">
            No wishlists found.
          </Typography>
        )}
      </Box>
    </Layout>
  );
};

export default Wishlist;
