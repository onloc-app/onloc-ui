import { Button, Flex, Typography } from "@mantine/core"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

const NotFound = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Flex h="100vh" direction="column" align="center" justify="center" gap="xs">
      <Typography fz={24} fw={500} ta="center">
        {t("pages.not_found.title")}
      </Typography>
      <Button onClick={() => navigate("/")}>
        {t("pages.not_found.go_back_button_label")}
      </Button>
    </Flex>
  )
}

export default NotFound
