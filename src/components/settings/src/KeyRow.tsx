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
  Tooltip,
  Typography,
} from "@mantine/core"
import { mdiContentCopy } from "@mdi/js"
import Icon from "@mdi/react"
import { useTranslation } from "react-i18next"
import DeleteApiKeyButton from "./DeleteApiKeyButton"

interface KeyRowProps {
  apiKey: ApiKey
}

export default function KeyRow({ apiKey }: KeyRowProps) {
  const auth = useAuth()
  const { t } = useTranslation()

  return (
    <Paper withBorder>
      <Flex direction="column" justify="center" align="center">
        <Box w="100%" p="sm">
          <Flex align="center" justify="space-between" gap={8}>
            <Flex direction="column">
              <Typography fz={{ base: 16, md: 20 }}>{apiKey.name}</Typography>
              {apiKey.created_at ? (
                <Typography fz={{ base: 12, md: 14 }}>
                  {formatISODate(apiKey.created_at)}
                </Typography>
              ) : null}
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
                    } catch (error) {
                      if (error instanceof DOMException) {
                        auth.throwMessage(error.message, Severity.ERROR)
                      } else {
                        auth.throwMessage(
                          t("components.key_row.copy_error"),
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
        <Box
          w="100%"
          p="sm"
          sx={{
            overflow: "auto",
          }}
        >
          <Typography>{apiKey.key}</Typography>
        </Box>
      </Flex>
    </Paper>
  )
}
