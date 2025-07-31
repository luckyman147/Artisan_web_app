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
  Paper,
  Chip,
  Tooltip,
  Avatar,
  Stack,
  Skeleton
} from "@mui/material";
import { 
  Delete, 
  Edit, 
  ShoppingCart, 
  MonetizationOn, 
  Inventory2,
  Add,
  LocalOffer
} from "@mui/icons-material";
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

const StatCard = ({ icon, title, value, color }: { 
  icon: React.ReactNode, 
  title: string, 
  value: string | number,
  color: string 
}) => (
  <Paper elevation={0} sx={{ 
    p: 3, 
    borderRadius: 3,
    background: `linear-gradient(135deg, ${color}10, ${color}05)`,
    border: `1px solid ${color}20`,
    height: '100%'
  }}>
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar sx={{ 
        bgcolor: `${color}15`, 
        width: 56, 
        height: 56,
        '& .MuiSvgIcon-root': { color }
      }}>
        {icon}
      </Avatar>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>
      </Box>
    </Stack>
  </Paper>
);

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
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fetchedProducts, stats] = await Promise.all([
          fetchProductByArtisanId(id!),
          fetchStaticOfArtisan(id!)
        ]);
        setProducts(fetchedProducts);
        setArtisanStats(stats);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      setProducts(products.map((p) => (p._id === product._id ? product : p)));
    } else {
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

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Artisan Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your products and view your business performance
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            {loading ? (
              <Skeleton variant="rounded" height={120} />
            ) : (
              <StatCard
                icon={<ShoppingCart fontSize="medium" />}
                title="Total Orders"
                value={artisanStats?.totalOrders || 0}
                color="#4caf50"
              />
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            {loading ? (
              <Skeleton variant="rounded" height={120} />
            ) : (
              <StatCard
                icon={<MonetizationOn fontSize="medium" />}
                title="Total Sales"
                value={`TND ${artisanStats?.totalSales.toLocaleString() || 0}`}
                color="#ff9800"
              />
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            {loading ? (
              <Skeleton variant="rounded" height={120} />
            ) : (
              <StatCard
                icon={<Inventory2 fontSize="medium" />}
                title="Products Listed"
                value={artisanStats?.totalProducts || 0}
                color="#2196f3"
              />
            )}
          </Grid>
        </Grid>

        {/* Products Section */}
        <Paper elevation={0} sx={{ 
          p: 4, 
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3
          }}>
            <Typography variant="h5" fontWeight={600}>
              Your Products
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenModal()}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none'
                }
              }}
            >
              Add Product
            </Button>
          </Box>

          {loading ? (
            <Grid container spacing={3}>
              {[...Array(3)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton variant="rounded" height={350} />
                </Grid>
              ))}
            </Grid>
          ) : products.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              p: 6,
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 2
            }}>
              <Inventory2 sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                No products found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                You haven't added any products yet. Start by adding your first product.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenModal()}
                sx={{ borderRadius: 2 }}
              >
                Add Product
              </Button>
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                {currentProducts.map((product) => {
                  const discountPrice = product.promo
                    ? product.price - (product.price * (product.discountPercentage || 0)) / 100
                    : product.price;

                  return (
                    <Grid item xs={12} sm={6} md={4} key={product._id}>
                      <Card sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 3
                        },
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 2
                      }}>
                        {product.promo && (
                          <Chip
                            label={`${product.discountPercentage}% OFF`}
                            color="error"
                            size="small"
                            icon={<LocalOffer fontSize="small" />}
                            sx={{
                              position: 'absolute',
                              top: 12,
                              left: 12,
                              zIndex: 1,
                              fontWeight: 600
                            }}
                          />
                        )}
                        
                        <Link
                          to={`/product/${product._id}`}
                          state={{ product }}
                          style={{ textDecoration: "none", color: 'inherit' }}
                        >
                          <CardMedia
                            component="img"
                            height="200"
                            image={`${import.meta.env.VITE_API_IMAGE}${product.photos[0]}`}
                            alt={product.name}
                            sx={{ 
                              objectFit: "cover",
                              transition: 'transform 0.3s',
                              '&:hover': {
                                transform: 'scale(1.05)'
                              }
                            }}
                          />
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography 
                              gutterBottom 
                              variant="h6" 
                              component="div" 
                              noWrap
                              fontWeight={600}
                            >
                              {product.name}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color="text.secondary" 
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                mb: 2,
                                minHeight: 40
                              }}
                            >
                              {product.description}
                            </Typography>
                            <Box sx={{ mt: 'auto' }}>
                              {product.promo ? (
                                <Stack direction="row" spacing={1} alignItems="baseline">
                                  <Typography
                                    variant="body2"
                                    sx={{ 
                                      textDecoration: "line-through", 
                                      color: "text.secondary"
                                    }}
                                  >
                                    TND {product.price.toFixed(2)}
                                  </Typography>
                                  <Typography 
                                    variant="h6" 
                                    color="primary"
                                    fontWeight={700}
                                  >
                                    TND {discountPrice.toFixed(2)}
                                  </Typography>
                                </Stack>
                              ) : (
                                <Typography 
                                  variant="h6" 
                                  color="primary"
                                  fontWeight={700}
                                >
                                  TND {product.price.toFixed(2)}
                                </Typography>
                              )}
                            </Box>
                          </CardContent>
                        </Link>
                        
                        <Box sx={{ 
                          p: 1.5, 
                          display: 'flex', 
                          justifyContent: 'flex-end',
                          borderTop: '1px solid',
                          borderColor: 'divider',
                          background: 'rgba(0, 0, 0, 0.02)'
                        }}>
                          <Tooltip title="Edit Product" arrow>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenModal(product);
                              }}
                              color="primary"
                              size="medium"
                              sx={{ mr: 1 }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Product" arrow>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDeleteDialog(product);
                              }}
                              color="error"
                              size="medium"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>

              {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontWeight: 600
                      }
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Paper>

        {/* Modals */}
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