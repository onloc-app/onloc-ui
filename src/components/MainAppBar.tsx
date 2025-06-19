import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthProvider"
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
  MenuItem,
  Divider,
} from "@mui/material"
import Logo from "../assets/images/foreground.svg"
import MenuIcon from "@mui/icons-material/Menu"
import MapOutlinedIcon from "@mui/icons-material/MapOutlined"
import MapIcon from "@mui/icons-material/Map"
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined"
import DevicesIcon from "@mui/icons-material/Devices"
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"
import SettingsIcon from "@mui/icons-material/Settings"
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined"
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined"
import DashboardIcon from "@mui/icons-material/Dashboard"

interface MainAppBarProps {
  selectedNav?: string | null
}

function MainAppBar({ selectedNav = null }: MainAppBarProps) {
  const auth = useAuth()
  const navigate = useNavigate()

  const [isDrawerOpened, setIsDrawerOpened] = useState(false)
  function handleOpenDrawer() {
    setIsDrawerOpened(true)
  }
  function handleCloseDrawer() {
    setIsDrawerOpened(false)
  }

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const isMenuOpened = Boolean(anchorEl)
  function handleOpenMenu(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget)
  }
  function handleCloseMenu() {
    setAnchorEl(null)
  }

  if (!auth) return

  return (
    <>
      <AppBar position="static" sx={{ height: 64 }}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
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
              onClick={() => navigate("/")}
              sx={{
                display: { xs: "none", sm: "flex" },
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <img alt="Onloc's logo" src={Logo} height={32} />
              <h3>Onloc</h3>
            </Box>
          </Box>
          <Box
            onClick={() => navigate("/")}
            sx={{
              display: { xs: "flex", sm: "none" },
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <img alt="Onloc's logo" src={Logo} height={32} />
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
            <Button
              variant={selectedNav === "dashboard" ? "contained" : "text"}
              onClick={() => navigate("/dashboard")}
              sx={{ gap: 1 }}
            >
              {selectedNav === "dashboard" ? (
                <DashboardIcon />
              ) : (
                <DashboardOutlinedIcon />
              )}
              Dashboard
            </Button>
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
              selected={selectedNav === "dashboard"}
              onClick={() => navigate("/dashboard")}
            >
              <ListItemIcon>
                {selectedNav === "dashboard" ? (
                  <DashboardIcon />
                ) : (
                  <DashboardOutlinedIcon />
                )}
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
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
        <Menu anchorEl={anchorEl} open={isMenuOpened} onClose={handleCloseMenu}>
          <MenuItem
            selected={selectedNav === "profile"}
            onClick={() => {
              handleCloseMenu()
              navigate("/profile")
            }}
          >
            <ListItemIcon>
              {selectedNav === "profile" ? (
                <AccountCircleIcon />
              ) : (
                <AccountCircleOutlinedIcon />
              )}
            </ListItemIcon>
            {auth.user.username}
          </MenuItem>
          <Divider />
          <MenuItem
            selected={selectedNav === "settings"}
            onClick={() => {
              handleCloseMenu()
              navigate("/settings")
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
              handleCloseMenu()
              auth.logoutAction()
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
  )
}

export default MainAppBar
