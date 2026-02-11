import i18n from "@/i18n"
import { mdiTranslate } from "@mdi/js"
import Icon from "@mdi/react"
import { IconButton, Menu, MenuItem } from "@mui/material"
import { useState } from "react"
import { useTranslation } from "react-i18next"

export default function LanguageSelect() {
  const { t } = useTranslation()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleChangeLanguage = (code: string) => {
    handleClose()
    i18n.changeLanguage(code)
  }

  const availableLanguageCodes: string[] = ["en", "fr"]

  return (
    <>
      <IconButton onClick={handleOpen} color="inherit">
        <Icon path={mdiTranslate} size={1} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {availableLanguageCodes.map((code) => {
          return (
            <MenuItem key={code} onClick={() => handleChangeLanguage(code)}>
              {t(`components.language_select.${code}`)}
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}
