import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import Layout from "./layout/Layout";
import imge from "./../assets/images/blob-scene-haikei login.svg";

import ProductCarousel from "./ProductCarousel";
import ArtisansCarousel from "./AristanCarousel";

// export const Wave = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg
//     data-name="Layer 1"
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 1200 120"
//     preserveAspectRatio="none"
//     {...props}
//   >
//     <path
//       d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
//       className="shape-fill"
//     />
//   </svg>
// );
export default function LandingPage() {
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
        {/* <Box mt={50} mb={2}>
          <Typography variant="h4" component="div" gutterBottom>
            Welcome to Our Store
          </Typography>
          <Typography variant="body2">
            Explore our wide range of products and find what suits your needs.
          </Typography>
        </Box> */}
       {/* <Box
          textAlign="center"
          pt={"50px"}
          mt={5}
          sx={{
            backgroundImage: `url(${waves})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            // borderRadius: 5,
            px: 5,
            // marginX: 5
          }}
        >
         
        </Box> */}
        {/* Hero Section */}
        <Box
          textAlign="center"
          pt={"50px"}
          mt={5}
          sx={{
            backgroundImage: `url(${imge})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            // borderRadius: 5,
            px: 5,
            // marginX: 5
          }}
        >
          <Typography variant="h4" gutterBottom>
            Discover our handmade products
          </Typography>
          <Typography variant="h6">Unique creations made with love.</Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }}>
            See Products
          </Button>
        </Box>

        {/* Promotions Section */}
        <ProductCarousel />

        {/* Featured Products Section */}
        <Box my={5} px={5}>
          <Typography variant="h5" gutterBottom>
            Featured Products
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Box height={200} bgcolor="#E0E0E0" mb={2} />
                <Typography variant="h6">Produit Vedette 1</Typography>
                <Typography>Description du produit vedette 1.</Typography>
                <Button color="primary">En savoir plus</Button>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Box height={200} bgcolor="#E0E0E0" mb={2} />
                <Typography variant="h6">Produit Vedette 2</Typography>
                <Typography>Description du produit vedette 2.</Typography>
                <Button color="primary">En savoir plus</Button>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Box height={200} bgcolor="#E0E0E0" mb={2} />
                <Typography variant="h6">Produit Vedette 3</Typography>
                <Typography>Description du produit vedette 3.</Typography>
                <Button color="primary">En savoir plus</Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Artisans of the Month Section */}
        <ArtisansCarousel />
      </Container>
    </Layout>
  );
}
