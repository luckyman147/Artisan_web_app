import Slider from "react-slick";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import { grey } from "@mui/material/colors";

// Sample artisan data
const artisans = [
  {
    id: 1,
    name: "Artisan 1",
    description: "Description de l'artisan 1.",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Artisan 2",
    description: "Description de l'artisan 2.",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Artisan 3",
    description: "Description de l'artisan 2.",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 4,
    name: "Artisan 4",
    description: "Description de l'artisan 2.",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 5,
    name: "Artisan 5",
    description: "Description de l'artisan 2.",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 6,
    name: "Artisan 6",
    description: "Description de l'artisan 2.",
    image: "https://via.placeholder.com/150",
  },
];

export default function ArtisansCarousel() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
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
      {/* Artisans Carousel Section */}
      <Typography variant="h5" gutterBottom textAlign="center">
        Artisans of the Month
      </Typography>
      <Slider {...settings}>
        {artisans.map((artisan) => (
          <Paper
            key={artisan.id}
            sx={{
              padding: "15px",
              //   margin: "0 10px",
              marginBottom: "10px",
              width: "250px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              transition: "box-shadow 0.3s ease, transform 0.3s ease",
              "&:hover": {
                boxShadow: "0px 8px 12px rgba(19, 119, 250, 0.2)",
              },
            }}
          >
            <Box
              height={150}
              width={150}
              bgcolor="#E0E0E0"
              mb={2}
              borderRadius="50%"
              mx="auto"
              component="img"
              src={artisan.image}
              alt={artisan.name}
            />
            <Typography variant="h6" textAlign="center">
              {artisan.name}
            </Typography>
            <Typography textAlign="center">{artisan.description}</Typography>
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
        backgroundColor: grey[600],
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
        backgroundColor: grey[600],
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
