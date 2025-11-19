import { ApiError, deleteApiKey } from "@/api"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"
import type { ApiKey } from "@/types/types"
import { mdiDeleteOutline } from "@mdi/js"
import Icon from "@mdi/react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

interface DeleteApiKeyButtonProps {
  apiKey: ApiKey
}

export default function DeleteApiKeyButton({
  apiKey,
}: DeleteApiKeyButtonProps) {
  const auth = useAuth()
  const queryClient = useQueryClient()

  const [opened, setIsOpened] = useState<boolean>(false)

  const deleteApiKeyMutation = useMutation({
    mutationFn: () => deleteApiKey(apiKey.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api_keys"] })
      handleDialogClose()
    },
    onError: (error: ApiError) => {
      auth?.throwMessage(error.message, Severity.ERROR)
    },
  })

  const handleDialogOpen = () => {
    setIsOpened(true)
  }

  const handleDialogClose = () => {
    setIsOpened(false)
  }

  return (
    <>
      <Tooltip title={`Delete ${apiKey.name}`} enterDelay={500} placement="top">
        <IconButton onClick={handleDialogOpen} color="error">
          <Icon path={mdiDeleteOutline} size={1} />
        </IconButton>
      </Tooltip>
      <Dialog open={opened} onClose={handleDialogClose}>
        <DialogTitle>Delete the API key for {apiKey.name}?</DialogTitle>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              deleteApiKeyMutation.mutate()
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
