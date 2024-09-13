import { Box, Container, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box sx={{ backgroundColor: "#FFD700", padding: 2, marginTop: "auto" }}>
      <Container>
        <Typography variant="body1" align="center">
          &copy; {new Date().getFullYear()} My Shop. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
