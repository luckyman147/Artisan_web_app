import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Avatar, Menu, MenuItem } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAppDispatch } from '../../../stores/storeHooks';
import { useNavigate } from 'react-router-dom';
import { setLogout } from '../../../stores/slice/userSlice';

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); 

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); 
  };

  const handleMenuClose = () => {
    setAnchorEl(null); 
  };

  const handleLogout = () => {
    dispatch(setLogout());
    navigate('/login');
    handleMenuClose(); 
  };

  const handleSettings = () => {
    navigate('/Admin_settings');
    handleMenuClose(); 
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Admin Dashboard
        </Typography>

        {/* Notification Icon with Badge (Commented out for now) */}
        {/* <IconButton color="inherit" sx={{ marginRight: 2 }}>
          <Badge badgeContent={4} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton> */}

        {/* Profile Avatar with Dropdown Menu */}
        <IconButton color="inherit" onClick={handleMenuOpen}>
          <Avatar alt="Profile Image" src="https://via.placeholder.com/150" />
        </IconButton>

        {/* Menu for Settings and Logout */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ mt: '45px' }} // Offset menu to prevent overlap with the header
        >
          <MenuItem onClick={handleSettings}>Settings</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
