import * as React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { Product } from "../../../apis/interfaces";
import { deleteProduct } from "../../../apis/action";


interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product: Product | null;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({ open, onClose, onConfirm, product }) => {

  // Handle delete operation
  const handleDelete = async () => {
    if (product?._id) {
      try {
        const response = await deleteProduct(product._id);
        console.log("Product deleted successfully:", response);
        onConfirm(); // Trigger the parent component's onConfirm callback
        onClose();   // Close the dialog
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Are you sure you want to delete the product "{product?.name}"?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="warning">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
