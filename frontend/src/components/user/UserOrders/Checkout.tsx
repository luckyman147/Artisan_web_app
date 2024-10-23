import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Avatar,
  Checkbox,
  FormControlLabel,
  Paper,
} from "@mui/material";
import Layout from "../../layout/Layout";
import CustomBreadcrumbs from "../../layout/Breadcrumbs";
import { useAppSelector } from "../../../stores/storeHooks";
import { RootState } from "../../../stores/store";
import { useEffect, useState } from "react";
import { addOrder, getCartListById, getUserById } from "../../../apis/action";
import {
  CartItem,
  CartList,
  DeliveryAddress,
  OrderDetail,
  UserInfo,
} from "../../../apis/interfaces";
import OrderSuccess from "./OrderSuccess";
import PhoneInput from "react-phone-input-2"; // Import react-phone-input-2
import "react-phone-input-2/lib/style.css";  // Add CSS for react-phone-input-2

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Cart", href: "/cart" },
  { label: "Payment" },
];

const Checkout = () => {
  const userId = useAppSelector((state: RootState) => state.user.userInfos.id);
  const token = useAppSelector(
    (state: RootState) => state.user.userInfos.token
  );

  const [orderList, setOrderList] = useState<CartList | null>(null);
  const [userInfos, setUserInfos] = useState<UserInfo | null>(null);
  const [shippingAddress, setShippingAddress] = useState<DeliveryAddress>({
    firstname: "",
    lastname: "",
    address: "",
    country: "",
    zipCode: "",
    phone : 0
  });
  const [phoneNumber, setPhoneNumber] = useState(""); 

  const [useAccountAddress, setUseAccountAddress] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [addressDisabled, setAddressDisabled] = useState(false);

  useEffect(() => {
    const fetchCartList = async () => {
      try {
        const response = await getCartListById(userId!);
        if (response) setOrderList(response);
      } catch (error) {
        console.error("Error fetching cart list", error);
      }
    };

    const getUser = async () => {
      try {
        const response = await getUserById(userId!);
        if (response) {
          setUserInfos(response);
        }
      } catch (error) {
        console.error("Error", error);
      }
    };

    getUser();
    fetchCartList();
  }, [userId]);

  const handleOrder = async () => {
    if (!orderList) return;

    const orderDetails: OrderDetail[] = orderList.products.map((product: any) => {
      const prix_unitaire = product.productId.promo
        ? product.productId.price - (product.productId.price * product.productId.discountPercentage) / 100
        : product.productId.price;

      return {
        produit_id: product.productId._id,
        quantité: product.quantity,
        prix_unitaire: prix_unitaire ?? 0,  
        accepte: "en cours"
      };
    });

    const deliveryAddresses: DeliveryAddress[] = [
      {
        firstname: shippingAddress.firstname,
        lastname: shippingAddress.lastname,
        address: shippingAddress.address,
        country: shippingAddress.country,
        zipCode: shippingAddress.zipCode,
        phone: Number(phoneNumber), 
      },
    ];

    try {
      if (useAccountAddress) {
        const responseUser = await addOrder(userId!, orderDetails);
        if (responseUser) {
          setOrderSuccess(true);
        }
      } else {
        const response = await addOrder(userId!, orderDetails, deliveryAddresses);
        if (response) {
          console.log("Order added successfully:", response);
          setOrderSuccess(true);
        }
      }
    } catch (error) {
      console.error("Error adding order", error);
    }
  };

  if (orderSuccess && orderList) {
    return (
      <Layout>
        <OrderSuccess
          orderList={orderList}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <CustomBreadcrumbs items={breadcrumbItems} />

      <Grid container spacing={4} justifyContent="center">
        {/* Left Side - Shipping Info */}
        <Grid item xs={12} md={8}>
          <Box>
            {/* Contact Information */}
            <Box my={3} marginLeft={5}>
              <Typography variant="h6">Contact information</Typography>
              <Box display="flex" alignItems="center" my={2}>
                <Avatar src="/path/to/avatar" alt="user-avatar" />
                <Box ml={2}>
                  <Typography>{userInfos?.email}</Typography>
                  <Typography
                    variant="body2"
                    color="primary"
                    style={{ cursor: "pointer" }}
                  >
                    Log out
                  </Typography>
                </Box>
              </Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useAccountAddress}
                    onChange={(e) => setUseAccountAddress(e.target.checked)}
                  />
                }
                label="Use My Account Address"
              />
            </Box>

            {/* Shipping Address Form */}
            {!useAccountAddress && (
              <Box marginLeft={5}>
                <Typography variant="h6">Shipping address</Typography>
                <Grid container spacing={2} my={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="First name"
                      value={shippingAddress.firstname}
                      onChange={(e) =>
                        setShippingAddress((prev) => ({
                          ...prev,
                          firstname: e.target.value,
                        }))
                      }
                      disabled={addressDisabled}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Last name"
                      value={shippingAddress.lastname}
                      onChange={(e) =>
                        setShippingAddress((prev) => ({
                          ...prev,
                          lastname: e.target.value,
                        }))
                      }
                      disabled={addressDisabled}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      value={shippingAddress.address}
                      onChange={(e) =>
                        setShippingAddress((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      disabled={addressDisabled}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Country/Region"
                      value={shippingAddress.country}
                      onChange={(e) =>
                        setShippingAddress((prev) => ({
                          ...prev,
                          country: e.target.value,
                        }))
                      }
                      disabled={addressDisabled}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Postal code"
                      value={shippingAddress.zipCode}
                      onChange={(e) =>
                        setShippingAddress((prev) => ({
                          ...prev,
                          zipCode: e.target.value,
                        }))
                      }
                      disabled={addressDisabled}
                    />
                  </Grid>
                  {/* Phone input field */}
                  <Grid item xs={12}>
                    <PhoneInput
                      country={"tn"}
                      value={phoneNumber}
                      onChange={(value) => setPhoneNumber(value)}
                      inputStyle={{
                        width: "100%",
                        height: "56px",
                        fontSize: "16px",
                        borderRadius: "4px",
                        borderColor: "#ced4da",
                        paddingLeft: "48px",
                      }}
                      buttonStyle={{ borderRadius: "4px 0 0 4px" }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Buttons */}
            <Box mt={4} display="flex" justifyContent="space-between">
              <Button variant="text" color="primary">
                Return to cart
              </Button>
              <Button variant="contained" color="primary" onClick={handleOrder}>
                Continue to shipping
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Right Side - Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: "16px" }}>
            <Typography variant="h6">Order Summary</Typography>
            {/* Product List */}
            <Box mt={2}>
              {orderList?.products.map((product) => {
                // Calculate price with discount if the product is on promo
                const discountedPrice = product.productId.promo
                  ? product.productId.price -
                    (product.productId.price *
                      product.productId.discountPercentage) / 100
                  : product.productId.price;

                return (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    key={product.productId._id}
                  >
                    <Typography>{product.productId.name}</Typography>
                    <Typography>
                      {(discountedPrice * product.quantity).toFixed(2)} TND
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            {/* Total Price */}
            <Box mt={2} display="flex" justifyContent="space-between">
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">
                {orderList?.totalPrice.toFixed(2)}TND
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Checkout;
