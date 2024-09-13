import { useState, useEffect } from "react";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  CssBaseline,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import WishlistIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import UserTypeSelection from "../Auth/UserTypeSelection";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../stores/store";
import { useAppSelector, useAppDispatch } from "../../stores/storeHooks";
import { setLogout } from "../../stores/slice/userSlice";
import waves from "../../assets/images/waves.svg";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userTypeOpen, setUserTypeOpen] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const role = useAppSelector((state: RootState) => state.user.userInfos.role);

  const wishlistCount = useAppSelector(
    (state: RootState) => state.lists.wishlistLength
  );
  const cartListCount = useAppSelector(
    (state: RootState) => state.lists.cartLength
  );


  useEffect(() => {
    setUserType(role);
    console.log("Wishlist count:", wishlistCount);
  console.log("Cart count:", cartListCount);
  }, [role,wishlistCount,cartListCount]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleJoinNowClick = () => {
    setUserTypeOpen(true);
  };

  const handleCloseUserTypePopup = () => {
    setUserTypeOpen(false);
  };

  const handleNavigateLogin = () => {
    navigate("/login");
  };

  const handleNavigateToProductList = () => {
    navigate("/products");
  };

  const handleNavigateDashboard = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/");
  };

  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: "100%",
          backgroundImage: `url(${waves})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "white",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            {/* Add your logo here */}
            <Typography
              variant="h6"
              component="div"
              onClick={() => navigate("/")}
              sx={{ color: "black" }}
            >
              Logo
            </Typography>
          </Box>
          {isMobile ? (
            <>
              <IconButton color="inherit" onClick={() => navigate("/wishlist")}>
                <Badge
                  badgeContent={wishlistCount}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "white",
                      color: "black",
                      top: 0,
                      right: 5,
                    },
                  }}
                  overlap="circular"
                >
                  <WishlistIcon sx={{ color: "red" }} />
                </Badge>
              </IconButton>
              <IconButton color="inherit" onClick={() => navigate("/cart")}>
                <Badge
                  badgeContent={cartListCount}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "white",
                      color: "black",
                      top: 0,
                      right: 5,
                    },
                  }}
                  overlap="circular"
                >
                  <ShoppingCartIcon sx={{ color: "black" }} />
                </Badge>
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon sx={{ color: "black" }} />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={handleDrawerToggle}
              >
                <List sx={{ width: 250 }}>
                  {userType === "artisan" && (
                    <ListItem button onClick={handleNavigateDashboard}>
                      <ListItemText
                        primary="Dashboard"
                        sx={{ color: "black" }}
                      />
                    </ListItem>
                  )}
                  <ListItem button onClick={handleNavigateToProductList}>
                    <ListItemText primary="Product" sx={{ color: "black" }} />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="Contact" sx={{ color: "black" }} />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="About us" sx={{ color: "black" }} />
                  </ListItem>
                  {userType ? (
                    <>
                      <ListItem button onClick={() => navigate("/profile")}>
                        <ListItemIcon>
                          <PersonIcon sx={{ color: "black" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Profile"
                          sx={{ color: "black" }}
                        />
                      </ListItem>
                      <ListItem button onClick={handleLogout}>
                        <ListItemIcon>
                          <LogoutIcon sx={{ color: "black" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="LogOut"
                          sx={{ color: "black" }}
                        />
                      </ListItem>
                    </>
                  ) : (
                    <>
                      <ListItem button onClick={handleNavigateLogin}>
                        <ListItemText
                          primary="Sign In"
                          sx={{ color: "black" }}
                        />
                      </ListItem>
                      <ListItem button onClick={handleJoinNowClick}>
                        <ListItemText
                          primary="Join Now"
                          sx={{ color: "black" }}
                        />
                      </ListItem>
                    </>
                  )}
                </List>
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              <Box
                sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
              >
                {userType === "artisan" && (
                  <Button
                    onClick={handleNavigateDashboard}
                    sx={{ color: "black" }}
                  >
                    Dashboard
                  </Button>
                )}
                <Button
                  onClick={handleNavigateToProductList}
                  sx={{ color: "black" }}
                >
                  Product
                </Button>
                <Button sx={{ color: "black" }}>Contact</Button>
                <Button sx={{ color: "black" }}>About us</Button>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                {userType ? (
                  <>
                    <IconButton
                      color="inherit"
                      onClick={() => navigate("/wishlist")}
                      sx={{ color: "red" }}
                    >
                      <Badge
                        badgeContent={wishlistCount}
                        sx={{
                          "& .MuiBadge-badge": {
                            backgroundColor: "white",
                            color: "black",
                            top: 0,
                            right: 5,
                          },
                        }}
                        overlap="circular"
                      >
                        <WishlistIcon />
                      </Badge>
                    </IconButton>
                    <IconButton
                      color="inherit"
                      onClick={() => navigate("/cart")}
                      sx={{ color: "blue" }}
                    >
                      <Badge
                        badgeContent={cartListCount}
                        sx={{
                          "& .MuiBadge-badge": {
                            backgroundColor: "white",
                            color: "black",
                            top: 0,
                            right: 5,
                          },
                        }}
                        overlap="circular"
                      >
                        <ShoppingCartIcon />
                      </Badge>
                    </IconButton>
                    <IconButton
                      color="inherit"
                      onClick={() => navigate("/profile")}
                      sx={{ color: "black" }}
                    >
                      <PersonIcon />
                    </IconButton>
                    <IconButton
                      color="inherit"
                      onClick={handleLogout}
                      sx={{ color: "black" }}
                    >
                      <LogoutIcon />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleNavigateLogin}
                      sx={{ color: "black" }}
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={handleJoinNowClick}
                      variant="contained"
                      sx={{ backgroundColor: "white", color: "black" }}
                    >
                      Join Now
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <UserTypeSelection
        open={userTypeOpen}
        onClose={handleCloseUserTypePopup}
      />
    </>
  );
}
