import { useState } from "react";
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
  Skeleton,
  Toolbar,
} from "@mui/material";
import Logo from "../assets/images/foreground.svg";
import MenuIcon from "@mui/icons-material/Menu";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";

function MainAppBar() {
  const auth = useAuth();

  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  function handleOpenDrawer() {
    setIsDrawerOpened(true);
  }
  function handleCloseDrawer() {
    setIsDrawerOpened(false);
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
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img src={Logo} height={32} />
              <h3>Onloc</h3>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "flex", sm: "none" },
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src={Logo} height={32} />
            <h3>Onloc</h3>
          </Box>
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Button onClick={() => console.log("Go to map")} sx={{ gap: 1 }}>
              <MapOutlinedIcon />
              Map
            </Button>
            <Button
              onClick={() => console.log("Go to devices")}
              sx={{ gap: 1 }}
            >
              <DevicesOutlinedIcon />
              Devices
            </Button>
          </Box>
          {auth.user ? (
            <Button variant="outlined" onClick={auth.logoutAction}>
              Logout
            </Button>
          ) : (
            <Skeleton variant="rounded" width={90} height={40} />
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
            <ListItemButton>
              <ListItemIcon>
                <MapOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Map" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <DevicesOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Devices" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}

export default MainAppBar;
