import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Skeleton,
  Toolbar,
  Link,
  MenuItem,
  Divider,
} from "@mui/material";
import Logo from "../assets/images/foreground.svg";
import MenuIcon from "@mui/icons-material/Menu";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import MapIcon from "@mui/icons-material/Map";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import DevicesIcon from "@mui/icons-material/Devices";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

function MainAppBar({ selectedNav = null }) {
  const auth = useAuth();
  const navigate = useNavigate();

  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  function handleOpenDrawer() {
    setIsDrawerOpened(true);
  }
  function handleCloseDrawer() {
    setIsDrawerOpened(false);
  }

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpened = Boolean(anchorEl);
  function handleOpenMenu(event) {
    setAnchorEl(event.currentTarget);
  }
  function handleCloseMenu() {
    setAnchorEl(null);
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton
              sx={{ display: { xs: "", sm: "none" } }}
              onClick={handleOpenDrawer}
            >
              <MenuIcon />
            </IconButton>
            <Link
              href="/"
              color="white"
              underline="none"
              sx={{
                display: { xs: "none", sm: "flex" },
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img src={Logo} height={32} />
              <h3>Onloc</h3>
            </Link>
          </Box>
          <Link
            href="/"
            color="white"
            underline="none"
            sx={{
              display: { xs: "flex", sm: "none" },
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src={Logo} height={32} />
            <h3>Onloc</h3>
          </Link>
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Button
              variant={selectedNav === "map" ? "contained" : "text"}
              onClick={() => navigate("/map")}
              sx={{ gap: 1 }}
            >
              {selectedNav === "map" ? <MapIcon /> : <MapOutlinedIcon />}
              Map
            </Button>
            <Button
              variant={selectedNav === "devices" ? "contained" : "text"}
              onClick={() => navigate("/devices")}
              sx={{ gap: 1 }}
            >
              {selectedNav === "devices" ? (
                <DevicesIcon />
              ) : (
                <DevicesOutlinedIcon />
              )}
              Devices
            </Button>
          </Box>
          {auth.user ? (
            <IconButton onClick={handleOpenMenu}>
              <AccountCircleOutlinedIcon />
            </IconButton>
          ) : (
            <Skeleton variant="circular" width={40} height={40} />
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        open={isDrawerOpened}
        onClose={handleCloseDrawer}
        sx={{ display: { xs: "flex", sm: "none" } }}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedNav === "map"}
              onClick={() => navigate("/map")}
            >
              <ListItemIcon>
                {selectedNav === "map" ? <MapIcon /> : <MapOutlinedIcon />}
              </ListItemIcon>
              <ListItemText primary="Map" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedNav === "devices"}
              onClick={() => navigate("/devices")}
            >
              <ListItemIcon>
                {selectedNav === "devices" ? (
                  <DevicesIcon />
                ) : (
                  <DevicesOutlinedIcon />
                )}
              </ListItemIcon>
              <ListItemText primary="Devices" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      {auth.user ? (
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpened}
          onClose={handleCloseMenu}
          onClick={handleCloseMenu}
        >
          <MenuItem onClick={handleCloseMenu}>
            <ListItemIcon>
              <AccountCircleOutlinedIcon />
            </ListItemIcon>
            {auth.user.username}
          </MenuItem>
          <Divider />
          <MenuItem
            selected={selectedNav === "settings"}
            onClick={() => {
              handleCloseMenu();
              navigate("/settings");
            }}
          >
            <ListItemIcon>
              {selectedNav === "settings" ? (
                <SettingsIcon />
              ) : (
                <SettingsOutlinedIcon />
              )}
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              auth.logoutAction();
            }}
          >
            <ListItemIcon>
              <LogoutOutlinedIcon />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      ) : (
        ""
      )}
    </>
  );
}

export default MainAppBar;
