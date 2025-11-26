import { formatISODate } from "@/helpers/utils"
import type { ApiKey } from "@/types/types"
import { mdiContentCopy } from "@mdi/js"
import Icon from "@mdi/react"
import { Box, Typography, IconButton, Tooltip } from "@mui/material"
import { useTheme } from "@mui/system"
import DeleteApiKeyButton from "./DeleteApiKeyButton"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"

interface KeyRowProps {
  apiKey: ApiKey
}

export default function KeyRow({ apiKey }: KeyRowProps) {
  const auth = useAuth()
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          width: 1,
          borderBottom: 1,
          borderColor: theme.palette.divider,
          padding: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="body1" alignContent="center">
              {apiKey.name}
            </Typography>
            {apiKey.created_at ? (
              <Typography variant="body2" color="gray" alignContent="center">
                {formatISODate(apiKey.created_at)}
              </Typography>
            ) : null}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Tooltip title="Copy to clipboard" enterDelay={500} placement="top">
              <IconButton
                onClick={() => {
                  try {
                    navigator.clipboard.writeText(apiKey.key)
                  } catch (error) {
                    if (error instanceof DOMException) {
                      auth.throwMessage(error.message, Severity.ERROR)
                    } else {
                      auth.throwMessage(
                        "Failed to copy API key",
                        Severity.ERROR,
                      )
                    }
                    console.error(error)
                  }
                }}
              >
                <Icon path={mdiContentCopy} size={1} />
              </IconButton>
            </Tooltip>
            <DeleteApiKeyButton apiKey={apiKey} />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: 1,
          padding: 1,
          overflow: "auto",
        }}
      >
        <Typography variant="body1">{apiKey.key}</Typography>
      </Box>
    </Box>
  )
}
