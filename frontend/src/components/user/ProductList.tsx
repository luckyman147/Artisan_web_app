import { useEffect, useState, useCallback } from "react";
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
  getCartListById,
  getWishListById,
} from "../../apis/action";
import { CartList, CartProduct, Product } from "../../apis/interfaces";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../stores/storeHooks";
import { setLogin } from "../../stores/slice/userSlice";
import { setAccesToken } from "../../apis/axiosConfig";
import CustomBreadcrumbs from "../layout/Breadcrumbs";
import { styled } from "@mui/system";
import { RootState } from "../../stores/store";
import { setCartLength, setWishlist } from "../../stores/slice/listsSlice";

const GridContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up("sm")]: {
    paddingLeft: 0,
    paddingRight: 0,
  },
}));

const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Products" }];

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<string[]>([]);
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
  const [productsPerPage] = useState(9);
  const [sortOption, setSortOption] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userId = useAppSelector((state: RootState) => state.user.userInfos.id);

  // Fetch and update products
  const fetchAndUpdateProducts = useCallback(async () => {
    try {
      const fetchedProduct = await fetchProduct();
      const sortedProducts = sortProducts(fetchedProduct);
      setProducts(sortedProducts);
      applyFilters(sortedProducts);
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [sortOption, sortDirection, filter]);

  // Fetch and update wishlist
  const fetchAndUpdateWishlist = useCallback(async () => {
    try {
      const wishlist = await getWishListById(userId!);
      if (wishlist) {
        setFavoriteProducts(
          wishlist[0].products.map((product: any) => product._id)
        );
      }
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
      setError("Failed to fetch wishlist");
    }
  }, [userId]);

  useEffect(() => {
    fetchAndUpdateProducts();
    fetchAndUpdateWishlist();
  }, [fetchAndUpdateProducts, fetchAndUpdateWishlist]);

  const sortProducts = (products: Product[]) => {
    let sortedProducts = [...products];
    switch (sortOption) {
      case "date":
        sortedProducts.sort((a, b) =>
          sortDirection === "asc"
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "alphabeticalAsc":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "alphabeticalDesc":
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "priceAsc":
        sortedProducts.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "priceDesc":
        sortedProducts.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "stockAsc":
        sortedProducts.sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0));
        break;
      case "stockDesc":
        sortedProducts.sort((a, b) => (b.stock ?? 0) - (a.stock ?? 0));
        break;
      default:
        break;
    }
    return sortedProducts;
  };

  const applyFilters = (products: Product[]) => {
    let updatedProducts = [...products];
    const { search, priceRange, stockRange, categories, artisans } = filter;

    // Apply search filter
    if (search) {
      updatedProducts = updatedProducts.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply price range filter
    updatedProducts = updatedProducts.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply stock range filter
    updatedProducts = updatedProducts.filter(
      (product) =>
        product.stock >= stockRange[0] && product.stock <= stockRange[1]
    );

    // Apply category filter
    if (categories.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        categories.includes(product.category._id)
      );
    }

    // Apply artisan filter
    if (artisans.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        artisans.includes(product.artisan._id)
      );
    }

    setFilteredProducts(updatedProducts);
  };

  useEffect(() => {
    applyFilters(products);
  }, [products, filter]);

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortOption(event.target.value as string);
  };

  const handleFilterChange = (filters: any) => {
    setFilter(filters);
  };

  const toggleFavorite = async (productId: string) => {
    try {
      const isFavorite = favoriteProducts.includes(productId);
      if (isFavorite) {
        await deleteWishList(productId, userId!);
        setFavoriteProducts((prevFavorites) =>
          prevFavorites.filter((id) => id !== productId)
        );
      } else {
        await addWishList(userId!, productId);
        setFavoriteProducts((prevFavorites) => [...prevFavorites, productId]);
        const wishlistData = await getWishListById(userId!);
        if (wishlistData) {
          const wishlength = wishlistData.reduce(
            (acc, wishlist) => acc + (wishlist.products?.length || 0),
            0
          );
          dispatch(setWishlist(wishlength));
        }
      }
    } catch (err) {
      console.error("Failed to update favorite products", err);
      setError("Failed to update favorite products");
    }
  };

  const addToCart = async (products: CartProduct[]) => {
    try {
      await addCart(userId!, products);
      setSnackbarMessage("Added to cart!");
      const response: CartList | undefined = await getCartListById(userId!);
      if (response) {
        dispatch(setCartLength(response.products.length));
      }
    } catch (error) {
      setError("Failed to add to cart");
    } finally {
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

  if (loading) {
    return <Typography>Loading...</Typography>;
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
          <Box mb={2} display="flex" justifyContent="space-between">
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

            <Box>
              <IconButton onClick={() => setViewMode("grid")}>
                <FaTh />
              </IconButton>
              <IconButton onClick={() => setViewMode("list")}>
                <FaList />
              </IconButton>
            </Box>
          </Box>

          {viewMode === "grid" ? (
            <Grid container spacing={3}>
              {currentProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={`http://localhost:5000/${product.photos[0]}`}
                      alt={product.name}
                    />
                    <CardContent>
                      <Typography variant="h6">{product.name}</Typography>
                      <Typography variant="body2">
                        {product.description}
                      </Typography>
                      <Typography variant="h6">${product.price}</Typography>
                      {product.stock > 0 ? (
                        <Typography variant="body2"  color={"green"}>In Stock</Typography>
                      ) : (
                        <Typography variant="body2" color={"red"}>Out of Stock</Typography>
                      )}
                    </CardContent>
                    <Divider />
                    <Box display="flex" justifyContent="space-between" p={2}>
                      <IconButton
                        color={
                          favoriteProducts.includes(product._id)
                            ? "secondary"
                            : "default"
                        }
                        onClick={() => toggleFavorite(product._id)}
                      >
                        {favoriteProducts.includes(product._id) ? (
                          <FavoriteIcon />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ShoppingCartIcon />}
                        onClick={() =>
                          addToCart([{ productId: product._id, quantity: 1 }])
                        }
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
                <Box
                  key={product._id}
                  display="flex"
                  alignItems="center"
                  mb={2}
                >
                  <CardMedia
                    component="img"
                    height="100"
                    image={`http://localhost:5000/${product.photos[0]}`}
                    alt={product.name}
                    sx={{ width: 100 }}
                  />
                  <Box ml={2}>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="body2">
                      {product.description}
                    </Typography>
                    <Typography variant="h6">${product.price}</Typography>
                    {product.stock > 0 ? (
                      <Typography variant="body2">In Stock</Typography>
                    ) : (
                      <Typography variant="body2">Out of Stock</Typography>
                    )}
                    <Box mt={1}>
                      <IconButton
                        color={
                          favoriteProducts.includes(product._id)
                            ? "secondary"
                            : "default"
                        }
                        onClick={() => toggleFavorite(product._id)}
                      >
                        {favoriteProducts.includes(product._id) ? (
                          <FavoriteIcon />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ShoppingCartIcon />}
                        onClick={() =>
                          addToCart([{ productId: product._id, quantity: 1 }])
                        }
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            sx={{ mt: 5 , display : "flex" , flexDirection : "rox" , justifyContent : "center" , mb : 5}}
          />
        </Grid>
      </GridContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default ProductList;
