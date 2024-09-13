import React, { useState, useEffect } from "react";
import { TableCell, TableRow, Button, TextField } from "@mui/material";
import { CartItem } from "../apis/interfaces";

interface CartItemProps {
  item: CartItem;
  onRemove: (productId: string) => void;
  onQuantityChange: (productId: string, newQuantity: number) => void;
}

const CartItemComponent: React.FC<CartItemProps> = ({
  item,
  onRemove,
  onQuantityChange,
}) => {
  const { productId, quantity, _id } = item;
  const [currentQuantity, setCurrentQuantity] = useState<number>(quantity);

  useEffect(() => {
    setCurrentQuantity(quantity);
  }, [quantity]);

  const handleRemove = () => {
    onRemove(_id);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setCurrentQuantity(newQuantity);
      onQuantityChange(productId._id, newQuantity);
    }
  };

  const incrementQuantity = () => {
    const newQuantity = currentQuantity + 1;
    setCurrentQuantity(newQuantity);
    onQuantityChange(productId._id, newQuantity);
  };

  const decrementQuantity = () => {
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1;
      setCurrentQuantity(newQuantity);
      onQuantityChange(productId._id, newQuantity);
    }
  };

  // Ensure price and quantity are valid numbers
  const price = productId?.price ?? 0;
  const photoUrl = productId
    ? `http://localhost:5000/${productId.photos[0]}`
    : "default-image-url";

  return (
    <TableRow>
      <TableCell>
        <img
          src={photoUrl}
          alt={productId?.name || "Product Image"}
          style={{ width: "100px", height: "auto" }}
        />
      </TableCell>
      <TableCell>{productId?.name || "Unknown Product"}</TableCell>
      <TableCell>${price.toFixed(2)}</TableCell>
      <TableCell>
        <Button
          variant="outlined"
          style={{ width: "50px", margin: "0 8px" }}
          onClick={decrementQuantity}
          disabled={currentQuantity <= 1}
        >
          -
        </Button>
        <TextField
          type="number"
          inputProps={{ min: 1, step: 1 }}
          value={currentQuantity}
          onChange={handleQuantityChange}
          variant="outlined"
          size="small"
          style={{ width: "50px", margin: "0 8px" }}
        />
        <Button
          variant="outlined"
          style={{ width: "50px", margin: "0 8px" }}
          onClick={incrementQuantity}
        >
          +
        </Button>
      </TableCell>
      <TableCell>${(currentQuantity * price).toFixed(2)}</TableCell>
      <TableCell>
        <Button variant="contained" color="error" onClick={handleRemove}>
          Remove
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default CartItemComponent;
