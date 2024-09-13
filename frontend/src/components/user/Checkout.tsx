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
  import Layout from "../layout/Layout";
  import CustomBreadcrumbs from "../layout/Breadcrumbs";
  import { useAppSelector } from "../../stores/storeHooks";
  import { RootState } from "../../stores/store";
  import { useEffect, useState } from "react";
  import { addOrder, getCartListById, getUserById } from "../../apis/action";
  import {
    CartList,
    DeliveryAddress,
    OrderDetail,
    UserInfo,
  } from "../../apis/interfaces";
  
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Cart", href: "/cart" },
    { label: "Payment" },
  ];
  
  const Checkout = () => {
    const userId = useAppSelector((state: RootState) => state.user.userInfos.id);
    const token = useAppSelector((state: RootState) => state.user.userInfos.token);
  
    const [orderList, setOrderList] = useState<CartList | null>(null);
    const [userInfos, setUserInfos] = useState<UserInfo | null>(null);
    const [shippingAddress, setShippingAddress] = useState<DeliveryAddress>({
      firstname: "",
      lastname: "",
      address: "",
      country: "",
      zipCode: "", 
    });
    const [newsletterOptIn, setNewsletterOptIn] = useState(false);
    const [addressDisabled, setAddressDisabled] = useState(false); 
    const [useAccountAddress, setUseAccountAddress] = useState(false);
  
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
            const response = await getUserById(userId!, token);
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
  
      const orderDetails: OrderDetail[] = orderList.products.map((product) => ({
        produit_id: product.productId._id,
        quantité: product.quantity,
        prix_unitaire: product.productId.price ?? 0,
      }));
  
      const deliveryAddresses: DeliveryAddress[] = [
        {
          firstname: shippingAddress.firstname,
          lastname: shippingAddress.lastname,
          address: shippingAddress.address,
          country: shippingAddress.country,
          zipCode: shippingAddress.zipCode,
        },
      ];
  
      try {
        if(useAccountAddress){
            return await addOrder(userId!, orderDetails);
        }
        const response = await addOrder(userId!, orderDetails, deliveryAddresses);
        if (response) {
          console.log("Order added successfully:", response);
          // Handle successful order here (e.g., redirect to confirmation page)
        }
      } catch (error) {
        console.error("Error adding order", error);
      }
    };
  
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
              { !useAccountAddress && (
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
                {orderList?.products.map((product) => (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={2}
                    key={product._id}
                  >
                    <Box display="flex" alignItems="center">
                      <Avatar
                        src={`http://localhost:5000/${product.productId.photos[0]}`}
                        alt={product.productId.name}
                      />
                      <Box ml={2}>
                        <Typography variant="body1">
                          {product.productId.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {product.productId.size}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography>${product.productId.price}</Typography>
                  </Box>
                ))}
              </Box>
  
              {/* Summary */}
              <Box mt={3} display="flex" justifyContent="space-between">
                <Typography>Subtotal</Typography>
                <Typography>${orderList?.totalPrice}</Typography>
              </Box>
              <Box mt={1} display="flex" justifyContent="space-between">
                <Typography>Shipping</Typography>
                <Typography>Calculated at next step</Typography>
              </Box>
              <Box
                mt={3}
                display="flex"
                justifyContent="space-between"
                fontWeight="bold"
              >
                <Typography>Total</Typography>
                <Typography variant="h6">USD ${orderList?.totalPrice}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Layout>
    );
  };
  
  export default Checkout;
  