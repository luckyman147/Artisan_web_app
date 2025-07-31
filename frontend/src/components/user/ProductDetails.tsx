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
  Chip,
  Stack,
  IconButton,
  useTheme,
  Breadcrumbs,
  Link as MuiLink,
  Skeleton
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useParams, Link } from "react-router-dom";
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
import { motion } from "framer-motion";

const ProductDetail: React.FC = () => {
  const theme = useTheme();
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
    { label: product?.name || "Product Details" },
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
    const isFavorite = wishlist.some((item) => item.productId === productId);

    if (isFavorite) {
      dispatch(removeProductFromWishlist(productId));

      if (userId) {
        try {
          await deleteWishList(productId, userId);
        } catch (error) {
          console.error("Failed to remove from wishlist on server", error);
        }
      }
    } else {
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
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
          flexDirection="column"
          gap={3}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary">
            Loading product details...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
          flexDirection="column"
          gap={3}
          textAlign="center"
        >
          <Typography variant="h5" color="error" gutterBottom>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ borderRadius: '8px', px: 4, py: 1.5 }}
          >
            Try Again
          </Button>
        </Box>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
          flexDirection="column"
          gap={3}
          textAlign="center"
        >
          <Typography variant="h5" color="text.primary" gutterBottom>
            Product not found
          </Typography>
          <Button 
            variant="outlined" 
            component={Link} 
            to="/products"
            sx={{ borderRadius: '8px', px: 4, py: 1.5 }}
          >
            Browse Products
          </Button>
        </Box>
      </Container>
    );
  }

  const productImage = product.photos?.[0]
    ? `${import.meta.env.VITE_API_IMAGE}${product.photos[0]}`
    : "/placeholder.jpg";

  const isFavorite = wishlist.some((e) => e.productId === product._id);

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <CustomBreadcrumbs items={breadcrumbItems} />
        
        {/* Main Product Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              boxShadow: 3,
              borderRadius: "12px",
              overflow: "hidden",
              bgcolor: "background.paper",
              mb: 4,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {/* Product Image */}
            <Box
              sx={{
                width: { xs: "100%", md: "50%" },
                position: "relative",
                bgcolor: "background.default",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: { xs: 2, md: 4 },
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  maxHeight: { xs: 300, md: 450 },
                  width: "auto",
                  maxWidth: "100%",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
                image={productImage}
                alt={product.name || "Product Image"}
              />
              {product.promo && (
                <Chip
                  label={`${product.discountPercentage}% OFF`}
                  color="error"
                  size="medium"
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    fontWeight: "bold",
                  }}
                />
              )}
            </Box>

            {/* Product Details */}
            <CardContent
              sx={{
                width: { xs: "100%", md: "50%" },
                display: "flex",
                flexDirection: "column",
                p: { xs: 3, md: 4 },
              }}
            >
              <Stack spacing={3}>
                {/* Rating */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Rating
                    value={averageRating}
                    precision={0.5}
                    size="medium"
                    readOnly
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    ({userLength} reviews)
                  </Typography>
                </Box>

                {/* Product Name */}
                <Typography
                  variant="h4"
                  component="h1"
                  fontWeight="bold"
                  sx={{ lineHeight: 1.2 }}
                >
                  {product.name}
                </Typography>

                {/* Stock Status */}
                <Chip
                  label={product.stock > 0 ? "In Stock" : "Out of Stock"}
                  color={product.stock > 0 ? "success" : "error"}
                  size="small"
                  sx={{ alignSelf: "flex-start" }}
                />

                {/* Price */}
                <Box>
                  {product.promo ? (
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Typography variant="h4" color="primary" fontWeight="bold">
                        ${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ textDecoration: "line-through" }}
                      >
                        ${product.price}
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      ${product.price}
                    </Typography>
                  )}
                </Box>

                {/* Short Description */}
                <Typography variant="body1" color="text.secondary">
                  {product.description && product.description.length > 200
                    ? `${product.description.substring(0, 200)}...`
                    : product.description}
                </Typography>

                {/* Action Buttons */}
                {role !== "artisan" && (
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCartIcon />}
                      size="large"
                      fullWidth
                      sx={{
                        py: 1.5,
                        borderRadius: "8px",
                        fontWeight: "bold",
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
                        isFavorite ? (
                          <FavoriteIcon color="error" />
                        ) : (
                          <FavoriteBorderIcon />
                        )
                      }
                      size="large"
                      fullWidth
                      sx={{
                        py: 1.5,
                        borderRadius: "8px",
                        fontWeight: "bold",
                        color: isFavorite ? "error.main" : "inherit",
                        borderColor: isFavorite ? "error.main" : "inherit",
                        "&:hover": {
                          borderColor: isFavorite ? "error.dark" : "primary.main",
                        },
                      }}
                      onClick={() => toggleFavorite(product._id)}
                    >
                      {isFavorite ? "Saved" : "Save"}
                    </Button>
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs Section */}
        <Box sx={{ bgcolor: "background.paper", borderRadius: "12px", p: 3, boxShadow: 1 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="product tabs"
            sx={{
              "& .MuiTab-root": {
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1rem",
              },
            }}
          >
            <Tab label="Reviews" />
            <Tab label="Description" />
            <Tab label="Details" />
          </Tabs>
          <Divider sx={{ my: 2 }} />

          {/* Tab Content */}
          <Box sx={{ pt: 2 }}>
            {tabValue === 0 && (
              <Reviews
                productId={product._id}
                onRatingUpdate={handleRatingUpdate}
                onUserLength={handleUserRating}
              />
            )}
            {tabValue === 1 && (
              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>
            )}
            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Product Details
                </Typography>
                <Typography variant="body1" paragraph>
                  Additional product details would go here...
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default ProductDetail;