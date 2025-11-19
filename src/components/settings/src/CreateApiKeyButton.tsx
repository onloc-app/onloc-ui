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
  Tooltip,
} from "@mui/material"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, type FormEvent } from "react"

export default function CreateApiKeyButton() {
  const queryClient = useQueryClient()

  const [dialogOpened, setDialogOpened] = useState<boolean>(false)
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

  const handleCreateApiKey = async (event: FormEvent) => {
    event.preventDefault()

    setApiKeyNameError(null)
    if (apiKeyName.trim().length > 0) {
      postApiKeyMutation.mutate()
    } else {
      setApiKeyNameError("Required")
    }
  }

  const handleDialogOpen = () => {
    setDialogOpened(true)
  }

  const handleDialogClose = () => {
    setDialogOpened(false)
  }

  return (
    <>
      <Tooltip title="Create an API key" enterDelay={500} placement="right">
        <IconButton onClick={() => handleDialogOpen()}>
          <Icon path={mdiPlus} size={1} />
        </IconButton>
      </Tooltip>
      <Dialog open={dialogOpened} onClose={handleDialogClose}>
        <form onSubmit={handleCreateApiKey}>
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
              onClick={handleCreateApiKey}
              type="submit"
            >
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
