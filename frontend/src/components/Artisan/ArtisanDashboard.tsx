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
import { Delete, Edit } from "@mui/icons-material";
import Layout from "../layout/Layout";
import { fetchProductByArtisanId } from "../../apis/action";
import { Product } from "../../apis/interfaces";
import AddNewProductModel from "./AddNewProductModel";
import EditProductModel from "./EditProductModel";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { RootState } from "../../stores/store";
import { useAppSelector } from "../../stores/storeHooks";
import CustomBreadcrumbs from "../layout/Breadcrumbs";
const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Dashboard" }];

export default function ArtisanDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(6); // Number of items per page
  const id = useAppSelector((state: RootState) => state.user.userInfos.id);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await fetchProductByArtisanId(id!);
      setProducts(products);
      setLoading(false);
    };

    fetchProducts();
  }, [id]);

  const handleOpenModal = (product?: Product) => {
    setSelectedProduct(product || null);
    setIsEditingProduct(!!product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = (product: Product) => {
    if (isEditingProduct) {
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
      setProducts(
        products.filter((product) => product._id !== productToDelete._id)
      );
    }
    handleCloseDeleteDialog();
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <Layout>
      <CustomBreadcrumbs items={breadcrumbItems} />

      <Container maxWidth="lg" sx={{ mt: 12 }}>
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

        <Grid container spacing={3}>
          {currentProducts.map((product) => (
            <Grid item xs={12} md={4} key={product._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:5000/${product.photos[0]}`}
                  alt={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: {product.price}
                  </Typography>
                  <Box
                    sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
                  >
                    <IconButton onClick={() => handleOpenModal(product)} sx={{color : "#E7BC48"}}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDeleteDialog(product)} sx={{color : "red"}}>
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

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

        {isEditingProduct ? (
          <EditProductModel
            open={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveProduct}
            product={selectedProduct || undefined}
          />
        ) : (
          <AddNewProductModel
            open={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveProduct}
            product={undefined}
          />
        )}
      </Container>
    </Layout>
  );
}
