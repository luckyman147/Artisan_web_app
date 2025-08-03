import { Box, Typography, Paper } from "@mui/material";
import { useEffect, useState } from "react"; 
import { fetchArtisanOfMonth } from "../apis/action";
import { ArtisanInfoThisMonth } from "../apis/interfaces";
import { Link } from "react-router-dom";

export default function ArtisansCard() {
  const [artisans, setArtisans] = useState<ArtisanInfoThisMonth[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchArtisanOfMonth();
        setArtisans(response); 
      } catch (error) {
        console.error("Error fetching artisans:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ margin: "0 auto", padding: "20px 0", display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
      {/* Artisans Card Section */}
      <Typography variant="h5" gutterBottom textAlign="center" sx={{ width: '100%' }}>
        Artisans of the Month
      </Typography>
      {artisans.slice(0, 3).map((artisan) => (
        <Link 
          key={artisan.artisanId} 
          to={`/artisan/profile/${artisan.artisanId}`} 
          style={{ textDecoration: 'none' }} 
        >
          <Paper
            sx={{
              padding: "20px",
              margin: "10px",
              width: "250px",
              height : "300px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "box-shadow 0.3s ease, transform 0.3s ease",
              "&:hover": {
                boxShadow: "0px 8px 12px rgba(19, 119, 250, 0.2)",
                cursor: 'pointer' 
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
              src={`${import.meta.env.VITE_API_IMAGE}${artisan.artisanPhoto}`}
              alt={artisan.artisanName}
            />
            <Typography variant="h6" textAlign="center">
              {artisan.artisanName}
            </Typography>
          </Paper>
        </Link>
      ))}
    </Box>
  );
}
