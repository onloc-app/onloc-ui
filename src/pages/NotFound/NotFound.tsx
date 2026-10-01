import { Button, Text } from "@mantine/core"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import classes from "./NotFound.module.css"

const NotFound = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className={classes["container"]}>
      <Text className={classes["container__text"]}>
        {t("pages.not_found.title")}
      </Text>
      <Button onClick={() => navigate("/")}>
        {t("pages.not_found.go_back_button_label")}
      </Button>
    </div>
  )
}

export default NotFound
