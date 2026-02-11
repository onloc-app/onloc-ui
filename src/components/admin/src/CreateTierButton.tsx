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
import { useState, type FormEvent } from "react"
import MaxDevicesField from "./MaxDevicesField"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Tier } from "@/types/types"
import { postTier } from "@/api/src/tierApi"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"
import type { ApiError } from "@/api"
import { useTranslation } from "react-i18next"

export default function CreateTierButton() {
  const auth = useAuth()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const postTierMutation = useMutation({
    mutationFn: (tier: Tier) => {
      return postTier(tier)
    },
    onSuccess: () => {
      auth?.throwMessage("Tier created", Severity.SUCCESS)
      handleDialogClose()
      resetForm()
      queryClient.invalidateQueries({ queryKey: ["tiers"] })
    },
    onError: (error: ApiError) => {
      auth.throwMessage(error.message, Severity.ERROR)
    },
  })

  const [dialogOpened, setDialogOpened] = useState<boolean>(false)
  const [name, setName] = useState<string>("")
  const [nameError, setNameError] = useState<string>("")
  const [maxDevices, setMaxDevices] = useState<number | null>(null)

  const resetForm = () => {
    setName("")
    setNameError("")
    setMaxDevices(null)
  }

  const handleDialogOpen = () => setDialogOpened(true)
  const handleDialogClose = () => setDialogOpened(false)

  const handleCreateTier = (event: FormEvent) => {
    event.preventDefault()

    setNameError("")

    if (name.trim() !== "") {
      postTierMutation.mutate({
        id: "-1",
        name: name,
        max_devices: maxDevices,
        order_rank: -1,
      })
    } else {
      setNameError("Name is required")
    }
  }

  return (
    <>
      <Tooltip
        title={t("components.create_tier_button.tooltip")}
        placement="right"
      >
        <IconButton onClick={handleDialogOpen}>
          <Icon path={mdiPlus} size={1} />
        </IconButton>
      </Tooltip>
      <Dialog open={dialogOpened} onClose={handleDialogClose}>
        <form onSubmit={handleCreateTier}>
          <DialogTitle>{t("components.create_tier_button.title")}</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                marginY: 2,
              }}
            >
              <TextField
                label={t("components.create_tier_button.name_field.label")}
                size="small"
                error={nameError !== ""}
                helperText={nameError}
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <MaxDevicesField
                value={maxDevices}
                required
                onChange={setMaxDevices}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>
              {t("components.create_tier_button.actions.cancel")}
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateTier}
              type="submit"
            >
              {t("components.create_tier_button.actions.create")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
