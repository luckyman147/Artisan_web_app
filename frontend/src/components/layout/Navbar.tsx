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
  Avatar,
  Divider,
  alpha,
  InputBase,
  styled
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
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
import { clearWishlist } from "../../stores/slice/wishSlice";
import { deleteAllCartList, deleteAllWishList } from "../../apis/action";
import { clearCart } from "../../stores/slice/cartSlice";

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userTypeOpen, setUserTypeOpen] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { role, id: userId, firstName, lastName } = useAppSelector((state: RootState) => state.user.userInfos);
  const cartLength = useAppSelector((state: RootState) => state.cart.cartLength);
  const wishLength = useAppSelector((state: RootState) => state.wish.wishLength);

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

    if (userId) {
      if (wishLength > 0) {
        await deleteAllWishList(userId);
      }
      if (cartLength > 0) {
        await deleteAllCartList(userId);
      }
    }
    dispatch(setLogout());
    navigate("/");
  };

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
    }
    handleProfileMenuClose();
  };

  const handleNavigateToProfile = () => {
    if (role === "user") {
      navigate("/profile");
    } else if (role === "artisan") {
      navigate(`/artisan/profile/${userId}`);
    }
    handleProfileMenuClose();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Search triggered");
  };

  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          padding: { xs: '0 8px', sm: '0 16px' }
        }}>
          {/* Logo/Brand */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              mr: 2
            }}
            onClick={() => navigate("/")}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              ArtisanHub
            </Typography>
          </Box>

          {/* Search Bar (Desktop) */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, maxWidth: 600, mx: 3 }}>
              <form onSubmit={handleSearch}>
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search products..."
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </Search>
              </form>
            </Box>
          )}

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                onClick={() => navigate("/artisanlist")}
                sx={{
                  color: theme.palette.text.primary,
                  mx: 1,
                  fontWeight: 500,
                  '&:hover': {
                    color: theme.palette.primary.main,
                    backgroundColor: 'transparent'
                  }
                }}
              >
                Artisans
              </Button>

              {role === "artisan" && (
                <Button
                  onClick={handleNavigateDashboard}
                  sx={{
                    color: theme.palette.text.primary,
                    mx: 1,
                    fontWeight: 500,
                    '&:hover': {
                      color: theme.palette.primary.main,
                      backgroundColor: 'transparent'
                    }
                  }}
                >
                  Dashboard
                </Button>
              )}

              {role !== "artisan" && (
                <Button
                  onClick={handleNavigateToProductList}
                  sx={{
                    color: theme.palette.text.primary,
                    mx: 1,
                    fontWeight: 500,
                    '&:hover': {
                      color: theme.palette.primary.main,
                      backgroundColor: 'transparent'
                    }
                  }}
                >
                  Products
                </Button>
              )}

              {/* Icons */}
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                {role !== "artisan" && (
                  <IconButton
                    onClick={() => navigate("/wishlist")}
                    sx={{ 
                      color: theme.palette.text.secondary,
                      mx: 0.5,
                      '&:hover': {
                        color: theme.palette.error.main
                      }
                    }}
                  >
                    <Badge
                      badgeContent={wishLength > 0 ? wishLength : null}
                      color="error"
                    >
                      <WishlistIcon />
                    </Badge>
                  </IconButton>
                )}

                {role !== "artisan" && (
                  <IconButton
                    onClick={() => navigate("/cart")}
                    sx={{ 
                      color: theme.palette.text.secondary,
                      mx: 0.5,
                      '&:hover': {
                        color: theme.palette.primary.main
                      }
                    }}
                  >
                    <Badge
                      badgeContent={cartLength > 0 ? cartLength : null}
                      color="primary"
                    overlap="circular"
                    sx={{
                      '& .MuiBadge-badge': {
                        right: -3,
                        top: 5
                      }
                    }}
                    >
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              )}

              {userType ? (
                <>
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    sx={{ ml: 1 }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32,
                        bgcolor: theme.palette.primary.main
                      }}
                    >
                      {firstName ? firstName.charAt(0).toUpperCase() : <PersonIcon />}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleProfileMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                  >
                    <MenuItem sx={{ pointerEvents: 'none' }}>
                      <ListItemIcon>
                        <Avatar 
                          sx={{ 
                            bgcolor: theme.palette.primary.main,
                            width: 24,
                            height: 24
                          }}
                        >
                          {firstName ? firstName.charAt(0).toUpperCase() : <PersonIcon fontSize="small" />}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText 
                        primary={`${firstName || 'User'} ${lastName || ''}`} 
                        secondary={role === 'artisan' ? 'Artisan' : 'Customer'}
                      />
                    </MenuItem>
                    <Divider />
                    
                    {role === "artisan" && (
                      <MenuItem onClick={handleNavigateToProfile}>
                        <ListItemIcon>
                          <PersonIcon fontSize="small" />
                        </ListItemIcon>
                        Profile
                      </MenuItem>
                    )}
                    
                    <MenuItem onClick={handleNavigateToOrders}>
                      <ListItemIcon>
                        <OrderIcon fontSize="small" />
                      </ListItemIcon>
                      Orders
                    </MenuItem>
                    
                    <MenuItem onClick={handleNavigateToSettings}>
                      <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                      </ListItemIcon>
                      Settings
                    </MenuItem>
                    
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    variant="text"
                    onClick={handleNavigateLogin}
                    sx={{
                      color: theme.palette.text.primary,
                      mx: 1,
                      fontWeight: 500,
                      '&:hover': {
                        color: theme.palette.primary.main,
                        backgroundColor: 'transparent'
                      }
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleJoinNowClick}
                    sx={{
                      ml: 1,
                      fontWeight: 500,
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: 'none',
                        backgroundColor: theme.palette.primary.dark
                      }
                    }}
                  >
                    Join Now
                  </Button>
                </>
              )}
            </Box>
          </Box>
        )}

        {/* Mobile Navigation */}
        {isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {role !== "artisan" && (
              <IconButton
                onClick={() => navigate("/wishlist")}
                sx={{ color: theme.palette.text.secondary }}
              >
                <Badge
                  badgeContent={wishLength > 0 ? wishLength : null}
                  color="error"
                >
                  <WishlistIcon />
                </Badge>
              </IconButton>
            )}
            
            {role !== "artisan" && (
              <IconButton
                onClick={() => navigate("/cart")}
                sx={{ color: theme.palette.text.secondary }}
              >
                <Badge
                  badgeContent={cartLength > 0 ? cartLength : null}
                  color="primary"
                >
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            )}
            
            <IconButton
              color="inherit"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
            
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={handleDrawerToggle}
              sx={{
                '& .MuiDrawer-paper': {
                  width: 280,
                  boxSizing: 'border-box',
                },
              }}
            >
              <Box
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
              >
                {userType ? (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: theme.palette.primary.main,
                          mr: 2
                        }}
                      >
                        {firstName ? firstName.charAt(0).toUpperCase() : <PersonIcon />}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">
                          {firstName} {lastName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {role === 'artisan' ? 'Artisan' : 'Customer'}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                  </Box>
                ) : null}
                
                <List>
                  {role === "artisan" && (
                    <ListItem button onClick={handleNavigateDashboard}>
                      <ListItemText primary="Dashboard" />
                    </ListItem>
                  )}
                  
                  {role !== "artisan" && (
                    <ListItem button onClick={handleNavigateToProductList}>
                      <ListItemText primary="Products" />
                    </ListItem>
                  )}
                  
                  <ListItem button onClick={() => navigate("/artisanlist")}>
                    <ListItemText primary="Artisans" />
                  </ListItem>
                  
                  {isMobile && (
                    <ListItem button onClick={() => navigate("/search")}>
                      <ListItemIcon>
                        <SearchIcon />
                      </ListItemIcon>
                      <ListItemText primary="Search" />
                    </ListItem>
                  )}
                </List>
                
                {userType ? (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <List>
                      {role === "artisan" && (
                        <ListItem button onClick={handleNavigateToProfile}>
                          <ListItemIcon>
                            <PersonIcon />
                          </ListItemIcon>
                          <ListItemText primary="Profile" />
                        </ListItem>
                      )}
                      
                      <ListItem button onClick={handleNavigateToOrders}>
                        <ListItemIcon>
                          <OrderIcon />
                        </ListItemIcon>
                        <ListItemText primary="Orders" />
                      </ListItem>
                      
                      <ListItem button onClick={handleNavigateToSettings}>
                        <ListItemIcon>
                          <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                      </ListItem>
                      
                      <ListItem button onClick={handleLogout}>
                        <ListItemIcon>
                          <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                      </ListItem>
                    </List>
                  </>
                ) : (
                  <Box sx={{ mt: 'auto', p: 2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={handleNavigateLogin}
                      sx={{ mb: 1 }}
                    >
                      Sign In
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleJoinNowClick}
                    >
                      Join Now
                    </Button>
                  </Box>
                )}
              </Box>
            </Drawer>
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