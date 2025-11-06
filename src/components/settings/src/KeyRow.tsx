import { ApiError, deleteApiKey } from "@/api"
import { useAuth } from "@/contexts/AuthProvider"
import { formatISODate } from "@/helpers/utils"
import { Severity } from "@/types/enums"
import type { ApiKey } from "@/types/types"
import { mdiContentCopy, mdiTrashCanOutline } from "@mdi/js"
import Icon from "@mdi/react"
import { Box, Typography, IconButton } from "@mui/material"
import { useTheme } from "@mui/system"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface KeyRowProps {
  apiKey: ApiKey
}

export default function KeyRow({ apiKey }: KeyRowProps) {
  const auth = useAuth()
  const theme = useTheme()
  const queryClient = useQueryClient()

  const deleteApiKeyMutation = useMutation({
    mutationFn: (id: number) => deleteApiKey(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["api_keys"] }),
    onError: (error: ApiError) => {
      auth?.throwMessage(error.message, Severity.ERROR)
    },
  })

  return (
    <Box
      key={apiKey.id}
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
              alignContent: "center",
              justifyContent: "start",
              gap: 1,
            }}
          >
            <IconButton
              onClick={() => navigator.clipboard.writeText(apiKey.key)}
            >
              <Icon path={mdiContentCopy} size={1} />
            </IconButton>
            <IconButton onClick={() => deleteApiKeyMutation.mutate(apiKey.id)}>
              <Icon path={mdiTrashCanOutline} size={1} />
            </IconButton>
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
