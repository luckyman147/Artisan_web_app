import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Pagination,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
  SelectChangeEvent,
  CircularProgress,
  Chip,
  Stack,
  Badge,
  useTheme,
  Container,
  Skeleton
} from "@mui/material";
import { FaTh, FaList, FaFilter, FaTimes } from "react-icons/fa";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Sidebar from "./Sidebar";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Layout from "../layout/Layout";
import {
  addCart,
  addWishList,
  deleteWishList,
  fetchProduct,
} from "../../apis/action";
import { CartProductResponse, Product } from "../../apis/interfaces";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../stores/storeHooks";
import { RootState } from "../../stores/store";
import CustomBreadcrumbs from "../layout/Breadcrumbs";
import { styled } from "@mui/system";
import {
  addProductToWishlist,
  removeProductFromWishlist,
} from "../../stores/slice/wishSlice";
import { addProductToCart } from "../../stores/slice/cartSlice";
import { setLogin } from "../../stores/slice/userSlice";
import { motion } from "framer-motion";
import RefreshIcon from "@mui/icons-material/Refresh";

// Styled components with enhanced design
const ProductCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease",
  borderRadius: "12px",
  boxShadow: theme.shadows[1],
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[6],
    "& .product-image": {
      transform: "scale(1.03)",
    },
  },
}));

const ProductImage = styled(CardMedia)({
  height: 220,
  objectFit: "contain",
  transition: "transform 0.5s ease",
  background: "rgba(0, 0, 0, 0.02)",
  padding: "16px",
});

const PriceContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  margin: "12px 0",
});

const OriginalPrice = styled(Typography)({
  textDecoration: "line-through",
  color: "#999",
  fontSize: "0.85rem",
});

const DiscountBadge = styled(Chip)(({ theme }) => ({
  position: "absolute",
  top: 12,
  right: 12,
  fontWeight: "bold",
  color: theme.palette.common.white,
  backgroundColor: theme.palette.error.main,
  borderRadius: "4px",
}));

const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  borderRadius: "8px",
  padding: "8px 16px",
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[2],
  },
}));

const ViewToggleButton = styled(IconButton)(({ active, theme }) => ({
  backgroundColor: active ? theme.palette.primary.light : "transparent",
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  borderRadius: "6px",
  padding: "8px",
  "&:hover": {
    backgroundColor: active ? theme.palette.primary.light : theme.palette.action.hover,
  },
}));

const FilterButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  borderRadius: "8px",
  padding: "8px 16px",
  borderColor: theme.palette.divider,
  "&:hover": {
    borderColor: theme.palette.primary.main,
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: "8px",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.divider,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },
}));

const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Products" }];

