import { useEffect, useState } from "react";
import Slider from "react-slick";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { fetchProduct } from "../apis/action"; // Assume this is an API call function
import { Product } from "../apis/interfaces";
import { Link } from "react-router-dom";

export default function ProductCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1920,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchAndUpdateProducts = async () => {
      try {
        const fetchedProducts = await fetchProduct();

        // Filter products where promote is true and has a valid discount
        const promotedProducts = fetchedProducts.filter(
          (product) => product.promo === true && product.discountPercentage
        );

        // Limit to a maximum of 6 products
        setProducts(promotedProducts.slice(0, 6));
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchAndUpdateProducts();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  return (
    <Box sx={{ margin: "0 auto", padding: "22px 0" , mx : 8}}>
      <Typography variant="h5" gutterBottom textAlign="center">
        Promotions
      </Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Slider {...settings}>
          {products.map((product) => (
            <Paper
              key={product._id}
              sx={{
                padding: "16px",
                margin: "10px",
                width: "250px",
                height: "600px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                "&:hover": {
                  boxShadow: "0px 8px 12px rgba(0, 0, 0, 0.2)",
                  "& .icon-buttons": {
                    opacity: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: 1,
                  },
                },
              }}
            >
              <Box position="relative" sx={{ textAlign: "center" }}>
                {product.discountPercentage && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "10px",
                      left: "11px",
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                    }}
                  >
                    {product.discountPercentage}%
                  </Box>
                )}
                   <Link
                      to={`/product/${product._id}`}
                      style={{ textDecoration: "none" }}
                    >
                <img
                  src={`${import.meta.env.VITE_API_IMAGE}${product.photos[0]}`}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "500px",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
                <Box
                  className="icon-buttons"
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <IconButton size="medium">
                    <FavoriteBorderIcon
                      sx={{
                        color: "#ff4081",
                      }}
                    />
                  </IconButton>
                  <IconButton size="medium">
                    <ShoppingCartIcon
                      sx={{
                        color: "#3f51b5",
                      }}
                    />
                  </IconButton>
                </Box>
                </Link>
              </Box>
              <Typography variant="subtitle1" gutterBottom textAlign="center">
                {product.name}
              </Typography>
              <Box textAlign="center">
                <Typography
                  variant="body2"
                  sx={{
                    textDecoration: product.price ? "line-through" : "none",
                    color: "red",
                  }}
                >
                  {product.price} TND
                </Typography>
                {product.price && (
                  <Typography variant="body2" color="textSecondary">
                    {(
                      product.price -
                      (product.price * product.discountPercentage) / 100
                    ).toFixed(2)}{" "}
                    TND
                  </Typography>
                )}
              </Box>
            </Paper>
          ))}
        </Slider>
      )}
    </Box>
  );
}

function SampleNextArrow(props: any) {
  const { style, onClick } = props;
  return (
    <IconButton
      style={{
        ...style,
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        right: -50,
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "grey",
        color: "white",
        zIndex: 1,
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        padding: 0,
      }}
      onClick={onClick}
    >
      &gt;
    </IconButton>
  );
}

function SamplePrevArrow(props: any) {
  const { style, onClick } = props;
  return (
    <IconButton
      style={{
        ...style,
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        left: -50,
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "grey",
        color: "white",
        zIndex: 1,
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        padding: 0,
      }}
      onClick={onClick}
    >
      &lt;
    </IconButton>
  );
}
