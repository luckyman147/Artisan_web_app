import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CircularProgress,
  Container,
  Tabs,
  Tab,
  Divider,
  Rating,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useParams } from "react-router-dom";
import { Product, wishlistResponseItem } from "../../apis/interfaces";
import {
  addCart,
  addWishList,
  deleteWishList,
  fetchProductById,
} from "../../apis/action";
import Layout from "../layout/Layout";
import CustomBreadcrumbs from "../layout/Breadcrumbs";
import { useAppDispatch, useAppSelector } from "../../stores/storeHooks";
import { RootState } from "../../stores/store";
import Reviews from "./Reviews";
import { addProductToCart } from "../../stores/slice/cartSlice";
import {
  addProductToWishlist,
  removeProductFromWishlist,
} from "../../stores/slice/wishSlice";
import FavoriteIcon from "@mui/icons-material/Favorite";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [userLength, setUserLength] = useState(0);

  const wishlist = useAppSelector((state: RootState) => state.wish.products);
  const userId = useAppSelector((state: RootState) => state.user.userInfos.id);
  const role = useAppSelector((state: RootState) => state.user.userInfos.role);

  const dispatch = useAppDispatch();

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: `Product Details : ${product?.name}` },
  ];

  useEffect(() => {
    async function getProduct() {
      setLoading(true);
      try {
        const fetchedProduct = await fetchProductById(id!);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        }
      } catch (err) {
        setError("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    }

    getProduct();
  }, [id]);

  const toggleFavorite = async (productId: string) => {
    // Check if the product is in the wishlist
    const isFavorite = wishlist.some((item) => item.productId === productId);

    if (isFavorite) {
      // Remove from wishlist
      dispatch(removeProductFromWishlist(productId));

      if (userId) {
        try {
          await deleteWishList(productId, userId);
        } catch (error) {
          console.error("Failed to remove from wishlist on server", error);
        }
      }
    } else {
      // Add to wishlist
      if (product) {
        const productToAdd: wishlistResponseItem = { productId };

        dispatch(addProductToWishlist(productToAdd));

        if (userId) {
          try {
            await addWishList(userId, [productId]);
          } catch (error) {
            console.error("Failed to add to wishlist on server", error);
          }
        }
      }
    }
  };

  const handleAddProductToCart = async (
    productId: string,
    price: number,
    promo: boolean,
    discountPercentage: number
  ) => {
    try {
      dispatch(
        addProductToCart({
          productId,
          price,
          quantity: 1,
          promo,
          discountPercentage,
        })
      );

      if (userId) {
        await addCart(userId, [{ productId, quantity: 1 }]);
      }
    } catch (err) {
      console.error("Error adding product to cart", err);
    }
  };

  const handleRatingUpdate = (newAverageRating: number) => {
    setAverageRating(newAverageRating);
  };

  const handleUserRating = (userLength: number) => {
    setUserLength(userLength);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" align="center">
          No product found
        </Typography>
      </Box>
    );
  }

  const productImage = product.photos?.[0]
    ? `${import.meta.env.VITE_API_IMAGE}${product.photos[0]}`
    : "/placeholder.jpg";

  return (
    <Layout>
      <CustomBreadcrumbs items={breadcrumbItems} />
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "row",
            boxShadow: 3,
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "background.paper",
          }}
        >
          <CardMedia
            component="img"
            sx={{
              width: "50%",
              height: "500px",
              objectFit: "cover",
              borderRadius: 2,
              display: { xs: "none", md: "block" },
            }}
            image={productImage}
            alt={product.name || "Product Image"}
          />
          <CardContent
            sx={{
              width: "50%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 0 }}>
              <Rating
                value={averageRating}
                precision={0.5}
                size="large"
                readOnly
              />
              <Typography variant="body2" color="textSecondary">
                ({userLength})
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="h4" gutterBottom>
                {product.name}
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body1" color="textSecondary" paragraph>
                {product.description && product.description.length > 200
                  ? `${product.description.slice(0, 200)}...`
                  : product.description}
                {product.description && product.description.length > 200 && (
                  <Button
                    size="small"
                    sx={{ ml: 1 }}
                    onClick={() => alert("Expand description")}
                  >
                    Read More
                  </Button>
                )}
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                ${product.price}
              </Typography>
            </Box>

            {role !== "artisan" && (
              <Box display="flex" gap={2} mb={2}>
                <Button
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  sx={{
                    flex: 1,
                    bgcolor: "primary.main",
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                  onClick={() =>
                    handleAddProductToCart(
                      product._id,
                      product.price,
                      product.promo,
                      product.discountPercentage
                    )
                  }
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  startIcon={
                    wishlist.some((e) => e.productId === product._id) ? (
                      <FavoriteIcon sx={{ color: "red" }} />
                    ) : (
                      <FavoriteBorderIcon />
                    )
                  }
                  sx={{
                    flex: 1,
                    borderColor: "black",
                    color: wishlist.some((e) => e.productId === product._id)
                      ? "red"
                      : "default",
                    "&:hover": {
                      borderColor: "secondary.dark",
                      color: wishlist.some((e) => e.productId === product._id)
                        ? "darkred"
                        : "default",
                    },
                  }}
                  onClick={() => toggleFavorite(product._id)}
                >
                  {wishlist.some((e: any) => e.productId === product._id)
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"}
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
        <Box mt={4}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="product tabs"
          >
            <Tab label="Reviews" />
            <Tab label="Description" />
          </Tabs>
          <Divider sx={{ my: 2 }} />
          {tabValue === 0 ? (
            <Reviews
              productId={product._id}
              onRatingUpdate={handleRatingUpdate}
              onUserLength={handleUserRating}
            />
          ) : (
            <Typography>{product.description}</Typography>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default ProductDetail;