const ProductList = () => {
  const theme = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<any>({
    search: "",
    priceRange: [0, 1000],
    stockRange: [0, 1000],
    categories: [],
    artisans: [],
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [sortOption, setSortOption] = useState("date");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [favoriteProducts, setFavoriteProducts] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const dispatch = useAppDispatch();
  const userId = useAppSelector((state: RootState) => state.user.userInfos.id);
  const wishlist = useAppSelector((state: RootState) => state.wish.products);
  const location = useLocation();

  const fetchAndUpdateProducts = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedProduct = await fetchProduct();
      setProducts(fetchedProduct);
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeUser = async () => {
      await fetchAndUpdateProducts();
  
      const productIds = wishlist.map((item) => item.productId);
      setFavoriteProducts(productIds);
  
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const id = params.get('id');
  
      if (token && id) {
        const userData = {
          token,
          id,
          role: 'user',
          isVerified: true, 
        };
  
        dispatch(setLogin(userData));
      }
    };
  
    initializeUser();
  }, [fetchAndUpdateProducts, wishlist, location.search, dispatch]);

  const sortedProducts = useMemo(() => {
    let sorted = [...products];
    switch (sortOption) {
      case "date":
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "alphabeticalAsc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "alphabeticalDesc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "priceAsc":
        sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "priceDesc":
        sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "stockAsc":
        sorted.sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0));
        break;
      case "stockDesc":
        sorted.sort((a, b) => (b.stock ?? 0) - (a.stock ?? 0));
        break;
      default:
        break;
    }
    return sorted;
  }, [products, sortOption]);

  const filteredProducts = useMemo(() => {
    return sortedProducts.filter((product) => {
      const { search, priceRange, stockRange, categories, artisans } = filter;
      const matchesSearch =
        search === "" ||
        product.name.toLowerCase().includes(search.toLowerCase());
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesStock =
        product.stock >= stockRange[0] && product.stock <= stockRange[1];
      const matchesCategory =
        categories.length === 0 || categories.includes(product.category._id);
      const matchesArtisan =
        artisans.length === 0 || artisans.includes(product.artisan._id);

      return (
        matchesSearch &&
        matchesPrice &&
        matchesStock &&
        matchesCategory &&
        matchesArtisan
      );
    });
  }, [sortedProducts, filter]);

  const handleFilterChange = (newFilters: any) => {
    setFilter((prevFilter: any) => ({
      ...prevFilter,
      ...newFilters,
    }));
    setCurrentPage(1);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortOption(event.target.value as string);
  };

  const toggleFavorite = async (productId: string) => {
    const isFavorite = favoriteProducts.includes(productId);

    if (isFavorite) {
      dispatch(removeProductFromWishlist(productId));
      if (userId) {
        try {
          await deleteWishList(productId, userId);
        } catch (error) {
          console.error("Failed to remove from wishlist on server", error);
        }
      }
      setFavoriteProducts((prevFavorites) =>
        prevFavorites.filter((id) => id !== productId)
      );
    } else {
      const product = products.find((p) => p._id === productId);
      if (product) {
        dispatch(addProductToWishlist({ productId: product._id }));
        if (userId) {
          try {
            await addWishList(userId, [productId]);
          } catch (error) {
            console.error("Failed to add to wishlist on server", error);
          }
        }
        setFavoriteProducts((prevFavorites) => [...prevFavorites, productId]);
      }
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      dispatch(
        addProductToCart({
          productId: product._id,
          quantity: 1,
          price: product.price,
          promo: product.promo,
          discountPercentage: product.discountPercentage,
        })
      );

      const cartProduct: CartProductResponse = {
        productId: product._id,
        quantity: 1,
      };

      if (userId) {
        await addCart(userId, [cartProduct]);
      }

      setSnackbarMessage(`${product.name} added to cart!`);
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error adding product to cart:", err);
      setSnackbarMessage("Failed to add product to cart");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '60vh',
            flexDirection: 'column',
            gap: 3
          }}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary">
            Loading our finest products...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={fetchAndUpdateProducts}
            startIcon={<RefreshIcon />}
            sx={{
              borderRadius: '8px',
              padding: '10px 24px'
            }}
          >
            Retry
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <CustomBreadcrumbs items={breadcrumbItems} />
        
        {/* Page Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            Our Products
          </Typography>
          
          {/* Mobile Filter Button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 2 }}>
            <FilterButton
              variant="outlined"
              startIcon={<FaFilter />}
              onClick={() => setMobileFiltersOpen(true)}
              sx={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              Filters
            </FilterButton>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Sidebar - Filters */}
          <Grid item xs={12} md={3} sx={{ 
            display: { 
              xs: mobileFiltersOpen ? 'block' : 'none', 
              md: 'block' 
            },
            position: 'relative'
          }}>
            <Box sx={{ 
              position: { xs: 'fixed', md: 'static' },
              top: 0,
              left: 0,
              width: { xs: '100%', md: 'auto' },
              height: { xs: '100vh', md: 'auto' },
              bgcolor: 'background.paper',
              zIndex: 1200,
              p: { xs: 3, md: 0 },
              overflowY: 'auto'
            }}>
              <IconButton
                sx={{ 
                  display: { xs: 'flex', md: 'none' },
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  bgcolor: 'background.paper',
                  boxShadow: 1
                }}
                onClick={() => setMobileFiltersOpen(false)}
              >
                <FaTimes />
              </IconButton>
              <Sidebar 
                onFilterChange={handleFilterChange} 
                onClose={() => setMobileFiltersOpen(false)}
              />
            </Box>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            {/* Toolbar with sort and view options */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4,
                flexWrap: 'wrap',
                gap: 2,
                backgroundColor: 'background.paper',
                p: 2,
                borderRadius: '12px',
                boxShadow: theme.shadows[1]
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Showing <strong>{filteredProducts.length}</strong> products
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
                  <InputLabel>Sort By</InputLabel>
                  <StyledSelect
                    value={sortOption}
                    onChange={handleSortChange}
                    label="Sort By"
                  >
                    <MenuItem value="date">Newest First</MenuItem>
                    <MenuItem value="alphabeticalAsc">A-Z</MenuItem>
                    <MenuItem value="alphabeticalDesc">Z-A</MenuItem>
                    <MenuItem value="priceAsc">Price: Low to High</MenuItem>
                    <MenuItem value="priceDesc">Price: High to Low</MenuItem>
                    <MenuItem value="stockAsc">Stock: Low to High</MenuItem>
                    <MenuItem value="stockDesc">Stock: High to Low</MenuItem>
                  </StyledSelect>
                </FormControl>

                <Box sx={{ 
                  display: 'flex', 
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <ViewToggleButton
                    active={viewMode === "grid"}
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                  >
                    <FaTh />
                  </ViewToggleButton>
                  <ViewToggleButton
                    active={viewMode === "list"}
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                  >
                    <FaList />
                  </ViewToggleButton>
                </Box>
              </Box>
            </Box>

            {/* Products Display */}
            {viewMode === "grid" ? (
              <Grid container spacing={3}>
                {currentProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ProductCard>
                        {/* Discount Badge */}
                        {product.promo && product.discountPercentage && (
                          <DiscountBadge
                            label={`-${product.discountPercentage}%`}
                            size="small"
                          />
                        )}

                        {/* Product Image */}
                        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                          <Link
                            to={`/product/${product._id}`}
                            style={{ textDecoration: "none" }}
                          >
                            <ProductImage
                              className="product-image"
                              image={`${import.meta.env.VITE_API_IMAGE}${product.photos[0]}`}
                              alt={product.name}
                            />
                          </Link>
                        </Box>

                        <CardContent sx={{ flexGrow: 1 }}>
                          {/* Product Name */}
                          <Typography 
                            variant="subtitle1" 
                            fontWeight="bold" 
                            gutterBottom
                            component={Link}
                            to={`/product/${product._id}`}
                            sx={{
                              textDecoration: 'none',
                              color: 'text.primary',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              minHeight: '48px',
                              '&:hover': {
                                color: 'primary.main'
                              }
                            }}
                          >
                            {product.name}
                          </Typography>

                          {/* Stock Status */}
                          <Chip
                            label={product.stock > 0 ? "In Stock" : "Out of Stock"}
                            size="small"
                            color={product.stock > 0 ? "success" : "error"}
                            sx={{ mb: 1.5 }}
                          />

                          {/* Price */}
                          {product.promo ? (
                            <PriceContainer>
                              <Typography variant="h6" color="primary" fontWeight="bold">
                                {(
                                  product.price -
                                  (product.price * product.discountPercentage) / 100
                                ).toFixed(2)}{" "}
                                TND
                              </Typography>
                              <OriginalPrice variant="body2">
                                {product.price} TND
                              </OriginalPrice>
                            </PriceContainer>
                          ) : (
                            <Typography variant="h6" color="text.primary" fontWeight="bold">
                              {product.price} TND
                            </Typography>
                          )}
                        </CardContent>

                        {/* Actions */}
                        <Box sx={{ p: 2, pt: 0 }}>
                          <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(product._id);
                              }}
                              aria-label="Add to favorites"
                              sx={{
                                '&:hover': {
                                  backgroundColor: 'transparent',
                                  transform: 'scale(1.1)'
                                }
                              }}
                            >
                              <Badge
                                color="error"
                                invisible={!favoriteProducts.includes(product._id)}
                              >
                                {favoriteProducts.includes(product._id) ? (
                                  <FavoriteIcon color="error" />
                                ) : (
                                  <FavoriteBorderIcon />
                                )}
                              </Badge>
                            </IconButton>
                            
                            <ActionButton
                              variant="contained"
                              startIcon={<ShoppingCartIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                              }}
                              disabled={product.stock <= 0}
                              fullWidth
                              sx={{
                                '&:disabled': {
                                  backgroundColor: theme.palette.grey[300],
                                  color: theme.palette.text.disabled
                                }
                              }}
                            >
                              Add to Cart
                            </ActionButton>
                          </Stack>
                        </Box>
                      </ProductCard>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {currentProducts.map((product) => (
                  <motion.div 
                    key={product._id}
                    whileHover={{ scale: 1.005 }}
                  >
                    <Card sx={{ 
                      display: 'flex', 
                      p: 2,
                      borderRadius: '12px',
                      boxShadow: theme.shadows[1],
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: theme.shadows[4]
                      }
                    }}>
                      {/* Product Image */}
                      <Box sx={{ 
                        width: 180, 
                        height: 180, 
                        flexShrink: 0,
                        position: 'relative',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}>
                        <Link
                          to={`/product/${product._id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <CardMedia
                            component="img"
                            height="180"
                            image={`${import.meta.env.VITE_API_IMAGE}${product.photos[0]}`}
                            alt={product.name}
                            sx={{ 
                              borderRadius: '8px',
                              objectFit: 'contain',
                              p: 2
                            }}
                          />
                        </Link>
                        {product.promo && product.discountPercentage && (
                          <DiscountBadge
                            label={`-${product.discountPercentage}%`}
                            size="small"
                            sx={{ top: 8, right: 8 }}
                          />
                        )}
                      </Box>

                      {/* Product Info */}
                      <Box sx={{ 
                        flexGrow: 1, 
                        ml: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <Box>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box>
                              <Typography 
                                variant="subtitle1" 
                                fontWeight="bold"
                                component={Link}
                                to={`/product/${product._id}`}
                                sx={{
                                  textDecoration: 'none',
                                  color: 'text.primary',
                                  '&:hover': {
                                    color: 'primary.main'
                                  },
                                  mb: 1
                                }}
                              >
                                {product.name}
                              </Typography>
                              
                              <Chip
                                label={product.stock > 0 ? "In Stock" : "Out of Stock"}
                                size="small"
                                color={product.stock > 0 ? "success" : "error"}
                                sx={{ mb: 1.5 }}
                              />
                            </Box>
                          </Stack>

                          {/* Price */}
                          {product.promo ? (
                            <PriceContainer>
                              <Typography variant="h6" color="primary" fontWeight="bold">
                                {(
                                  product.price -
                                  (product.price * product.discountPercentage) / 100
                                ).toFixed(2)}{" "}
                                TND
                              </Typography>
                              <OriginalPrice variant="body2">
                                {product.price} TND
                              </OriginalPrice>
                            </PriceContainer>
                          ) : (
                            <Typography variant="h6" color="text.primary" fontWeight="bold">
                              {product.price} TND
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      {/* Actions */}
                      <Box sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        ml: 2
                      }}>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(product._id);
                          }}
                          aria-label="Add to favorites"
                          sx={{
                            '&:hover': {
                              backgroundColor: 'transparent',
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <Badge
                            color="error"
                            invisible={!favoriteProducts.includes(product._id)}
                          >
                            {favoriteProducts.includes(product._id) ? (
                              <FavoriteIcon color="error" />
                            ) : (
                              <FavoriteBorderIcon />
                            )}
                          </Badge>
                        </IconButton>
                        
                        <ActionButton
                          variant="contained"
                          startIcon={<ShoppingCartIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          disabled={product.stock <= 0}
                          size="medium"
                          sx={{
                            minWidth: '160px',
                            '&:disabled': {
                              backgroundColor: theme.palette.grey[300],
                              color: theme.palette.text.disabled
                            }
                          }}
                        >
                          Add to Cart
                        </ActionButton>
                      </Box>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 6,
                '& .MuiPaginationItem-root': {
                  borderRadius: '6px'
                }
              }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <Box sx={{ 
                textAlign: 'center', 
                p: 6,
                backgroundColor: theme.palette.background.paper,
                borderRadius: '12px',
                boxShadow: theme.shadows[1],
                mt: 2
              }}>
                <Box
                  component="img"
                  src="/images/empty-state.svg"
                  alt="No products found"
                  sx={{ 
                    width: 200,
                    height: 200,
                    mb: 3,
                    opacity: 0.8
                  }}
                />
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  No products found
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
                  We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
                </Typography>
                <Button 
                  variant="contained"
                  onClick={() => {
                    setFilter({
                      search: "",
                      priceRange: [0, 1000],
                      stockRange: [0, 1000],
                      categories: [],
                      artisans: [],
                    });
                  }}
                  sx={{
                    borderRadius: '8px',
                    padding: '10px 24px'
                  }}
                >
                  Reset All Filters
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>

        {/* Success Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            variant="filled"
            sx={{ 
              width: '100%',
              borderRadius: '8px',
              boxShadow: theme.shadows[6]
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
};

export default ProductList;