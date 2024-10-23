import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import Layout from "./layout/Layout";
import ProductCarousel from "./ProductCarousel";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../stores/storeHooks";
import { RootState } from "../stores/store";
import { useEffect, useState } from "react";
import { featured_products } from "../apis/action";
import { Product } from "../apis/interfaces";
import imge from "./../assets/images/blob-scene-haikei login.svg";
import ArtisansCard from "./ArtisansCard";

export default function LandingPage() {
  const navigate = useNavigate();
  const role = useAppSelector((state: RootState) => state.user.userInfos.role);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      const products = await featured_products();
      setFeaturedProducts(products);
    };
    if(role === "Admin"){
      navigate("/Admin_dashboard")
    }

    fetchFeaturedProducts();
  }, []);

  return (
    <Layout>
      {/* Promotion Section */}
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          maxWidth: "100%",
          padding: 0,
          px: 0,
        }}
      >
        {/* Hero Section */}
        <Box
          textAlign="center"
          pt={"50px"}
          mt={5}
          sx={{
            backgroundImage: `url(${imge})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            px: 5,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Discover our handmade products
          </Typography>
          <Typography variant="h6">Unique creations made with love.</Typography>
          {role !== "artisan" && (
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate("/products")}>
              See Products
            </Button>
          )}
        </Box>

        {/* Promotions Section */}
        <ProductCarousel />

        {/* Featured Products Section */}
        <Box my={5} px={{ xs: 2, sm: 5 }}>
          <Typography variant="h5" gutterBottom>
            Featured Products
          </Typography>
          <Grid container spacing={3}>
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                    }}
                  >
                    {/* Display product image */}
                    <Box
                      height={250}
                      bgcolor="#f5f5f5"
                      mb={2}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ borderRadius: "8px", overflow: "hidden" }}
                    >
                      <img
                        src={`${import.meta.env.VITE_API_IMAGE}${product.photos[0]}`}
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: "auto",
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" mb={2}>
                      {product.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      En savoir plus
                    </Button>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Typography variant="body1">No featured products available at the moment.</Typography>
            )}
          </Grid>
        </Box>

        {/* Artisans of the Month Section */}
        <ArtisansCard />
      </Container>
    </Layout>
  );
}
