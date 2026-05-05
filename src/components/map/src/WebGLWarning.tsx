import { Flex, Text } from "@mantine/core"
import { useTranslation } from "react-i18next"

export default function WebGLWarning() {
  const { t } = useTranslation()

  return (
    <Flex h="100%" w="100%" align="center" justify="center">
      <Text>{t("components.webgl_warning.label")}</Text>
    </Flex>
  )
}
