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
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import WishlistIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import OrderIcon from "@mui/icons-material/Receipt";
import UserTypeSelection from "../Auth/UserTypeSelection";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../stores/store";
import { useAppSelector, useAppDispatch } from "../../stores/storeHooks";
import { setLogout } from "../../stores/slice/userSlice";
import waves from "../../assets/images/waves.svg";
import { clearWishlist } from "../../stores/slice/wishSlice";
import { deleteAllCartList, deleteAllWishList } from "../../apis/action";
import { clearCart } from "../../stores/slice/cartSlice";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userTypeOpen, setUserTypeOpen] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const role = useAppSelector((state: RootState) => state.user.userInfos.role);
  const user = useAppSelector((state: RootState) => state.user.userInfos.id);
  const cartLength = useAppSelector(
    (state: RootState) => state.cart.cartLength
  );
  const wishLength = useAppSelector(
    (state: RootState) => state.wish.wishLength
  );

  useEffect(() => {
    setUserType(role);
  }, [role]);

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

  const handleLogout = async () => {
    dispatch(clearWishlist());
    dispatch(clearCart());

    if (user) {
      if (wishLength > 0) {
        await deleteAllWishList(user);
      }
      if (cartLength > 0) {
        await deleteAllCartList(user);
      }
    }
    dispatch(setLogout());
    navigate("/");
  };

  // Dropdown menu handlers
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigateToSettings = () => {
    navigate("/settings");
    handleProfileMenuClose();
  };

  const handleNavigateToOrders = () => {
    if (role === "user") {
      navigate("/orders");
    } else if (role === "artisan") {
      navigate("/orderartisan");
    } else {
      console.log("Invalid user role");
    }
    handleProfileMenuClose();
  };

  const handleNavigateToProfile = () => {
    if (role === "user") {
      navigate("/profile");
    } else if (role === "artisan") {
      navigate(`/artisan/profile/${user}`);
    } else {
      console.log("Invalid user role");
    }
    handleProfileMenuClose();
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
            onClick={() => navigate("/")}
          >
            <Typography variant="h6" sx={{ color: "black", fontFamily  : "Rowdies",fontWeight : 600}}>
              ArtShop
            </Typography>
          </Box>
          {isMobile ? (
            <>
              {role !== "artisan" && (
                <IconButton
                  color="inherit"
                  onClick={() => navigate("/wishlist")}
                >
                  <Badge
                    badgeContent={wishLength > 0 ? wishLength : null}
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor:
                          wishLength > 0 ? "white" : "transparent",
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
              )}
              {role !== "artisan" && (
                <IconButton color="inherit" onClick={() => navigate("/cart")}>
                  <Badge
                    badgeContent={cartLength > 0 ? cartLength : null}
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor:
                          cartLength > 0 ? "white" : "transparent",
                        color: "black",
                        top: 0,
                        right: 5,
                      },
                    }}
                    overlap="circular"
                  >
                    <ShoppingCartIcon sx={{ color: "blue" }} />
                  </Badge>
                </IconButton>
              )}
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
                  {role === "artisan" && (
                    <ListItem button onClick={handleNavigateDashboard}>
                      <ListItemText
                        primary="Dashboard"
                        sx={{ color: "black" }}
                      />
                    </ListItem>
                  )}
                  {role !== "artisan" && (
                    <ListItem button onClick={handleNavigateToProductList}>
                      <ListItemText primary="Product" sx={{ color: "black" }} />
                    </ListItem>
                  )}

                  {userType ? (
                    <>
                      {role === "artisan" && (
                        <ListItem button onClick={handleNavigateToProfile}>
                          <ListItemIcon>
                            <PersonIcon sx={{ color: "black" }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Profile"
                            sx={{ color: "black" }}
                          />
                        </ListItem>
                      )}
                      <ListItem button onClick={handleNavigateToOrders}>
                        <ListItemIcon>
                          <OrderIcon sx={{ color: "black" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Orders"
                          sx={{ color: "black" }}
                        />
                      </ListItem>
                      <ListItem button onClick={handleNavigateToSettings}>
                        <ListItemIcon>
                          <SettingsIcon sx={{ color: "black" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Settings"
                          sx={{ color: "black" }}
                        />
                      </ListItem>
                      <ListItem button onClick={handleLogout}>
                        <ListItemIcon>
                          <LogoutIcon sx={{ color: "black" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Logout"
                          sx={{ color: "black" }}
                        />
                      </ListItem>
                      <ListItem button onClick={() => navigate("/artisanlist")}>
                        <ListItemText
                          primary="Artisan"
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
                      <ListItem button onClick={() => navigate("/artisanlist")}>
                        <ListItemText
                          primary="Artisan"
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
                <Button
                  onClick={() => navigate("/artisanlist")}
                  sx={{
                    color: "black",
                    marginLeft: 10,
                    marginRight: 6,
                    "&:hover": {
                      backgroundColor: "Highlight",
                      opacity: 0.9,
                    },
                  }}
                >
                  Artisan
                </Button>
                {role === "artisan" && (
                  <Button
                    onClick={handleNavigateDashboard}
                    sx={{ color: "black" }}
                  >
                    Dashboard
                  </Button>
                )}
                {role !== "artisan" && (
                  <Button
                    onClick={handleNavigateToProductList}
                    sx={{
                      color: "black",
                      "&:hover": {
                        backgroundColor: "Highlight",
                        opacity: 0.9,
                      },
                    }}
                  >
                    Product
                  </Button>
                )}
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                {role !== "artisan" && (
                  <IconButton
                    color="inherit"
                    onClick={() => navigate("/wishlist")}
                    sx={{ color: "red" }}
                  >
                    <Badge
                      badgeContent={wishLength > 0 ? wishLength : null}
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor:
                            wishLength > 0
                              ? theme.palette.common.white
                              : "none",
                          color: "black",
                        },
                      }}
                      overlap="circular"
                    >
                      <WishlistIcon />
                    </Badge>
                  </IconButton>
                )}
                {role !== "artisan" && (
                  <IconButton
                    color="inherit"
                    onClick={() => navigate("/cart")}
                    sx={{ color: "blue" }}
                  >
                    <Badge
                      badgeContent={cartLength > 0 ? cartLength : null}
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor:
                            cartLength > 0
                              ? theme.palette.common.white
                              : "none",
                          color: "black",
                        },
                      }}
                      overlap="circular"
                    >
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                )}
                {userType ? (
                  <>
                    <IconButton
                      color="inherit"
                      onClick={handleProfileMenuOpen}
                      sx={{ color: "black" }}
                    >
                      <PersonIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleProfileMenuClose}
                      sx={{
                        mt: "45px",
                      }}
                    >
                      {role === "artisan" && (
                        <MenuItem onClick={handleNavigateToProfile}>
                          <PersonIcon sx={{ mr: 1 }} /> Profile
                        </MenuItem>
                      )}
                      <MenuItem onClick={handleNavigateToOrders}>
                        <OrderIcon sx={{ mr: 1 }} /> Orders
                      </MenuItem>
                      <MenuItem onClick={handleNavigateToSettings}>
                        <SettingsIcon sx={{ mr: 1 }} /> Settings
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>
                        <LogoutIcon sx={{ mr: 1 }} /> Logout
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button
                      sx={{
                        color: "black",
                        backgroundColor: "white",
                        "&:hover": {
                          backgroundColor: "#f0f0f0",
                        },
                      }}
                      onClick={handleNavigateLogin}
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={handleJoinNowClick}
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        ml: 2,
                        "&:hover": {
                          backgroundColor: theme.palette.primary.dark,
                        },
                      }}
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
