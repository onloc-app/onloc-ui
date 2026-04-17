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

export default function LanguageSelect() {
  const handleChangeLanguage = (code: string) => i18n.changeLanguage(code)

  const getNativeLanguageName = (code: string) => {
    const name = new Intl.DisplayNames([code], {
      type: "language",
    }).of(code)

    return name ? name[0].toUpperCase() + name.substring(1) : code
  }
  const availableLanguageCodes = (i18n.options.supportedLngs || []).filter(
    (lng) => lng !== "cimode",
  )

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
              {getNativeLanguageName(code)}
            </MenuItem>
          )
        })}
      </MenuDropdown>
    </Menu>
  )
}
