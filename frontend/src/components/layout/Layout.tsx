import Footer from "./Footer";
import Navbar from "./Navbar";
import { Box, Container } from "@mui/material";

type Props = {
  children?: React.ReactNode;
};

function Layout({ children }: Props) {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />

      {/* Main content area */}
      <Box component="main" flexGrow={1}>
        <Container
          maxWidth="xl"
          sx={{
            width: '100%', 
            maxWidth: '100%', 
            backgroundColor :"white"
          }}
        >
          {children}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

export default Layout;
