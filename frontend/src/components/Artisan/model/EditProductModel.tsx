import * as React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Product, Category } from "../../../apis/interfaces";
import { useState, useEffect } from "react";
import { editProduct, getAllcategories } from "../../../apis/action";


interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product?: Product;
}

export default function EditProductModal({
  open,
  onClose,
  onSave,
  product,
}: ProductModalProps) {
  const [name, setName] = useState<string>(product?.name || "");
  const [description, setDescription] = useState<string>(product?.description || "");
  const [price, setPrice] = useState<number | string>(product?.price || "");
  const [imageUrl, setImageUrl] = useState<string>(product?.photos[0] || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string>(product?.category?._id || "");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [promo, setPromo] = useState<boolean>(product?.promo || false);
  const [discountPercentage, setDiscountPercentage] = useState<number | string>(product?.discountPercentage || "");
  const [size, setSize] = useState<string>(product?.size || "");
  const [stock, setStock] = useState<number | string>(product?.stock || "");

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || "");
      setImageUrl(product.photos[0] || "");
      setCategory(product.category?._id || ""); 
      setPromo(product.promo || false);
      setDiscountPercentage(product.discountPercentage || "");
      setSize(product.size || "");
      setStock(product.stock || "");
    }
  }, [product]);

  useEffect(() => {
    const fetchAllCategories = async () => {
      setLoadingCategories(true);
      try {
        const data: Category[] | undefined = await getAllcategories();
        if (data) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchAllCategories();
  }, []);

  const handleEditProduct = async () => {
    if (!product) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("category", category);
    formData.append("stock", stock.toString());
    formData.append("size", size);
    formData.append("promo", promo.toString());
    formData.append("discountPercentage", discountPercentage.toString());
    if (imageFile) {
      formData.append("photos", imageFile);
    } else if (imageUrl) {
      formData.append("photos", imageUrl);
    }

    try {
      const response = await editProduct(product._id, formData);
      if (response) {
        onSave(response);
        onClose();
      } else {
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error("Unexpected error updating product:", error);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImageUrl(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };
console.log(product?.category.name, "catt");

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="edit-product-modal"
      aria-describedby="edit-product-form"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: "10000px",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          {product ? "Edit Product" : "Add New Product"}
        </Typography>
        <Grid container spacing={2}>
          {/* Image Section */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "80%",
                border: "1px solid #ddd",
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#f5f5f5"
              }}
            >
              {imageUrl ? (
                <img
                  src={imageFile ? imageUrl : `http://localhost:5000/${imageUrl}`}
                  alt={name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No image selected
                </Typography>
              )}
            </Box>
            <Button
              variant="contained"
              component="label"
              sx={{ mt: 2, width: "100%" }}
            >
              Upload New Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>
          </Grid>

          {/* Form Section */}
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Name"
              margin="normal"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              variant="outlined"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
              fullWidth
              label="Price"
              margin="normal"
              variant="outlined"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            {/* Category Selection */}
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value as string)}
                label="Category"
                disabled={loadingCategories}
              >
                {loadingCategories ? (
                  <MenuItem value="">
                    <CircularProgress size={24} />
                  </MenuItem>
                ) : (
                  categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            {/* Promo Toggle */}
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Promo</InputLabel>
              <Select
                value={promo ? "Yes" : "No"}
                onChange={(e) => setPromo(e.target.value === "Yes")}
                label="Promo"
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>

            {/* Discount Percentage */}
            <TextField
              fullWidth
              label="Discount Percentage"
              margin="normal"
              variant="outlined"
              type="number"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
            />

            {/* Size */}
            <TextField
              fullWidth
              label="Size"
              margin="normal"
              variant="outlined"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />

            {/* Stock */}
            <TextField
              fullWidth
              label="Stock"
              margin="normal"
              variant="outlined"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />

            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={onClose} color="inherit" sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button onClick={handleEditProduct} variant="contained">
                Save Changes
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
