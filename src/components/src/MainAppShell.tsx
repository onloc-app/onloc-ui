import {
  AccountButton,
  LanguageSelect,
  NavButton,
  OnlocIcon,
  ThemeToggle,
} from "@/components"
import { useAuth } from "@/hooks/useAuth"
import { NavOptions } from "@/types/enums"
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  Box,
  Burger,
  Flex,
  Typography,
} from "@mantine/core"
import {
  mdiAccountMultiple,
  mdiAccountMultipleOutline,
  mdiDevices,
  mdiMap,
  mdiMapOutline,
  mdiViewDashboard,
  mdiViewDashboardOutline,
} from "@mdi/js"
import { useState, type ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

const HEADER_HEIGHT = 64

interface MainAppShellProps {
  selectedNav?: NavOptions
  children?: ReactNode
}

interface NavButtonsProps {
  selectedNav?: NavOptions
}

interface NavTitleProps {
  title: string
}

export default function MainAppShell({
  selectedNav,
  children,
}: MainAppShellProps) {
  const auth = useAuth()

  const [navbarOpened, setNavbarOpened] = useState(false)

  if (!auth.user || !auth.user.username) return

  return (
    <AppShell
      padding="sm"
      header={{ height: HEADER_HEIGHT }}
      navbar={{
        width: 200,
        breakpoint: "md",
        collapsed: {
          mobile: !navbarOpened,
          desktop: true,
        },
      }}
    >
      <AppShellHeader>
        <Flex
          direction="row"
          justify="space-between"
          align="center"
          p="sm"
          h="100%"
        >
          <Flex align="center">
            <Burger
              opened={navbarOpened}
              onClick={() => setNavbarOpened(!navbarOpened)}
              hiddenFrom="md"
              size="sm"
            />
            <OnlocLogo />
          </Flex>
          <Flex gap="xs" visibleFrom="md">
            <NavButtons selectedNav={selectedNav} />
          </Flex>
          <Flex gap="xs">
            <LanguageSelect />
            <ThemeToggle />
            <AccountButton selectedNav={selectedNav} />
          </Flex>
        </Flex>
      </AppShellHeader>
      <AppShellNavbar>
        <Flex direction="column" gap="xs" p="xs">
          <NavButtons selectedNav={selectedNav} />
        </Flex>
      </AppShellNavbar>
      <AppShellMain>
        <Box h={`calc(100dvh - ${HEADER_HEIGHT}px - 24px)`} w="100%">
          {children}
        </Box>
      </AppShellMain>
    </AppShell>
  )
}

function NavButtons({ selectedNav }: NavButtonsProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <>
      <NavButton
        isSelected={selectedNav === NavOptions.DASHBOARD}
        notSelectedIcon={mdiViewDashboardOutline}
        selectedIcon={mdiViewDashboard}
        onClick={() => navigate("/dashboard")}
      >
        <NavTitle title={t("components.main_app_bar.dashboard")} />
      </NavButton>
      <NavButton
        isSelected={selectedNav === NavOptions.MAP}
        notSelectedIcon={mdiMapOutline}
        selectedIcon={mdiMap}
        onClick={() => navigate("/map")}
      >
        <NavTitle title={t("components.main_app_bar.map")} />
      </NavButton>
      <NavButton
        isSelected={selectedNav === NavOptions.DEVICES}
        notSelectedIcon={mdiDevices}
        selectedIcon={mdiDevices}
        onClick={() => navigate("/devices")}
      >
        <NavTitle title={t("components.main_app_bar.devices")} />
      </NavButton>
      <NavButton
        isSelected={selectedNav === NavOptions.CONNECTIONS}
        notSelectedIcon={mdiAccountMultipleOutline}
        selectedIcon={mdiAccountMultiple}
        onClick={() => navigate("/connections")}
      >
        <NavTitle title={t("components.main_app_bar.connections")} />
      </NavButton>
    </>
  )
}

function OnlocLogo() {
  const navigate = useNavigate()

  return (
    <Flex
      onClick={() => navigate("/")}
      justify="center"
      align="center"
      style={{ cursor: "pointer" }}
    >
      <OnlocIcon size={1.5} />
      <Typography fz={20} fw={700}>
        Onloc
      </Typography>
    </Flex>
  )
}

function NavTitle({ title }: NavTitleProps) {
  return (
    <Typography
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        minWidth: 0,
      }}
    >
      {title}
    </Typography>
  )
}
