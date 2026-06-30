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
  FloatingIndicator,
  Tabs,
  TabsList,
  TabsTab,
  Typography,
  useMantineTheme,
  type MantineStyleProp,
} from "@mantine/core"
import { usePrevious } from "@mantine/hooks"
import {
  mdiAccountMultiple,
  mdiAccountMultipleOutline,
  mdiDevices,
  mdiMap,
  mdiMapOutline,
  mdiViewDashboard,
  mdiViewDashboardOutline,
} from "@mdi/js"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Outlet, useLocation, useNavigate } from "react-router-dom"

const HEADER_HEIGHT = 64

interface NavButtonsProps {
  selectedNav?: NavOptions | null
  orientation?: "horizontal" | "vertical"
}

export default function MainAppShell() {
  const auth = useAuth()
  const location = useLocation()

  const selectedNav = useMemo(() => {
    const path = location.pathname.replace("/", "")
    return path as NavOptions
  }, [location.pathname])

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
          <Box visibleFrom="md">
            <NavButtons selectedNav={selectedNav} />
          </Box>
          <Flex align="center" gap="xs">
            <LanguageSelect />
            <ThemeToggle />
            <AccountButton selectedNav={selectedNav} />
          </Flex>
        </Flex>
      </AppShellHeader>
      <AppShellNavbar p="xs">
        <NavButtons selectedNav={selectedNav} orientation="vertical" />
      </AppShellNavbar>
      <AppShellMain>
        <Box h={`calc(100dvh - ${HEADER_HEIGHT}px - 24px)`} w="100%">
          <Outlet />
        </Box>
      </AppShellMain>
    </AppShell>
  )
}

function NavButtons({
  selectedNav,
  orientation = "horizontal",
}: NavButtonsProps) {
  const { t } = useTranslation()
  const theme = useMantineTheme()
  const navigate = useNavigate()

  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null)
  const [controlsRefs, setControlsRefs] = useState<
    Record<string, HTMLButtonElement | null>
  >({})
  const setControlRef = (val: string) => (node: HTMLButtonElement) => {
    controlsRefs[val] = node
    setControlsRefs(controlsRefs)
  }

  const tabStyle: MantineStyleProp = {
    zIndex: 1,
  }

  // Don't animate the indicator if the last nav was not part of the header.
  const previousNav = usePrevious(selectedNav)
  const animate = useMemo(() => {
    if (
      previousNav === NavOptions.DASHBOARD ||
      previousNav === NavOptions.MAP ||
      previousNav === NavOptions.DEVICES ||
      previousNav === NavOptions.CONNECTIONS
    ) {
      return true
    }
  }, [previousNav])

  return (
    <Tabs
      variant="none"
      value={selectedNav}
      onChange={(v) => navigate(`/${v}`)}
      orientation={orientation}
    >
      <TabsList ref={setRootRef} pos="relative" w="100%">
        <TabsTab
          value={NavOptions.DASHBOARD}
          ref={setControlRef(NavOptions.DASHBOARD)}
          style={tabStyle}
        >
          <NavButton
            label={t("components.main_app_bar.dashboard")}
            isSelected={selectedNav === NavOptions.DASHBOARD}
            notSelectedIcon={mdiViewDashboardOutline}
            selectedIcon={mdiViewDashboard}
          />
        </TabsTab>
        <TabsTab
          value={NavOptions.MAP}
          ref={setControlRef(NavOptions.MAP)}
          style={tabStyle}
        >
          <NavButton
            label={t("components.main_app_bar.map")}
            isSelected={selectedNav === NavOptions.MAP}
            notSelectedIcon={mdiMapOutline}
            selectedIcon={mdiMap}
          />
        </TabsTab>
        <TabsTab
          value={NavOptions.DEVICES}
          ref={setControlRef(NavOptions.DEVICES)}
          style={tabStyle}
        >
          <NavButton
            label={t("components.main_app_bar.devices")}
            isSelected={selectedNav === NavOptions.DEVICES}
            notSelectedIcon={mdiDevices}
            selectedIcon={mdiDevices}
          />
        </TabsTab>
        <TabsTab
          value={NavOptions.CONNECTIONS}
          ref={setControlRef(NavOptions.CONNECTIONS)}
          style={tabStyle}
        >
          <NavButton
            label={t("components.main_app_bar.connections")}
            isSelected={selectedNav === NavOptions.CONNECTIONS}
            notSelectedIcon={mdiAccountMultipleOutline}
            selectedIcon={mdiAccountMultiple}
          />
        </TabsTab>

        <FloatingIndicator
          target={selectedNav ? controlsRefs[selectedNav] : null}
          parent={rootRef}
          style={{
            backgroundColor: theme.colors.brand[3],
            borderRadius: theme.radius.md,
          }}
          transitionDuration={!animate ? 0 : undefined}
        />
      </TabsList>
    </Tabs>
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
