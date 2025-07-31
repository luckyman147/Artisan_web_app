import { Box, Button, Container, Grid, Typography, Card, CardContent, CardMedia, Stack, useTheme, useMediaQuery } from "@mui/material";
import Layout from "./layout/Layout";
import ProductCarousel from "./ProductCarousel";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../stores/storeHooks";
import { RootState } from "../stores/store";
import { useEffect, useState } from "react";
import { featured_products } from "../apis/action";
import { Product } from "../apis/interfaces";
import ArtisansCard from "./ArtisansCard";
import { styled } from "@mui/system";
import { motion } from "framer-motion";

// Styled components with improved animations and responsive design
const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: "80vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  padding: theme.spacing(8, 2),
  background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  position: "relative",
  overflow: "hidden",
  [theme.breakpoints.down('md')]: {
    minHeight: "70vh",
    padding: theme.spacing(6, 2)
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(255,255,255,0.8)",
    zIndex: 1
  }
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 2,
  maxWidth: "800px",
  margin: "0 auto",
  [theme.breakpoints.down('sm')]: {
    maxWidth: "100%"
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  position: "relative",
  display: "inline-block",
  fontWeight: 700,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.8rem',
    marginBottom: theme.spacing(3)
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -8,
    left: "50%",
    transform: "translateX(-50%)",
    width: "80px",
    height: "4px",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "2px"
  }
}));

const ProductCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[8]
  }
}));

const ProductMedia = styled(CardMedia)(({ theme }) => ({
  height: 0,
  paddingTop: "75%", // 4:3 aspect ratio
  objectFit: "cover",
  backgroundColor: theme.palette.grey[100],
  transition: "transform 0.5s ease",
  "&:hover": {
    transform: "scale(1.05)"
  }
}));

const CtaButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  fontSize: "1rem",
  fontWeight: 600,
  borderRadius: "50px",
  boxShadow: theme.shadows[2],
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[6],
    transform: "translateY(-2px)"
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 3),
    fontSize: "0.9rem"
  }
}));

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};

const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
};

export default function LandingPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const role = useAppSelector((state: RootState) => state.user.userInfos.role);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const products = await featured_products();
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };
    
    if (role === "Admin") {
      navigate("/Admin_dashboard");
    }

    fetchFeaturedProducts();
  }, [role, navigate]);

  return (
    <Layout>
      {/* Hero Section with animations */}
      <HeroSection>
        <HeroContent>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <Typography 
              variant={isMobile ? "h3" : "h2"} 
              component="h1" 
              gutterBottom
              sx={{
                fontWeight: 700,
                color: "text.primary",
                mb: 3,
                lineHeight: 1.2
              }}
            >
              Handcrafted Excellence, Delivered to You
            </Typography>
            <Typography 
              variant={isMobile ? "body1" : "h5"} 
              component="p" 
              sx={{
                color: "text.secondary",
                mb: 4,
                maxWidth: "600px",
                mx: "auto",
                lineHeight: 1.6
              }}
            >
              Discover unique, artisan-crafted products that tell a story and bring authenticity to your life.
            </Typography>
            {role !== "artisan" && (
              <Stack 
                direction={isMobile ? "column" : "row"} 
                spacing={2} 
                justifyContent="center"
                sx={{ width: isMobile ? "100%" : "auto" }}
              >
                <CtaButton 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate("/products")}
                  sx={{ width: isMobile ? "100%" : "auto" }}
                >
                  Shop Now
                </CtaButton>
                <CtaButton 
                  variant="outlined" 
                  color="primary"
                  onClick={() => navigate("/artisanlist")}
                  sx={{ width: isMobile ? "100%" : "auto" }}
                >
                  Meet Artisans
                </CtaButton>
              </Stack>
            )}
          </motion.div>
        </HeroContent>
      </HeroSection>

      {/* Promotions Carousel */}
      <Box sx={{ py: 8, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideUp}
          >
            <ProductCarousel />
          </motion.div>
        </Container>
      </Box>

      {/* Featured Products Section */}
      <Box sx={{ py: 8, bgcolor: "background.default" }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <SectionTitle variant={isMobile ? "h4" : "h3"} align="center">
              Featured Products
            </SectionTitle>
            {featuredProducts.length > 0 ? (
              <Grid container spacing={4}>
                {featuredProducts.map((product) => (
                  <Grid 
                    item 
                    xs={12} 
                    sm={6} 
                    md={4} 
                    key={product._id}
                    component={motion.div}
                    initial="hidden"
                    animate="visible"
                    variants={slideUp}
                  >
                    <ProductCard>
                      <ProductMedia
                        image={`${import.meta.env.VITE_API_IMAGE}${product.photos[0]}`}
                        title={product.name}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="h3">
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {product.description.length > 100 
                            ? `${product.description.substring(0, 100)}...` 
                            : product.description}
                        </Typography>
                        <Typography variant="h6" color="primary" paragraph>
                          ${product.price}
                        </Typography>
                      </CardContent>
                      <Box sx={{ p: 2 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          size="medium"
                          onClick={() => navigate(`/product/${product._id}`)}
                        >
                          View Details
                        </Button>
                      </Box>
                    </ProductCard>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" align="center">
                No featured products available at the moment.
              </Typography>
            )}
          </motion.div>
        </Container>
      </Box>

      {/* Artisans of the Month Section */}
      <Box sx={{ py: 8, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <SectionTitle variant={isMobile ? "h4" : "h3"} align="center">
              Featured Artisans
            </SectionTitle>
            <ArtisansCard />
          </motion.div>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box sx={{ 
        py: 8, 
        bgcolor: "primary.main", 
        color: "primary.contrastText",
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideUp}
          >
            <Typography variant={isMobile ? "h4" : "h3"} component="h2" gutterBottom>
              Ready to Discover More?
            </Typography>
            <Typography variant={isMobile ? "body1" : "h6"} component="p" gutterBottom sx={{ mb: 4 }}>
              Join our community of artisans and customers who value quality craftsmanship.
            </Typography>
            <Stack 
              direction={isMobile ? "column" : "row"} 
              spacing={2} 
              justifyContent="center"
              sx={{ width: isMobile ? "100%" : "auto" }}
            >
              <CtaButton 
                variant="contained" 
                color="secondary"
                onClick={() => navigate("/products")}
                sx={{ 
                  width: isMobile ? "100%" : "auto",
                  color: "text.primary"
                }}
              >
                Browse Collection
              </CtaButton>
              <CtaButton 
                variant="outlined" 
                sx={{ 
                  color: "primary.contrastText",
                  borderColor: "primary.contrastText",
                  "&:hover": {
                    borderColor: "primary.contrastText",
                    backgroundColor: "rgba(255,255,255,0.1)"
                  },
                  width: isMobile ? "100%" : "auto"
                }}
                onClick={() => navigate("/artisanlist")}
              >
                Meet Our Artisans
              </CtaButton>
            </Stack>
          </motion.div>
        </Container>
      </Box>
    </Layout>
  );
}