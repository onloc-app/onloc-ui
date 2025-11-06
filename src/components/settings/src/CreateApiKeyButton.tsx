import { postApiKey } from "@/api"
import { mdiPlus } from "@mdi/js"
import Icon from "@mdi/react"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

export default function CreateApiKeyButton() {
  const queryClient = useQueryClient()

  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [apiKeyName, setApiKeyName] = useState<string>("")
  const [apiKeyNameError, setApiKeyNameError] = useState<string | null>(null)

  const postApiKeyMutation = useMutation({
    mutationFn: () => postApiKey(apiKeyName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api_keys"] })
      handleDialogClose()
      setApiKeyName("")
    },
  })

  const handleDialogOpen = () => {
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  return (
    <>
      <IconButton onClick={() => handleDialogOpen()}>
        <Icon path={mdiPlus} size={1} />
      </IconButton>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Create an API Key</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              paddingTop: 1,
            }}
          >
            <TextField
              label="Name"
              required
              size="small"
              error={apiKeyNameError !== null}
              helperText={apiKeyNameError}
              value={apiKeyName}
              onChange={(e) => setApiKeyName(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              setApiKeyNameError(null)
              if (apiKeyName.trim().length > 0) {
                postApiKeyMutation.mutate()
              } else {
                setApiKeyNameError("Required")
              }
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
