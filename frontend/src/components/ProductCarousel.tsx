import Slider from "react-slick";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const products = [
  {
    id: 1,
    name: "Meta Sleeveless Dress",
    image: "https://via.placeholder.com/150",
    price: "$40.00",
    oldPrice: "$85.00",
    discount: "-18%",
    rating: 4,
  },
  {
    id: 2,
    name: "Flower Print Dress",
    image: "https://via.placeholder.com/150",
    price: "$55.00",
    oldPrice: "",
    discount: "",
    rating: 2,
  },
  {
    id: 3,
    name: "Ruffled Neck Blouse",
    image: "https://via.placeholder.com/150",
    price: "$110.00",
    oldPrice: "$130.00",
    discount: "-15%",
    rating: 5,
  },
  {
    id: 4,
    name: "Fit Wool Suit",
    image: "https://via.placeholder.com/150",
    price: "$80.00",
    oldPrice: "",
    discount: "",
    rating: 5,
  },
];

export default function ProductCarousel() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // Auto-play every 2 seconds
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

  return (
    <Box sx={{ margin: "0 auto", padding: "20px 0" }}>
      <Typography variant="h5" gutterBottom textAlign="center">
        Promotions
      </Typography>
      <Slider {...settings}>
        {products.map((product) => (
          <Paper
            key={product.id}
            sx={{
              padding: "15px",
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
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 1 
                },
              },
            }}
          >
            <Box position="relative" sx={{ textAlign: "center" }}>
              {product.discount && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    background: "black",
                    color: "white",
                    borderRadius: "50%",
                    padding: "5px 10px",
                    fontSize: "12px",
                  }}
                >
                  {product.discount}
                </Box>
              )}
              <img
                src={product.image}
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
            </Box>
            <Typography variant="subtitle1" gutterBottom textAlign="center">
              {product.name}
            </Typography>
            <Box textAlign="center">
              <Typography
                variant="body2"
                sx={{
                  textDecoration: product.oldPrice ? "line-through" : "none",
                  color: "red",
                }}
              >
                {product.price}
              </Typography>
              {product.oldPrice && (
                <Typography variant="body2" color="textSecondary">
                  {product.oldPrice}
                </Typography>
              )}
            </Box>
          </Paper>
        ))}
      </Slider>
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
        display: "block",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "grey",
        color: "white",
        zIndex: 1,
        borderRadius: "50%",
        padding: "5px",
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
        display: "block",
        left: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "grey",
        color: "white",
        zIndex: 1,
        borderRadius: "50%",
        padding: "5px",
      }}
      onClick={onClick}
    >
      &lt;
    </IconButton>
  );
}
