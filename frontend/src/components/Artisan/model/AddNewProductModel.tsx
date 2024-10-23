import * as React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { Category, Product } from "../../../apis/interfaces";
import { addProduct, getAllcategories } from "../../../apis/action"; // Adjust path if necessary
import { useState, useEffect } from "react";
import { useAppSelector } from "../../../stores/storeHooks";
import { RootState } from "../../../stores/store";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product?: Product;
}

export default function AddNewProductModal({
  open,
  onClose,
  onSave,
  product,
}: ProductModalProps) {
  const [name, setName] = useState<string>(product?.name || "");
  const [description, setDescription] = useState<string>(
    product?.description || ""
  );
  const [price, setPrice] = useState<string>(
    product?.price ? product.price.toString() : ""
  );
  const [stock, setStock] = useState<number>(product?.stock || 0);
  const [category, setCategory] = useState<string>(
    product?.category?._id || ""
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [size, setSize] = useState<string>(product?.size || "");
  const [promo, setPromo] = useState<boolean>(product?.promo || false);
  const [discountPercentage, setDiscountPercentage] = useState<number>(
    product?.discountPercentage || 0
  );
  const [imageUrl, setImageUrl] = useState<string>(product?.photos[0] || "");
  const [imageFile, setImageFile] = useState<File | null>(null);



  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response: Category[] | undefined = await getAllcategories();
        if (response) {
          setCategories(response);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open]);

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

  const handleAddProduct = async () => {
    if (name && description && price && imageFile && stock && category) {
      try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("stock", stock.toString());
        formData.append("category", category);
        formData.append("size", size);
        formData.append("promo", promo.toString());
        formData.append("discountPercentage", discountPercentage.toString());
        formData.append("photos", imageFile);

        const productData = await addProduct(formData);
        onSave(productData);
        onClose();
      } catch (error) {
        console.error("Failed to add product:", error);
      }
    } else {
      console.log("Please fill all required fields.");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-edit-product-modal"
      aria-describedby="add-edit-product-form"
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
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "80%", 
                border: "1px solid #ddd",
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#f5f5f5",
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No Image
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
          <Grid item xs={12} md={6}>
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
            <TextField
              fullWidth
              label="Stock"
              margin="normal"
              variant="outlined"
              type="number"
              value={stock}
              onChange={(e) => setStock(parseInt(e.target.value))}
            />

            {/* Category Dropdown */}
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

            <TextField
              fullWidth
              label="Size"
              margin="normal"
              variant="outlined"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
            <TextField
              fullWidth
              label="Discount Percentage"
              margin="normal"
              variant="outlined"
              type="number"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(parseInt(e.target.value))}
              inputProps={{ min: 0, max: 100 }}
            />
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Promo</InputLabel>
              <Select
                value={promo.toString()}
                onChange={(e) => setPromo(e.target.value === "true")}
                label="Promo"
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button variant="contained" onClick={handleAddProduct}>
                Save
              </Button>
              <Button variant="outlined" onClick={onClose} sx={{ ml: 2 }}>
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
