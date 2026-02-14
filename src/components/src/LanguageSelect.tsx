import i18n from "@/i18n"
import {
  ActionIcon,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
} from "@mantine/core"
import { mdiTranslate } from "@mdi/js"
import Icon from "@mdi/react"
import { useTranslation } from "react-i18next"

export default function LanguageSelect() {
  const { t } = useTranslation()

  const handleChangeLanguage = (code: string) => i18n.changeLanguage(code)

  const availableLanguageCodes: string[] = ["en", "fr"]

  return (
    <Menu position="bottom">
      <MenuTarget>
        <ActionIcon variant="subtle" size="xl" radius="xl">
          <Icon path={mdiTranslate} size={1} />
        </ActionIcon>
      </MenuTarget>
      <MenuDropdown>
        {availableLanguageCodes.map((code) => {
          return (
            <MenuItem key={code} onClick={() => handleChangeLanguage(code)}>
              {t(`components.language_select.${code}`)}
            </MenuItem>
          )
        })}
      </MenuDropdown>
    </Menu>
  )
}
