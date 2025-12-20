import Logo from "@/assets/images/foreground.svg"
import { LanguageSelect, NavButton, ThemeToggle } from "@/components"
import { useAuth } from "@/hooks/useAuth"
import { NavOptions } from "@/types/enums"
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
  mdiShieldAccount,
  mdiShieldAccountOutline,
  mdiViewDashboard,
  mdiViewDashboardOutline,
} from "@mdi/js"
import Icon from "@mdi/react"
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Toolbar,
  Typography,
  type BoxProps,
} from "@mui/material"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

interface MainAppBarProps {
  selectedNav?: NavOptions
}

type OnlocLogoProps = BoxProps

export default function MainAppBar({ selectedNav }: MainAppBarProps) {
  const auth = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

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
      <AppBar position="static">
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <IconButton
              sx={{ display: { xs: "flex", md: "none" } }}
              onClick={handleOpenDrawer}
            >
              <Icon path={mdiMenu} size={1} />
            </IconButton>
            <OnlocLogo sx={{ display: "flex" }} />
          </Box>
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <NavButton
              isSelected={selectedNav === NavOptions.DASHBOARD}
              notSelectedIcon={mdiViewDashboardOutline}
              selectedIcon={mdiViewDashboard}
              onClick={() => navigate("/dashboard")}
            >
              {t("components.main_app_bar.dashboard")}
            </NavButton>
            <NavButton
              isSelected={selectedNav === NavOptions.MAP}
              notSelectedIcon={mdiMapOutline}
              selectedIcon={mdiMap}
              onClick={() => navigate("/map")}
            >
              {t("components.main_app_bar.map")}
            </NavButton>
            <NavButton
              isSelected={selectedNav === NavOptions.DEVICES}
              notSelectedIcon={mdiDevices}
              selectedIcon={mdiDevices}
              onClick={() => navigate("/devices")}
            >
              {t("components.main_app_bar.devices")}
            </NavButton>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <LanguageSelect />
            <ThemeToggle />
            {auth.user ? (
              <IconButton onClick={handleOpenMenu} color="inherit">
                <Icon path={mdiAccountCircleOutline} size={1} />
              </IconButton>
            ) : (
              <Skeleton variant="circular" width={40} height={40} />
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        open={isDrawerOpened}
        onClose={handleCloseDrawer}
        sx={{ display: { xs: "flex", md: "none" } }}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedNav === NavOptions.DASHBOARD}
              onClick={() => navigate("/dashboard")}
            >
              <ListItemIcon>
                {selectedNav === NavOptions.DASHBOARD ? (
                  <Icon path={mdiViewDashboard} size={1} />
                ) : (
                  <Icon path={mdiViewDashboardOutline} size={1} />
                )}
              </ListItemIcon>
              <ListItemText primary={t("components.main_app_bar.dashboard")} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedNav === NavOptions.MAP}
              onClick={() => navigate("/map")}
            >
              <ListItemIcon>
                {selectedNav === NavOptions.MAP ? (
                  <Icon path={mdiMap} size={1} />
                ) : (
                  <Icon path={mdiMapOutline} size={1} />
                )}
              </ListItemIcon>
              <ListItemText primary={t("components.main_app_bar.map")} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedNav === NavOptions.DEVICES}
              onClick={() => navigate("/devices")}
            >
              <ListItemIcon>
                {selectedNav === NavOptions.DEVICES ? (
                  <Icon path={mdiDevices} size={1} />
                ) : (
                  <Icon path={mdiDevices} size={1} />
                )}
              </ListItemIcon>
              <ListItemText primary={t("components.main_app_bar.devices")} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      {auth.user ? (
        <Menu anchorEl={anchorEl} open={isMenuOpened} onClose={handleCloseMenu}>
          <MenuItem
            selected={selectedNav === NavOptions.PROFILE}
            onClick={() => {
              handleCloseMenu()
              navigate("/profile")
            }}
          >
            <ListItemIcon>
              {selectedNav === NavOptions.PROFILE ? (
                <Icon path={mdiAccountCircle} size={1} />
              ) : (
                <Icon path={mdiAccountCircleOutline} size={1} />
              )}
            </ListItemIcon>
            {auth.user.username}
          </MenuItem>
          {auth.user.admin ? (
            <MenuItem
              selected={selectedNav === NavOptions.ADMIN}
              onClick={() => {
                handleCloseMenu()
                navigate("/admin")
              }}
            >
              <ListItemIcon>
                {selectedNav === NavOptions.ADMIN ? (
                  <Icon path={mdiShieldAccount} size={1} />
                ) : (
                  <Icon path={mdiShieldAccountOutline} size={1} />
                )}
              </ListItemIcon>
              {t("components.main_app_bar.admin")}
            </MenuItem>
          ) : null}
          <Divider />
          <MenuItem
            selected={selectedNav === NavOptions.SETTINGS}
            onClick={() => {
              handleCloseMenu()
              navigate("/settings")
            }}
          >
            <ListItemIcon>
              {selectedNav === NavOptions.SETTINGS ? (
                <Icon path={mdiCog} size={1} />
              ) : (
                <Icon path={mdiCogOutline} size={1} />
              )}
            </ListItemIcon>
            {t("components.main_app_bar.settings")}
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
            {t("components.main_app_bar.logout")}
          </MenuItem>
        </Menu>
      ) : null}
    </>
  )
}

function OnlocLogo({ sx, ...rest }: OnlocLogoProps) {
  const navigate = useNavigate()

  return (
    <Box
      onClick={() => navigate("/")}
      sx={{
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        ...sx,
      }}
      {...rest}
    >
      <img src={Logo} alt="Logo" height={32} />
      <Typography variant="h6" color="inherit" sx={{ fontWeight: 700 }}>
        Onloc
      </Typography>
    </Box>
  )
}
