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

interface DeleteTierButtonProps {
  tier: Tier
}

export default function DeleteTierButton({ tier }: DeleteTierButtonProps) {
  const queryClient = useQueryClient()
  const auth = useAuth()

  const deleteTierMutation = useMutation({
    mutationFn: () => deleteTier(tier.id),
    onSuccess: () => {
      handleDialogClose()
      queryClient.invalidateQueries({ queryKey: ["tiers"] })
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
        <DialogTitle>Delete {tier.name} tier?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Tier ${tier.name} will be permanently deleted. Are you sure you want to continue?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteTier} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
