import { Box, Typography, Avatar, Button } from "@mui/material";
import { CartList } from "../../../apis/interfaces";
import { useNavigate } from "react-router-dom";

interface OrderSuccessProps {
  orderList: CartList;
}

const OrderSuccess = ({ orderList }: OrderSuccessProps) => {
  const navigate = useNavigate();

  // Function to calculate the total price with discount if promo is available
  const calculatePrice = (price: number, discount: number, promo: boolean) => {
    if (promo && discount > 0) {
      return (price - (price * discount) / 100).toFixed(2);
    }
    return price.toFixed(2);
  };

  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h4" color="primary">
        Order Successfully Placed!
      </Typography>
      <Typography variant="body1" color="textSecondary" mt={2}>
        Thank you for your purchase. Here are the details of your order:
      </Typography>

      <Box mt={4}>
        {orderList?.products.map((product) => (
          <Box
            key={product._id}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
            p={2} 
            border={1} 
            borderRadius={2} 
            borderColor="grey.300" 
          >
            <Avatar
              src={`${import.meta.env.VITE_API_IMAGE}${product.productId.photos[0]}`}
              alt={product.productId.name}
              sx={{ width: 56, height: 56 }}
            />
            <Box ml={2} flex="1">
              <Typography variant="body1">{product.productId.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {product.productId.size}
              </Typography>
            </Box>
            <Typography variant="body1" fontWeight="bold">
              {calculatePrice(
                product.productId.price,
                product.productId.discountPercentage,
                product.productId.promo,
              )}
              TND
            </Typography>
          </Box>
        ))}
      </Box>

      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/products")}
        >
          Continue to shipping
        </Button>
      </Box>
    </Box>
  );
};

export default OrderSuccess;
