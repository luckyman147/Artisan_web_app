// CartItemComponent.tsx

import React, { useEffect, useState } from "react";
import {
  TableCell,
  TableRow,
  IconButton,
  TextField,
  CircularProgress,
} from "@mui/material";
import { RemoveCircleOutline as RemoveIcon } from "@mui/icons-material";
import { fetchProductById } from "../apis/action";

interface CartItemProps {
  item: {
    productId: string;
    quantity: number;
  };
  onRemove: (productId: string,price : number) => void;
  onQuantityChange: (productId: string, newQuantity: number) => void;
}

const CartItemComponent: React.FC<CartItemProps> = ({ item, onRemove, onQuantityChange }) => {
  const [product, setProduct] = useState<{
    name: string;
    price: number;
    photos: string[];
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedProduct = await fetchProductById(item.productId);
        if(fetchedProduct)
        setProduct(fetchedProduct);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [item.productId]);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity)) {
      onQuantityChange(item.productId, newQuantity);
    }
  };

  if (loading) {
    return (
      <TableRow>
        <TableCell colSpan={6} style={{ textAlign: "center" }}>
          <CircularProgress />
        </TableCell>
      </TableRow>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <TableRow>
      <TableCell>
        <img src={product.photos[0]} alt={product.name} style={{ width: 50, height: 50 }} />
      </TableCell>
      <TableCell>{product.name}</TableCell>
      <TableCell>${product.price.toFixed(2)}</TableCell>
      <TableCell>
        <TextField
          type="number"
          value={item.quantity}
          onChange={handleQuantityChange}
          inputProps={{ min: 1 }}
        />
      </TableCell>
      <TableCell>${(product.price * item.quantity).toFixed(2)}</TableCell>
      <TableCell>
        <IconButton onClick={() => onRemove(item.productId,product.price)} color="error">
          <RemoveIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default CartItemComponent;
