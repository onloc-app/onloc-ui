import { useAuth } from "@/hooks/useAuth"
import { NavOptions } from "@/types/enums"
import {
  ActionIcon,
  Menu,
  MenuDivider,
  MenuDropdown,
  MenuItem,
  MenuTarget,
} from "@mantine/core"
import {
  mdiAccountCircle,
  mdiAccountCircleOutline,
  mdiCog,
  mdiCogOutline,
  mdiLogout,
  mdiShieldAccount,
  mdiShieldAccountOutline,
} from "@mdi/js"
import Icon from "@mdi/react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

interface AccountButtonProps {
  selectedNav: string | undefined
}

interface CustomMenuItemProps {
  label: string
  selected: boolean
  icon: string
  selectedIcon: string
  onClick: () => void
}

export default function AccountButton({ selectedNav }: AccountButtonProps) {
  const auth = useAuth()
  const { user } = auth
  const { t } = useTranslation()
  const navigate = useNavigate()

  if (!user || !user.username) return

  return (
    <Menu position="bottom">
      <MenuTarget>
        <ActionIcon variant="subtle" size="xl" radius="xl">
          <Icon path={mdiAccountCircleOutline} size={1} />
        </ActionIcon>
      </MenuTarget>
      <MenuDropdown>
        <CustomMenuItem
          label={user.username}
          selected={selectedNav === NavOptions.PROFILE}
          icon={mdiAccountCircleOutline}
          selectedIcon={mdiAccountCircle}
          onClick={() => navigate("/profile")}
        />
        {user.admin ? (
          <CustomMenuItem
            label={t("components.main_app_bar.admin")}
            selected={selectedNav === NavOptions.ADMIN}
            icon={mdiShieldAccountOutline}
            selectedIcon={mdiShieldAccount}
            onClick={() => navigate("/admin")}
          />
        ) : null}
        <MenuDivider />
        <CustomMenuItem
          label={t("components.main_app_bar.settings")}
          selected={selectedNav === NavOptions.SETTINGS}
          icon={mdiCogOutline}
          selectedIcon={mdiCog}
          onClick={() => navigate("/settings")}
        />
        <MenuItem
          leftSection={<Icon path={mdiLogout} size={1} />}
          onClick={() => auth.logoutAction()}
        >
          {t("components.main_app_bar.logout")}
        </MenuItem>
      </MenuDropdown>
    </Menu>
  )
}

function CustomMenuItem({
  label,
  selected,
  icon,
  selectedIcon,
  onClick,
}: CustomMenuItemProps) {
  return (
    <MenuItem
      leftSection={
        selected ? (
          <Icon path={selectedIcon} size={1} />
        ) : (
          <Icon path={icon} size={1} />
        )
      }
      onClick={onClick}
    >
      {label}
    </MenuItem>
  )
}
