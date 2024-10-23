import React, { useEffect, useState, useMemo } from "react";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import {
  Box,
  Button,
  Avatar,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import Layout from "../components/Layout"; // Assuming you have a Layout component
import { deleteProduct, fetchProduct } from "../../../apis/action"; // Fetch product API
import { Product } from "../../../apis/interfaces"; // Assuming Product interface is defined in your interfaces file

const ProductsTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 5,
    page: 0,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Loading state

  // Column definitions for the DataGrid
  const columns: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 70 },
      {
        field: "avatar",
        headerName: "Image",
        width: 150,
        sortable: false,
        renderCell: (params: GridRenderCellParams<any, any>) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Avatar
              alt={params.row.name}
              src={params.row.avatar}
              sx={{ width: 50, height: 50 }}
            />
          </Box>
        ),
      },
      { field: "name", headerName: "Product Name", width: 200, sortable: true },
      { field: "price", headerName: "Price", width: 100 },
      { field: "stock", headerName: "Stock", width: 100 },
      { field: "category", headerName: "Category", width: 150 },
      {
        field: "promo",
        headerName: "Promo",
        width: 100,
        sortable: true,
        renderCell: (params: GridRenderCellParams<any, any>) => (
          <Typography
            variant="body2"
            sx={{ color: params.row.promo ? "green" : "red", pt: 1 }}
          >
            {params.row.promo ? "Yes" : "No"}
          </Typography>
        ),
      },
      { field: "discountPercentage", headerName: "Discount (%)", width: 150 },
      {
        field: "actions",
        headerName: "Actions",
        width: 150,
        renderCell: (params: GridRenderCellParams<any, any>) => (
          <Button
            variant="contained"
            sx={{ backgroundColor: "red" }}
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        ),
      },
    ],
    [] // Only defined once
  );

  // Function to handle row delete
  const handleDelete = (id: string) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteProduct(deleteId);
        // Refresh the product list or update state after deletion
        setProducts((prev) =>
          prev.filter((product) => product._id !== deleteId)
        );
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
    setOpenDialog(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setOpenDialog(false);
    setDeleteId(null);
  };

  // Fetch products data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchProduct();
        if (response) {
          setProducts(response);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, []);


  const rows = useMemo(() => {
    return products.map((product) => ({
      id: product._id,
      avatar: `${import.meta.env.VITE_API_IMAGE}${product.photos[0]}`,
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category.name,
      promo: product.promo,
      discountPercentage: product.discountPercentage,
    }));
  }, [products]);

  return (
    <Layout>
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          marginBottom: 3,
          fontWeight: "bold",
          color: "primary.main",
        }}
      >
        Products Table
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexGrow: 1,
          padding: 2,
        }}
      >
        <Box
          sx={{
            height: 600,
            width: "90%",
            maxWidth: "90%",
            padding: 3,
          }}
        >
          {loading ? ( // Show loading spinner while fetching data
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 25]}
              pagination
              disableRowSelectionOnClick
            />
          )}
        </Box>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this product?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} sx={{ color: "red" }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default ProductsTable;
