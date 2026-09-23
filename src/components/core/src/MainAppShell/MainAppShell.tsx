import {
  AccountButton,
  LanguageSelect,
  NavButtons,
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
} from "@mantine/core"
import { useEffect, useMemo, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import classes from "./MainAppShell.module.css"

const HEADER_HEIGHT = 64

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
      className={classes["shell"]}
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
        <div className={classes["header"]}>
          <div className={classes["header__left-section"]}>
            <Burger
              className={classes["header__left-section__burger"]}
              opened={navbarOpened}
              onClick={() => setNavbarOpened(!navbarOpened)}
              size="sm"
            />
            <OnlocLogo />
          </div>
          <div className={classes["header__center-section"]}>
            <NavButtons selectedNav={selectedNav} />
          </div>
          <div className={classes["header__right-section"]}>
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
        <div className={classes["content"]}>
          <Outlet />
        </div>
      </AppShellMain>
    </AppShell>
  )
}
