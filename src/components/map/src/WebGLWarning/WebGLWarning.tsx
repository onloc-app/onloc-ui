import { Text } from "@mantine/core"
import { useTranslation } from "react-i18next"
import classes from "./WebGLWarning.module.css"

export default function WebGLWarning() {
  const { t } = useTranslation()

  return (
    <div className={classes["container"]}>
      <Text>{t("components.webgl_warning.label")}</Text>
    </div>
  )
}
