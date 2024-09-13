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
import { CartProduct, Product } from "../../apis/interfaces";
import { addCart, addWishList, fetchProductById } from "../../apis/action";
import Layout from "../layout/Layout";
import CustomBreadcrumbs from "../layout/Breadcrumbs";
import { useAppSelector } from "../../stores/storeHooks";
import { RootState } from "../../stores/store";
import Reviews from "./Reviews";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [name, setName] = useState<string | null>(null);
  const [favoriteProducts, setFavoriteProducts] = useState<string[]>([]);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [userLength, setUserLength] = useState(0);

  const userId = useAppSelector((state: RootState) => state.user.userInfos.id);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/product" },
    { label: `Product Details : ${name}` },
  ];

  useEffect(() => {
    async function getProduct() {
      try {
        const fetchedProduct = await fetchProductById(id!);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          setName(fetchedProduct.name);
        }
      } catch (err) {
        setError("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    }

    getProduct();
  }, [id]);

  const toggleFavorite = async (productId: string, clientId: string) => {
    try {
      const isFavorite = favoriteProducts.includes(productId);

      if (isFavorite) {
        setFavoriteProducts((prevFavorites) =>
          prevFavorites.filter((id) => id !== productId)
        );
        // Handle removing from the wishlist (API call)
      } else {
        const addwishResponse = await addWishList(clientId, productId);
        if (addwishResponse) {
          setFavoriteProducts((prevFavorites) => [...prevFavorites, productId]);
        } else {
          setError("Failed to add to wishlist");
        }
      }
    } catch (err) {
      setError("Failed to update favorite products");
    }
  };

  const addToCart = async (client: string, products: CartProduct[]) => {
    try {
      await addCart(client, products);
      setSnackbarMessage("Added to cart!");
    } catch (error) {
      setError("Failed to add to cart");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleRatingUpdate = (newAverageRating: number) => {
    setAverageRating(newAverageRating); // Update average rating
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

  const productImage = product?.photos?.[0]
    ? `http://localhost:5000/${product.photos[0]}`
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 0, 
              }}
            >
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
                  ? product.description.slice(0, 200) + "..."
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
                  addToCart(userId!, [{ productId: product._id, quantity: 1 }])
                }
              >
                Add to Cart
              </Button>
              <Button
                variant="outlined"
                startIcon={<FavoriteBorderIcon />}
                sx={{
                  flex: 1,
                  borderColor: "black",
                  color : 'red',
                  "&:hover": {
                    borderColor: "secondary.dark",
                    color: "secondary.dark",
                  },
                }}
                onClick={() => toggleFavorite(id!, userId!)}
              >
                Add to Wishlist
              </Button>
            </Box>
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
