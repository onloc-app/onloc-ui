import type { ApiError } from "@/api"
import { deleteTier } from "@/api/src/tierApi"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"
import type { Tier } from "@/types/types"
import { ActionIcon, Button, Modal, Text } from "@mantine/core"
import { mdiTrashCanOutline } from "@mdi/js"
import { Icon } from "@mdi/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import classes from "./DeleteTierButton.module.css"

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
      handleClose()
      queryClient.invalidateQueries({ queryKey: ["tiers"] })
      queryClient.invalidateQueries({ queryKey: ["admin_users"] })
      queryClient.invalidateQueries({ queryKey: ["server_settings"] })
    },
    onError: (error: ApiError) =>
      auth.throwMessage(error.message, Severity.ERROR),
  })

  const [opened, setOpened] = useState<boolean>(false)

  const handleOpen = () => setOpened(true)
  const handleClose = () => setOpened(false)

  const handleDeleteTier = () => {
    deleteTierMutation.mutate()
  }

  return (
    <>
      <ActionIcon color="error.5" onClick={handleOpen}>
        <Icon path={mdiTrashCanOutline} size={1} />
      </ActionIcon>

      <Modal
        opened={opened}
        onClose={handleClose}
        title={t("components.delete_tier_button.title", { name: tier.name })}
        centered
      >
        <div className={classes["container"]}>
          <Text>
            {t("components.delete_tier_button.description", {
              name: tier.name,
            })}
          </Text>
          <div className={classes["container__actions"]}>
            <Button variant="subtle" onClick={handleClose}>
              {t("components.delete_tier_button.actions.cancel")}
            </Button>
            <Button color="error.5" onClick={handleDeleteTier}>
              {t("components.delete_tier_button.actions.delete")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
