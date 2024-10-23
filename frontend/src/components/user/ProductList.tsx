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
  Divider,
  InputLabel,
  Select,
  Snackbar,
  Alert,
  SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import { FaTh, FaList } from "react-icons/fa";
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

// Styling for grid container
const GridContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up("sm")]: {
    paddingLeft: 0,
    paddingRight: 0,
  },
}));

const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Products" }];

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<any>({
    search: "",
    priceRange: [0, 1000],
    stockRange: [0, 1000],
    categories: [],
    artisans: [],
  });
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(6);
  const [sortOption, setSortOption] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [favoriteProducts, setFavoriteProducts] = useState<string[]>([]);

  const dispatch = useAppDispatch();
  const userId = useAppSelector((state: RootState) => state.user.userInfos.id);
  const wishlist = useAppSelector((state: RootState) => state.wish.products);
  const location = useLocation();

  // Fetch products and update state
  const fetchAndUpdateProducts = useCallback(async () => {
    try {
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
        sorted.sort((a, b) =>
          sortDirection === "asc"
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
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
  }, [products, sortOption, sortDirection]);

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

      setSnackbarMessage("Added to cart!");
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
    setLoading(true); 
    setCurrentPage(page);
    
    setTimeout(() => {
      setLoading(false); 
    }, 1000); 
  };
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' // Center in full viewport height
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ marginLeft: 2 }}>
          Loading products...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }
  return (
    <Layout>
      <CustomBreadcrumbs items={breadcrumbItems} />
      <GridContainer container spacing={3}>
        <Grid item xs={12} md={3}>
          <Sidebar onFilterChange={handleFilterChange} />
        </Grid>

        <Grid item xs={12} md={9}>
          {/* Sort and View Mode Section */}
          <Box
            mb={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <FormControl variant="outlined" size="small">
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortOption}
                onChange={handleSortChange}
                label="Sort by"
              >
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="alphabeticalAsc">Alphabetical (A-Z)</MenuItem>
                <MenuItem value="alphabeticalDesc">Alphabetical (Z-A)</MenuItem>
                <MenuItem value="priceAsc">Price (Low to High)</MenuItem>
                <MenuItem value="priceDesc">Price (High to Low)</MenuItem>
                <MenuItem value="stockAsc">Stock (Low to High)</MenuItem>
                <MenuItem value="stockDesc">Stock (High to Low)</MenuItem>
              </Select>
            </FormControl>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              sx={{
                mt: 5,
                display: "flex",
                justifyContent: "center",
                mb: 5,
              }}
            />
            {/* View mode toggle buttons */}
            <Box>
              <IconButton onClick={() => setViewMode("grid")}>
                <FaTh
                  style={{ color: viewMode === "grid" ? "blue" : "inherit" }}
                />
              </IconButton>
              <IconButton onClick={() => setViewMode("list")}>
                <FaList
                  style={{ color: viewMode === "list" ? "blue" : "inherit" }}
                />
              </IconButton>
            </Box>
          </Box>

          {/* Grid/List view based on viewMode */}
          {viewMode === "grid" ? (
            <Grid container spacing={3}>
              {currentProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <Card sx={{ height: "100%", position: "relative" }}>
                    {/* Circular Discount Badge */}
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
                    <Link
                      to={`/product/${product._id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        image={`${import.meta.env.VITE_API_IMAGE}${product.photos[0]}`}
                        alt={product.name}
                      />
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {product.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                        >
                          {product.description}
                        </Typography>

                        {/* Price and Promotion Display */}
                        {product.promo ? (
                          <>
                            <Typography variant="h6" color="text.primary">
                              {(
                                product.price -
                                (product.price * product.discountPercentage) /
                                  100
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
                            {product.price} TND
                          </Typography>
                        )}

                        {/* Stock Status */}
                        {product.stock > 0 ? (
                          <Typography variant="body2" color="success.main">
                            In Stock
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="error.main">
                            Out of Stock
                          </Typography>
                        )}
                      </CardContent>
                    </Link>
                    <Divider />
                    <Box display="flex" justifyContent="space-between" p={2}>
                      <IconButton
                        sx={{
                          color: favoriteProducts.includes(product._id)
                            ? "red"
                            : "default",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product._id);
                        }}
                      >
                        {favoriteProducts.includes(product._id) ? (
                          <FavoriteIcon sx={{ color: "red" }} />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ShoppingCartIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box>
              {currentProducts.map((product) => (
                <Card
                  key={product._id}
                  sx={{
                    display: "flex",
                    mb: 2,
                    position: "relative",
                    padding: 2,
                    alignItems: "center",
                  }}
                >
                  {/* Circular Discount Badge */}
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
                  <Link
                    to={`/product/${product._id}`}
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140" 
                      image={`${import.meta.env.VITE_API_IMAGE}${product.photos[0]}`}
                      alt={product.name}
                      sx={{
                        width: 150, 
                        marginRight: 2, 
                      }}
                    />
                    <Box
                      ml={2}
                      flexGrow={1}
                      sx={{
                        display: "flex",
                        flexDirection: "column", 
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {product.name}
                      </Typography>
                      {/* Stock Status */}
                      {product.stock > 0 ? (
                        <Typography variant="body2" color="success.main">
                          In Stock
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="error.main">
                          Out of Stock
                        </Typography>
                      )}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {product.description}
                      </Typography>

                      {/* Price and Promotion Display */}
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
                          {product.price} TND
                        </Typography>
                      )}
                    </Box>
                  </Link>
                  <Box
                    display="flex"
                    alignItems="center"
                    ml={3}
                    sx={{
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <IconButton
                      sx={{
                        color: favoriteProducts.includes(product._id)
                          ? "red"
                          : "default",
                        marginBottom: 1,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product._id);
                      }}
                    >
                      {favoriteProducts.includes(product._id) ? (
                        <FavoriteIcon sx={{ color: "red" }} />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ShoppingCartIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      size="small" 
                      sx={{
                        padding: "10px 8px", 
                        marginTop: 1,
                        marginRight: 0,
                        justifyContent: "center", 
                      }}
                    >
                    </Button>
                  </Box>
                </Card>
              ))}
            </Box>
          )}

          {/* Pagination */}
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            sx={{
              mt: 5,
              display: "flex",
              justifyContent: "center",
              mb: 5,
            }}
          />
        </Grid>
      </GridContainer>

      {/* Snackbar for success messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default ProductList;
