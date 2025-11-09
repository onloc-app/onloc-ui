import { ApiError, deleteApiKey } from "@/api"
import { useAuth } from "@/contexts/AuthProvider"
import { formatISODate } from "@/helpers/utils"
import { Severity } from "@/types/enums"
import type { ApiKey } from "@/types/types"
import { mdiContentCopy, mdiTrashCanOutline } from "@mdi/js"
import Icon from "@mdi/react"
import { Box, Typography, IconButton, Tooltip } from "@mui/material"
import { useTheme } from "@mui/system"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import DeleteApiKeyButton from "./DeleteApiKeyButton"

interface KeyRowProps {
  apiKey: ApiKey
}

export default function KeyRow({ apiKey }: KeyRowProps) {
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
            <Typography variant="body2" color="grey" alignContent="center">
              {formatISODate(apiKey.created_at)}
            </Typography>
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
                onClick={() => navigator.clipboard.writeText(apiKey.key)}
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
