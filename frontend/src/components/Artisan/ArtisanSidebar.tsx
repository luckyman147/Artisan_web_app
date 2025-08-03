import React from "react";
import { Paper, Typography, Avatar, Box } from "@mui/material";
import { ArtisanInfo } from "../../apis/interfaces";

interface ArtisanSidebarProps {
  artisan: ArtisanInfo;
}

const ArtisanSidebar: React.FC<ArtisanSidebarProps> = ({ artisan }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "120vh",
        backgroundColor: "#f5f5f5", 
        borderRadius: 2,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        mt : 8,
      }}
    >
      <Avatar
        src={`${import.meta.env.VITE_API_IMAGE}${artisan.avatar}`} 
        alt={artisan.firstname}
        sx={{
          width: 120,
          height: 120,
          mb: 2,
          border: "3px solid #00796b", 
        }}
      />
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 700, 
          color: '#333', 
          mb: 1, 
          textAlign: 'center' 
        }}
      >
        {artisan.firstname} {artisan.lastname}
      </Typography>
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="body2" color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>
          <strong>Email:</strong> {artisan.email}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>
          <strong>Phone:</strong> {artisan.phone}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>
          <strong>Company:</strong> {artisan.company_name}
        </Typography>
      </Box>
      <Typography 
        variant="body2" 
        color="textSecondary" 
        gutterBottom 
        sx={{ 
          textAlign: "justify", 
          lineHeight: 1.5 
        }}
      >
        <strong>Description:</strong> {artisan.shopDescription}
      </Typography>
    </Paper>
  );
};

export default ArtisanSidebar;
