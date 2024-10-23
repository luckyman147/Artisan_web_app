import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  Pagination,
  Typography,
} from "@mui/material";
import { Delete, Edit, ShoppingCart, Sell, Inventory } from "@mui/icons-material";
import Layout from "../layout/Layout";
import { fetchProductByArtisanId, fetchStaticOfArtisan } from "../../apis/action";
import { Product, ArtisanStatistics } from "../../apis/interfaces";

import { RootState } from "../../stores/store";
import { useAppSelector } from "../../stores/storeHooks";
import CustomBreadcrumbs from "../layout/Breadcrumbs";
import { Link } from "react-router-dom";
import AddNewProductModel from "./model/AddNewProductModel";
import EditProductModel from "./model/EditProductModel";
import DeleteConfirmationDialog from "./model/DeleteConfirmationDialog";

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Dashboard" },
];

export default function ArtisanDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [artisanStats, setArtisanStats] = useState<ArtisanStatistics | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const itemsPerPage = 6;
  const id = useAppSelector((state: RootState) => state.user.userInfos.id);

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await fetchProductByArtisanId(id!);
      setProducts(fetchedProducts);
      setLoading(false);
    };

    const fetchStatistics = async () => {
      const stats = await fetchStaticOfArtisan(id!);
      setArtisanStats(stats);      
    };

    fetchStatistics();
    fetchProducts();
  }, [id]);

  const handleOpenModal = (product?: Product) => {
    setSelectedProduct(product || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = (product: Product) => {
    if (selectedProduct) {
      // Editing an existing product
      setProducts(products.map((p) => (p._id === product._id ? product : p)));
    } else {
      // Adding a new product
      setProducts([...products, product]);
    }
    handleCloseModal();
  };

  const handleOpenDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      setProducts(products.filter((product) => product._id !== productToDelete._id));
    }
    handleCloseDeleteDialog();
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };
  return (
    <Layout>
      <CustomBreadcrumbs items={breadcrumbItems} />

      <Container maxWidth="lg" sx={{ mt: 12 }}>
            {artisanStats && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ShoppingCart sx={{ fontSize: 40, color: '#4caf50', mr: 1 }} />
                  <Typography variant="h6">{artisanStats.totalOrders} Orders</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Sell sx={{ fontSize: 40, color: '#ff9800', mr: 1 }} />
                  <Typography variant="h6">TND {artisanStats.totalSales} Sales</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Inventory sx={{ fontSize: 40, color: '#2196f3', mr: 1 }} />
                  <Typography variant="h6">{artisanStats.totalProducts} Products</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4">Your Products</Typography>
          <Button variant="contained" onClick={() => handleOpenModal()}>
            Add Product
          </Button>
        </Box>

        {loading ? (
          <Typography variant="h6">Loading products...</Typography>
        ) : (
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {currentProducts.map((product) => {
              // Calculate discount price if the product is in promo
              const discountPrice = product.promo
                ? product.price - (product.price * (product.discountPercentage || 0)) / 100
                : product.price;

              return (
                <Grid item xs={12} md={4} key={product._id}>
                  <Link
                    to={`/product/${product._id}`}
                    state={{ product }}
                    style={{ textDecoration: "none" }}
                  >
                    <Card
                      sx={{
                        transition: "0.3s",
                        "&:hover": {
                          boxShadow: 6,
                        },
                        padding: 3,
                        border: "1px solid #e0e0e0",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      {product.promo && product.discountPercentage && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            backgroundColor: "red",
                            color: "white",
                            borderRadius: "50%",
                            width: 40,
                            height: 40,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          -{product.discountPercentage}%
                        </Box>
                      )}
                      <CardMedia
                        component="img"
                        height="200"
                        image={`${import.meta.env.VITE_API_IMAGE}${product.photos[0]}`}
                        alt={product.name}
                        sx={{ objectFit: "cover" }}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.description}
                        </Typography>
                        {product.promo ? (
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ textDecoration: "line-through", color: "red" }}
                            >
                              Original Price: ${product.price}
                            </Typography>
                            <Typography variant="body2" color="text.primary">
                              Discounted Price: ${discountPrice.toFixed(2)}
                            </Typography>
                            <Typography variant="body2" color="text.primary">
                              Discount: {product.discountPercentage}% off
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Price: ${product.price}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                  <Box
                    sx={{
                      mt: -8,
                      display: "flex",
                      justifyContent: "flex-end",
                      backgroundColor: "white",
                      boxShadow: 1,
                      borderRadius: 1,
                      border: "1px solid #e0e0e0",
                      p: 1,
                    }}
                  >
                    <IconButton
                      onClick={() => handleOpenModal(product)}
                      sx={{
                        color: "blue",
                        "&:hover": { color: "#D4A83A" },
                        fontSize: "1.5rem",
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleOpenDeleteDialog(product)}
                      sx={{
                        color: "red",
                        "&:hover": { color: "#ff3d00" },
                        fontSize: "1.5rem",
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}

        <Box display="flex" justifyContent="center" mt={10} mb={10}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>

        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleDeleteProduct}
          product={productToDelete}
        />

        {isModalOpen && (selectedProduct ? (
          <EditProductModel
            open={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveProduct}
            product={selectedProduct}
          />
        ) : (
          <AddNewProductModel
            open={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveProduct}
          />
        ))}
      </Container>
    </Layout>
  );
}
