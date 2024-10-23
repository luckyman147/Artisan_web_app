import { useEffect, useState, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { fetchAllOrder, fetchProduct } from "../../../apis/action";
import { Order, Product } from "../../../apis/interfaces";
import { Box, Paper, Typography } from "@mui/material";

Chart.register(...registerables);

const Charts = () => {
  const [orderData, setOrderData] = useState<Order[]>([]);
  const [productData, setProductData] = useState<Product[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [revenueData, setRevenueData] = useState<number[]>([]);

  const ordersChartRef = useRef<Chart | null>(null);
  const productsChartRef = useRef<Chart | null>(null);
  const revenueChartRef = useRef<Chart | null>(null);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await fetchAllOrder();
      if (orders) setOrderData(orders);
    };

    const fetchProducts = async () => {
      const products = await fetchProduct();
      if (products) setProductData(products);
    };

    fetchOrders();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (orderData.length > 0) {
      renderOrderChart();
      renderRevenueChart();
    }
    if (productData.length > 0) {
      renderProductChart();
    }

    return () => {
      if (ordersChartRef.current) ordersChartRef.current.destroy();
      if (productsChartRef.current) productsChartRef.current.destroy();
      if (revenueChartRef.current) revenueChartRef.current.destroy();
    };
  }, [orderData, productData]);

  useEffect(() => {
    if (selectedMonth && productData.length > 0) {
      const filtered = productData.filter((product) => {
        const createdAt = new Date(product.createdAt);
        const monthName = monthNames[createdAt.getMonth()];
        return monthName === selectedMonth;
      });
      setFilteredProducts(filtered);
    }
  }, [selectedMonth, productData]);

  const calculateRevenue = (orderData: Order[]): number[] => {
    const revenueByMonth = Array(12).fill(0); // Initialize an array for each month
  
    orderData.forEach((order) => {
      // Check if the order is delivered
      if (order.statut === "livrée") {
        const orderDate = new Date(order.createdAt);
        const monthIndex = orderDate.getMonth(); // Get month index (0-11)
  
        order.details.forEach((detail) => {
          // Check if the order detail is accepted
          if (detail.accepte === "accepte") {
            const productId = detail.produit_id;
  
            // Ensure productId exists and has a price
            if (productId && productId.price) {
              let revenue = 0;
  
              // Calculate revenue based on promotion status
              if (productId.promo) {
                // Calculate the discounted price
                const discountedPrice =
                  productId.price - (productId.price * productId.discountPercentage) / 100;
                revenue = discountedPrice * 0.02; // Calculate 2% of the discounted price
              } else {
                revenue = productId.price * 0.02; // Calculate 2% of the regular price
              }
  
              revenueByMonth[monthIndex] += revenue;
            }
          }
        });
      }
    });
  
    return revenueByMonth;
  };
  
  
  

  const processOrdersByMonth = (orders: Order[]) => {
    const ordersByMonth: { [key: string]: number } = {};

    orders.forEach((order) => {
      if (order.createdAt) {
        const createdAt = new Date(order.createdAt);
        const monthName = monthNames[createdAt.getMonth()];
        ordersByMonth[monthName] = (ordersByMonth[monthName] || 0) + 1;
      }
    });

    return ordersByMonth;
  };

  const renderOrderChart = () => {
    const ctx = document.getElementById("ordersChart") as HTMLCanvasElement;
    if (!ctx) return;

    const ordersByMonth = processOrdersByMonth(orderData);

    if (ordersChartRef.current) ordersChartRef.current.destroy();

    ordersChartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: monthNames,
        datasets: [
          {
            label: "Orders This Month",
            data: monthNames.map((month) => ordersByMonth[month] || 0),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: "rgba(75, 192, 192, 1)",
            pointBorderColor: "rgba(75, 192, 192, 1)",
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: true },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => (Number.isInteger(value) ? value : ""),
            },
          },
        },
        onClick: (_, elements) => {
          const element = elements[0];
          if (element) {
            const clickedMonth = monthNames[element.index];
            setSelectedMonth(clickedMonth);
          }
        },
      },
    });
  };

  const processProductsByMonth = (products: Product[]) => {
    const result: Record<string, number> = {};
    products.forEach((product) => {
      const createdAt = product.createdAt;
      if (createdAt) {
        const parsedDate = new Date(createdAt);
        const monthName = monthNames[parsedDate.getMonth()];
        result[monthName] = (result[monthName] || 0) + 1;
      }
    });

    return result;
  };

  const renderProductChart = () => {
    const ctx = document.getElementById("productsChart") as HTMLCanvasElement;
    if (!ctx) return;

    const productsByMonth = processProductsByMonth(productData);

    if (productsChartRef.current) productsChartRef.current.destroy();

    productsChartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: monthNames,
        datasets: [
          {
            label: "Products by Month",
            data: monthNames.map((month) => productsByMonth[month] || 0),
            backgroundColor: "rgba(153, 102, 255, 0.8)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
            barPercentage: 1.5,
            categoryPercentage: 0.6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: true },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => (Number.isInteger(value) ? value : ""),
            },
          },
        },
      },
    });
  };

  const renderRevenueChart = () => {
    const ctx = document.getElementById("revenueChart") as HTMLCanvasElement;
    if (!ctx) return;

    const revenue = calculateRevenue(orderData);
    setRevenueData(revenue);

    if (revenueChartRef.current) revenueChartRef.current.destroy();

    revenueChartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: monthNames,
        datasets: [
          {
            label: "Revenue (Admin's 2% Cut)",
            data: revenue,
            backgroundColor: "rgba(255, 99, 132, 0.8)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            barPercentage: 1.5,
            categoryPercentage: 0.6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: true },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => (Number.isInteger(value) ? value : ""),
            },
          },
        },
      },
    });
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Sales Overview
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        <Paper elevation={3} sx={{ width: "30%", padding: 2, margin: 1 }}>
          <Typography variant="h6">Monthly Orders</Typography>
          <canvas
            id="ordersChart"
            style={{
              height: "400px",
              width: "100%",
              maxWidth: "100%",
              maxHeight: "400px",
            }}
          />
        </Paper>
        <Paper elevation={3} sx={{ width: "30%", padding: 2, margin: 1 }}>
          <Typography variant="h6">Monthly Products </Typography>
          <canvas
            id="productsChart"
            style={{
              height: "400px",
              width: "100%",
              maxWidth: "100%",
              maxHeight: "400px",
            }}
          />
        </Paper>
        <Paper elevation={3} sx={{ width: "30%", padding: 2, margin: 1 }}>
          <Typography variant="h6">Monthly Revenue</Typography>
          <canvas
            id="revenueChart"
            style={{
              height: "400px",
              width: "100%",
              maxWidth: "100%",
              maxHeight: "400px",
            }}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default Charts;
