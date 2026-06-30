import { formatISODate } from "@/helpers/utils"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"
import type { ApiKey } from "@/types/types"
import {
  ActionIcon,
  Box,
  Divider,
  Flex,
  Paper,
  Text,
  Tooltip,
} from "@mantine/core"
import { mdiContentCopy, mdiEyeOffOutline, mdiEyeOutline } from "@mdi/js"
import Icon from "@mdi/react"
import { useTranslation } from "react-i18next"
import DeleteApiKeyButton from "./DeleteApiKeyButton"
import { useToggle } from "@mantine/hooks"

interface KeyRowProps {
  apiKey: ApiKey
}

export default function KeyRow({ apiKey }: KeyRowProps) {
  const auth = useAuth()
  const { t } = useTranslation()

  const [visible, toggle] = useToggle()

  function generateInvisibleKey() {
    let str = ""
    for (let i = 0; i < apiKey.key.length; i++) {
      str += "•"
    }
    return str
  }

  return (
    <Paper withBorder>
      <Flex direction="column" justify="center" align="center">
        <Box w="100%" p="sm">
          <Flex align="center" justify="space-between" gap={8}>
            <Flex direction="column">
              <Text fz={{ base: 16, md: 20 }}>{apiKey.name}</Text>
              {apiKey.created_at && (
                <Text fz={{ base: 12, md: 14 }}>
                  {formatISODate(apiKey.created_at)}
                </Text>
              )}
            </Flex>
            <Flex align="center" gap={8}>
              <Tooltip
                label={t("components.key_row.copy_clipboard")}
                openDelay={500}
                position="top"
              >
                <ActionIcon
                  onClick={() => {
                    try {
                      navigator.clipboard.writeText(apiKey.key)
                      auth.throwMessage(
                        "components.key_row.copy_success",
                        Severity.SUCCESS,
                      )
                    } catch (error) {
                      if (error instanceof DOMException) {
                        auth.throwMessage(error.message, Severity.ERROR)
                      } else {
                        auth.throwMessage(
                          "components.key_row.copy_error",
                          Severity.ERROR,
                        )
                      }
                      console.error(error)
                    }
                  }}
                >
                  <Icon path={mdiContentCopy} size={1} />
                </ActionIcon>
              </Tooltip>
              <DeleteApiKeyButton apiKey={apiKey} />
            </Flex>
          </Flex>
        </Box>
        <Divider w="100%" />
        <Flex direction="row" gap="xs" align="center" w="100%" px="xs">
          <Box
            w="100%"
            p="sm"
            sx={{
              overflow: "auto",
            }}
          >
            <Text style={{ userSelect: !visible ? "none" : undefined }}>
              {visible ? apiKey.key : generateInvisibleKey()}
            </Text>
          </Box>
          <ActionIcon size="lg" onClick={() => toggle()}>
            {visible ? (
              <Icon path={mdiEyeOffOutline} size={1} />
            ) : (
              <Icon path={mdiEyeOutline} size={1} />
            )}
          </ActionIcon>
        </Flex>
      </Flex>
    </Paper>
  )
}
