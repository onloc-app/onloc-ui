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
import { useTranslation } from "react-i18next"

export default function CreateApiKeyButton() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const [dialogOpened, setDialogOpened] = useState<boolean>(false)
  const [apiKeyName, setApiKeyName] = useState<string>("")
  const [apiKeyNameError, setApiKeyNameError] = useState<string>("")

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

    setApiKeyNameError("")
    if (apiKeyName.trim().length > 0) {
      postApiKeyMutation.mutate()
    } else {
      setApiKeyNameError("components.create_api_key_button.name_required")
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
      <Tooltip
        title={t("components.create_api_key_button.title")}
        enterDelay={500}
        placement="right"
      >
        <IconButton onClick={() => handleDialogOpen()}>
          <Icon path={mdiPlus} size={1} />
        </IconButton>
      </Tooltip>
      <Dialog open={dialogOpened} onClose={handleDialogClose}>
        <form onSubmit={handleCreateApiKey}>
          <DialogTitle>
            {t("components.create_api_key_button.title")}
          </DialogTitle>
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
                label={t("components.create_api_key_button.name")}
                required
                size="small"
                error={apiKeyNameError !== ""}
                helperText={t(apiKeyNameError)}
                value={apiKeyName}
                onChange={(e) => setApiKeyName(e.target.value)}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>
              {t("components.create_api_key_button.cancel")}
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateApiKey}
              type="submit"
            >
              {t("components.create_api_key_button.create")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
