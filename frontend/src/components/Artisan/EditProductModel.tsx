import * as React from "react";
import { Box, Button, TextField, Typography, Modal, Grid } from "@mui/material";
import { Product } from "../../apis/interfaces";
import { useState, useEffect } from "react";
import { editProduct } from "../../apis/action";
import { RootState } from "../../stores/store";
import { useAppSelector } from "../../stores/storeHooks";

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
  const [description, setDescription] = useState<string>(
    product?.description || ""
  );
  const [price, setPrice] = useState<number | string>(product?.price || "");
  const [imageUrl, setImageUrl] = useState<string>(product?.photos[0] || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const token = useAppSelector((state: RootState) => state.user.userInfos.token);

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || "");
      setImageUrl(product.photos[0] || "");
    }
  }, [product]);

  const handleEditProduct = async () => {
    if (!product) return;

    // Create a FormData object
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());

    if (imageFile) {
      console.log(imageFile,"testttimage");
      
      formData.append("photos", imageFile); 
    } else if (imageUrl) {
      formData.append("photos", imageUrl);
    }

    try {
      const response = await editProduct(product._id, formData, token);

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
          maxWidth: "800px",
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
                height: "200px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#f5f5f5",
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

            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button variant="contained" onClick={handleEditProduct}>
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
