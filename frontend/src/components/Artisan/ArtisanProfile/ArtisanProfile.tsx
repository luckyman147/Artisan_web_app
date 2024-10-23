import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Pagination,
} from "@mui/material";
import { Product, ArtisanInfo } from "../../../apis/interfaces";
import { useAppSelector } from "../../../stores/storeHooks";
import { RootState } from "../../../stores/store";
import { fetchProductByArtisanId, getArtisanById } from "../../../apis/action";
import Layout from "../../layout/Layout";
import { Link, useParams } from "react-router-dom";
import ArtisanSidebar from "../ArtisanSidebar";

const ArtisanProfile: React.FC = () => {
  const [artisan, setArtisan] = useState<ArtisanInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(6);
  const { userId } = useParams<{ userId: string }>();

  const token = useAppSelector((state: RootState) => state.user.userInfos.token);

  useEffect(() => {
    const fetchArtisanData = async () => {
      try {
        const artisanData: ArtisanInfo | undefined = await getArtisanById(userId!);
        if (artisanData) setArtisan(artisanData);

        const artisanProducts: Product[] = await fetchProductByArtisanId(userId!);
        setProducts(artisanProducts);
      } catch (error) {
        console.error("Failed to fetch artisan data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtisanData();
  }, [userId, token]);

  const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (!artisan) {
    return <Typography variant="h6">Artisan not found.</Typography>;
  }

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ mt: 8, paddingBottom: 5 }}>
        <Grid container spacing={3}>
          {/* Sidebar for Artisan Info */}
          <Grid item xs={12} md={3}>
            <ArtisanSidebar artisan={artisan} />
          </Grid>

          {/* Products Section */}
          <Grid item xs={12} md={9} mb={5}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4, mt : 10 ,  fontWeight: "bold" }}>
              Products
            </Typography>
            <Grid container spacing={4}>
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product._id}>
                    <Card
                      sx={{
                        transition: "0.3s",
                        "&:hover": {
                          boxShadow: 8,
                        },
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        border: "1px solid #e0e0e0",
                        borderRadius: 4,
                        mr : 5
                      }}
                    >
                      <Link to={`/product/${product._id}`} style={{ textDecoration: "none" }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={`${import.meta.env.VITE_API_IMAGE}${product.photos[0]}`}
                          alt={product.name}
                          sx={{ objectFit: "cover", borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
                        />
                        <CardContent>
                          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                            {product.name}
                          </Typography>
                          {product.promo ? (
                            <>
                              <Typography variant="h6" color="text.primary">
                                {(
                                  product.price -
                                  (product.price * product.discountPercentage) / 100
                                ).toFixed(2)}{" "}
                                TND
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ textDecoration: "line-through" }}
                              >
                                {product.price} TND
                              </Typography>
                              <Typography variant="body2" color="error.main">
                                -{product.discountPercentage}% OFF
                              </Typography>
                            </>
                          ) : (
                            <Typography variant="h6" color="text.primary">
                            Price: {product.price.toFixed(2)} TND
                            </Typography>
                          )}
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {product.description}
                          </Typography>
                        </CardContent>
                      </Link>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No products available for this artisan.
                </Typography>
              )}
            </Grid>

            {/* Pagination */}
            {products.length > itemsPerPage && (
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handleChangePage}
                variant="outlined"
                shape="rounded"
                sx={{
                  mt: 5,
                  display: "flex",
                  justifyContent: "center",
                  "& .MuiPaginationItem-root": {
                    mx: 1,
                  },
                }}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default ArtisanProfile;
