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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TableContainer,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteOrder, fetchOrderClientById } from "../../../apis/action";
import { Order } from "../../../apis/interfaces";
import { useAppSelector } from "../../../stores/storeHooks";
import { RootState } from "../../../stores/store";
import Layout from "../../layout/Layout";

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const userId = useAppSelector((state: RootState) => state.user.userInfos.id);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setError("User ID is not available.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetchOrderClientById(userId);
        console.log("Response from fetchOrderById:", response);

        if (Array.isArray(response)) {
          setOrders(response);
        } else {
          setOrders([response]);
        }
      } catch (error) {
        setError("Error fetching orders. Please try again later.");
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  const handleDeleteOrder = async () => {
    if (orderToDelete) {
      try {
        await deleteOrder(orderToDelete);
        setOrders(orders.filter((order) => order._id !== orderToDelete));
        setOrderToDelete(null);
      } catch (error) {
        setError("Error deleting order. Please try again.");
        console.error("Error deleting order:", error);
      } finally {
        setDeleteDialogOpen(false);
      }
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Layout>
      <Card sx={{ marginTop: 9, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Client Orders
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {orders.length > 0 ? (
            <TableContainer className="mobile-overflow" style={{ maxHeight: "100%"}}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "10%" }}><strong>Actions</strong></TableCell>
                    <TableCell sx={{ width: "15%" }}><strong>Order ID</strong></TableCell>
                    <TableCell sx={{ width: "15%" }}><strong>Status</strong></TableCell>
                    <TableCell sx={{ width: "20%" }}><strong>Order Date</strong></TableCell>
                    <TableCell sx={{ width: "15%" }}><strong>Total Amount</strong></TableCell>
                    <TableCell sx={{ width: "25%" }}><strong>Products</strong></TableCell>
                    <TableCell sx={{ width: "25%" }}><strong>Delivery Address</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            setOrderToDelete(order._id);
                            setDeleteDialogOpen(true);
                          }}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
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
                        <Grid container spacing={1} sx={{ overflowX: 'auto' }}>
                          {order.details.map((detail, index) => (
                            <Grid item xs={6} sm={4} md={3} key={index}>
                              <Card
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  padding: 1,
                                  border: '1px solid #e0e0e0',
                                  borderRadius: 2,
                                  height: '250px',
                                  width: '100%',
                                  maxWidth: '150px',
                                  margin: 'auto',
                                }}
                              >
                                <CardMedia
                                  component="img"
                                  image={`${import.meta.env.VITE_API_IMAGE}${detail.produit_id.photos[0]}`}
                                  alt={detail.produit_id.name}
                                  sx={{
                                    width: '100%',
                                    height: '80%',
                                    objectFit: 'cover',
                                    borderRadius: 1,
                                    marginBottom: 0.5,
                                  }}
                                />
                                <Typography variant="body2" align="center">
                                  {`Qty: ${detail.quantité}, Price: $${detail.prix_unitaire.toFixed(2)}`}
                                </Typography>
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
                              <Typography variant="body2">{address.address}</Typography>
                              <Typography variant="body2">{address.country}</Typography>
                              <Typography variant="body2">{address.zipCode}</Typography>
                              <Typography variant="body2">{address.phone}</Typography>
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
            </TableContainer>
          ) : (
            <Typography>No orders found</Typography>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this order?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteOrder} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default OrderList;
