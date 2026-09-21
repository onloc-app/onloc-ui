import {
  AccountButton,
  LanguageSelect,
  NavButton,
  OnlocLogo,
  ThemeToggle,
} from "@/components"
import { useAuth } from "@/hooks/useAuth"
import { NavOptions } from "@/types/enums"
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  Burger,
  FloatingIndicator,
  Tabs,
  TabsList,
  TabsTab,
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
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import classes from "./MainAppShell.module.css"

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

  // Closes the sidebar when navigating to a new page.
  useEffect(() => {
    setNavbarOpened(false)
  }, [selectedNav])

  if (!auth.user || !auth.user.username) return

  return (
    <AppShell
      className={classes.shell}
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
        <div className={classes.header}>
          <div className={classes.header_leftSection}>
            <Burger
              className={classes.header_leftSection_burger}
              opened={navbarOpened}
              onClick={() => setNavbarOpened(!navbarOpened)}
              size="sm"
            />
            <OnlocLogo />
          </div>
          <div className={classes.header_centerSection}>
            <NavButtons selectedNav={selectedNav} />
          </div>
          <div className={classes.header_rightSection}>
            <LanguageSelect />
            <ThemeToggle />
            <AccountButton selectedNav={selectedNav} />
          </div>
        </div>
      </AppShellHeader>
      <AppShellNavbar>
        <NavButtons selectedNav={selectedNav} orientation="vertical" />
      </AppShellNavbar>
      <AppShellMain>
        <div className={classes.content}>
          <Outlet />
        </div>
      </AppShellMain>
    </AppShell>
  )
}

function NavButtons({
  selectedNav,
  orientation = "horizontal",
}: NavButtonsProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null)
  const [controlsRefs, setControlsRefs] = useState<
    Record<string, HTMLButtonElement | null>
  >({})
  const setControlRef = (val: string) => (node: HTMLButtonElement) => {
    controlsRefs[val] = node
    setControlsRefs(controlsRefs)
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

  const generateClasses = (nav: NavOptions): string => {
    return `${classes.tab} ${selectedNav === nav && classes.selectedTab}`
  }

  return (
    <Tabs
      variant="none"
      value={selectedNav}
      onChange={(v) => navigate(`/${v}`)}
      orientation={orientation}
    >
      <TabsList ref={setRootRef} className={classes.tabsList}>
        <TabsTab
          value={NavOptions.DASHBOARD}
          ref={setControlRef(NavOptions.DASHBOARD)}
          className={generateClasses(NavOptions.DASHBOARD)}
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
          className={generateClasses(NavOptions.MAP)}
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
          className={generateClasses(NavOptions.DEVICES)}
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
          className={generateClasses(NavOptions.CONNECTIONS)}
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
          transitionDuration={!animate ? 0 : undefined}
          className={classes.indicator}
        />
      </TabsList>
    </Tabs>
  )
}
