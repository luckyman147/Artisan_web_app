import { Box, Button, Typography, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Link } from "react-router-dom";

export default function PasswordResetSuccess() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="white"
      position="relative"
    >
      <Box position="absolute" top={16} left={16}>
        <IconButton>
          <ArrowBackIosIcon sx={{ color: "white" }} />
        </IconButton>
      </Box>

      <Box textAlign="center" p={3}>
        <CheckCircleOutlineIcon
          sx={{
            fontSize: 80,
            color: "#34A853",
            backgroundColor: "rgba(0, 128, 0, 0.1)",
            borderRadius: 5,
            boxShadow: "10px 10px 182px 0px rgba(52,168,83,0.62)",
          }}
        />
        <Typography
          variant="h6"
          mt={2}
          mb={4}
          fontWeight={600}
          sx={{ fontFamily: "Poppins, sans-serif" }}
        >
          Password reset successfully
        </Typography>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 50, width: "300px", textTransform: "none", fontWeight:300 }}
          >
            Login
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
