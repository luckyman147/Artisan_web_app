import { Box } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface DashboardProps {
  children: React.ReactNode;
}

const Layout: React.FC<DashboardProps> = ({ children }) => {
  return (
    <>
      {/* Header remains at the top */}
      <Header />

      {/* Layout with Sidebar and Main Content Area */}
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar on the left */}
        <Sidebar />
    
        {/* Main content area with flexGrow to take the rest of the space */}
        <Box sx={{ flexGrow: 1, padding: 3 }}>
          {children}
        </Box>
      </Box>
    </>
  );
};

export default Layout;
