import type { ApiError } from "@/api"
import { deleteTier } from "@/api/src/tierApi"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"
import type { Tier } from "@/types/types"
import { mdiTrashCanOutline } from "@mdi/js"
import Icon from "@mdi/react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"

interface DeleteTierButtonProps {
  tier: Tier
}

export default function DeleteTierButton({ tier }: DeleteTierButtonProps) {
  const queryClient = useQueryClient()
  const auth = useAuth()
  const { t } = useTranslation()

  const deleteTierMutation = useMutation({
    mutationFn: () => deleteTier(tier.id),
    onSuccess: () => {
      handleDialogClose()
      queryClient.invalidateQueries({ queryKey: ["tiers"] })
      queryClient.invalidateQueries({ queryKey: ["admin_users"] })
    },
    onError: (error: ApiError) =>
      auth.throwMessage(error.message, Severity.ERROR),
  })

  const [dialogOpened, setDialogOpened] = useState<boolean>(false)

  const handleDialogOpen = () => setDialogOpened(true)
  const handleDialogClose = () => setDialogOpened(false)

  const handleDeleteTier = () => {
    deleteTierMutation.mutate()
  }

  return (
    <>
      <IconButton color="error" onClick={handleDialogOpen}>
        <Icon path={mdiTrashCanOutline} size={1} />
      </IconButton>
      <Dialog open={dialogOpened} onClose={handleDialogClose}>
        <DialogTitle>
          {t("components.delete_tier_button.title", { name: tier.name })}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("components.delete_tier_button.description", {
              name: tier.name,
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>
            {t("components.delete_tier_button.actions.cancel")}
          </Button>
          <Button onClick={handleDeleteTier} variant="contained" color="error">
            {t("components.delete_tier_button.actions.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
