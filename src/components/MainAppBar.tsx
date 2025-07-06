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
import Icon from "@mdi/react"
import {
  mdiAccountCircle,
  mdiAccountCircleOutline,
  mdiCog,
  mdiCogOutline,
  mdiDevices,
  mdiLogout,
  mdiMap,
  mdiMapOutline,
  mdiMenu,
  mdiViewDashboard,
  mdiViewDashboardOutline,
} from "@mdi/js"

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
              <Icon path={mdiMenu} size={1} />
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
                <Icon path={mdiViewDashboard} size={1} />
              ) : (
                <Icon path={mdiViewDashboardOutline} size={1} />
              )}
              Dashboard
            </Button>
            <Button
              variant={selectedNav === "map" ? "contained" : "text"}
              onClick={() => navigate("/map")}
              sx={{ gap: 1 }}
            >
              {selectedNav === "map" ? (
                <Icon path={mdiMap} size={1} />
              ) : (
                <Icon path={mdiMapOutline} size={1} />
              )}
              Map
            </Button>
            <Button
              variant={selectedNav === "devices" ? "contained" : "text"}
              onClick={() => navigate("/devices")}
              sx={{ gap: 1 }}
            >
              {selectedNav === "devices" ? (
                <Icon path={mdiDevices} size={1} />
              ) : (
                <Icon path={mdiDevices} size={1} />
              )}
              Devices
            </Button>
          </Box>
          {auth.user ? (
            <IconButton onClick={handleOpenMenu}>
              <Icon path={mdiAccountCircleOutline} size={1} />
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
                  <Icon path={mdiViewDashboard} size={1} />
                ) : (
                  <Icon path={mdiViewDashboardOutline} size={1} />
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
                {selectedNav === "map" ? (
                  <Icon path={mdiMap} size={1} />
                ) : (
                  <Icon path={mdiMapOutline} size={1} />
                )}
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
                  <Icon path={mdiDevices} size={1} />
                ) : (
                  <Icon path={mdiDevices} size={1} />
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
                <Icon path={mdiAccountCircle} size={1} />
              ) : (
                <Icon path={mdiAccountCircleOutline} size={1} />
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
                <Icon path={mdiCog} size={1} />
              ) : (
                <Icon path={mdiCogOutline} size={1} />
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
              <Icon path={mdiLogout} size={1} />
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
