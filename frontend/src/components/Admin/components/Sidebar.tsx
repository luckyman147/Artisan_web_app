import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../stores/storeHooks";
import { setLogout } from "../../../stores/slice/userSlice";
import LogoutIcon from "@mui/icons-material/Logout";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    setOpen(false);
    dispatch(setLogout());
    navigate("/login");
  };

  return (
    <>
      {/* Drawer toggle button, positioned to the center */}
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: open ? 240 : 0,
          transform: "translateY(-50%)",
          zIndex: 1301,
          transition: "left 0.3s",
        }}
      >
        <IconButton
          color="inherit"
          edge="start"
          onClick={toggleDrawer}
          sx={{
            borderRadius: "50%",
            backgroundColor: "#fff",
            boxShadow: 2,
            padding: 2,
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          {/* Show right arrow if closed, left arrow if open */}
          {open ? (
            <KeyboardDoubleArrowLeftIcon />
          ) : (
            <KeyboardDoubleArrowRightIcon />
          )}
        </IconButton>
      </Box>

      {/* Drawer component */}
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        variant="persistent"
        sx={{ width: open ? 240 : 0, flexShrink: 0 }}
        PaperProps={{
          sx: {
            width: 240,
            position: "fixed",
            height: "100vh",
            top: "70px",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <List sx={{ flexGrow: 1 }}>
          <ListItem
            button
            component={Link}
            to="/Admin_dashboard"
            onClick={toggleDrawer}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/Admin_user"
            onClick={toggleDrawer}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/Admin_artisan"
            onClick={toggleDrawer}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Artisan" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/Admin_products"
            onClick={toggleDrawer}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Products" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/Admin_settings"
            onClick={toggleDrawer}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>

        {/* Logout button at the bottom */}
        <Box sx={{ marginTop: '-2',position: "relative",top : -90 }}>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
