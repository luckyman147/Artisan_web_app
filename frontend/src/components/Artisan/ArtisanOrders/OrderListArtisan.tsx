import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  CircularProgress,
  Chip,
  Alert,
  CardMedia,
  Grid,
  Button, 
} from "@mui/material";
import { fetchOrderById, editArtisanOrder } from "../../../apis/action"; 
import { Order } from "../../../apis/interfaces";
import { useAppSelector } from "../../../stores/storeHooks";
import { RootState } from "../../../stores/store";
import Layout from "../../layout/Layout";

const OrderListArtisan: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const userId = useAppSelector((state: RootState) => state.user.userInfos.id);

  const handleUpdateAccepte = async (
    orderId: string,
    productIndex: number,
    accepte: "accepte" | "annulée"
  ) => {
    const updatedOrder = orders.find((order) => order._id === orderId);
    if (!updatedOrder) return;

    // Clone the details and update the specific product
    const updatedDetails = [...updatedOrder.details];
    updatedDetails[productIndex] = {
      ...updatedDetails[productIndex],
      accepte,
    };

    try {
      const updatedOrders = await editArtisanOrder(orderId, updatedOrder.statut, updatedDetails);
      if (updatedOrders) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, details: updatedDetails } : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating accepte status:", error);
      setError("Failed to update product status.");
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setError("User ID is not available.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetchOrderById(userId);
        setOrders(response);
      } catch (error) {
        setError("Error fetching orders. Please try again later.");
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId,orders]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Layout>
      <Card sx={{ marginTop: 10, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Artisan Orders
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {orders.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Order ID</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Order Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Total Amount</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Products</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Delivery Address</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.statut}
                        color={
                          order.statut === "livrée"
                            ? "success"
                            : order.statut === "expédiée"
                            ? "primary"
                            : order.statut === "annulée"
                            ? "error"
                            : "warning"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(order.date_commande).toLocaleDateString()}
                    </TableCell>
                    <TableCell>${order.montant_total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Grid container spacing={1}>
                        {order.details.map((detail, index) => (
                          <Grid item xs={6} sm={4} md={3} key={index}>
                            <Card
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                padding: 1,
                              }}
                            >
                              {detail.produit_id.photos &&
                              detail.produit_id.photos.length > 0 ? (
                                <CardMedia
                                  component="img"
                                  image={`http://localhost:5000/${detail.produit_id.photos[0]}`}
                                  alt={detail.produit_id.name}
                                  sx={{
                                    width: "100%",
                                    height: "auto",
                                    maxHeight: 80,
                                    borderRadius: 1,
                                    marginBottom: 0.5,
                                  }}
                                />
                              ) : (
                                <Typography>No Image Available</Typography>
                              )}
                              <Typography variant="body2" align="center">
                                {`Qty: ${detail.quantité}, Price: $${detail.prix_unitaire.toFixed(2)}`}
                              </Typography>
                              <TableCell>
                                <Chip
                                  label={detail.accepte}
                                  color={
                                    detail.accepte === "accepte"
                                      ? "success"
                                      : detail.accepte === "annulée"
                                      ? "error"
                                      : "warning"
                                  }
                                />
                                {/* Accept and Cancel buttons */}
                                <Button
                                  variant="contained"
                                  size="small"
                                  sx={{ mt: 1, mr: 1 }}
                                  onClick={() =>
                                    handleUpdateAccepte(
                                      order._id,
                                      index,
                                      "accepte"
                                    )
                                  }
                                  disabled={detail.accepte === "accepte"}
                                >
                                  Accepter
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  color="error"
                                  sx={{ mt: 1 }}
                                  onClick={() =>
                                    handleUpdateAccepte(
                                      order._id,
                                      index,
                                      "annulée"
                                    )
                                  }
                                  disabled={detail.accepte === "annulée"}
                                >
                                  Annuler
                                </Button>
                              </TableCell>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </TableCell>
                    <TableCell>
                      {order.delivery_address.length > 0 ? (
                        order.delivery_address.map((address, index) => (
                          <div key={index}>
                            <Typography variant="body2">{`${address.firstname} ${address.lastname}`}</Typography>
                            <Typography variant="body2">
                              {address.address}
                            </Typography>
                            <Typography variant="body2">
                              {address.country}
                            </Typography>
                            <Typography variant="body2">
                              {address.zipCode}
                            </Typography>
                          </div>
                        ))
                      ) : (
                        <Typography>No address provided</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography>No orders found</Typography>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default OrderListArtisan;
