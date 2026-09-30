import { deleteLocationsByUserId } from "@/api"
import type { User } from "@/types/types"
import { ActionIcon, Button, Modal, Text, Tooltip } from "@mantine/core"
import { mdiMapMarkerRemoveOutline } from "@mdi/js"
import { Icon } from "@mdi/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import classes from "./DeleteUserLocationsButton.module.css"

interface DeleteUserLocationsButtonProps {
  user: User
  disabled?: boolean
}

export default function DeleteUserLocationsButton({
  user,
  disabled = false,
}: DeleteUserLocationsButtonProps) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const [opened, setOpened] = useState<boolean>(false)

  const deleteLocationsMutation = useMutation({
    mutationFn: (id: bigint) => {
      return deleteLocationsByUserId(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_users"] })
      handleClose()
    },
  })

  const handleDeleteLocations = () => {
    deleteLocationsMutation.mutate(user.id)
  }

  const handleOpen = () => setOpened(true)
  const handleClose = () => setOpened(false)

  return (
    <>
      <Tooltip label={t("components.delete_user_locations_button.tooltip")}>
        <ActionIcon onClick={handleOpen} disabled={disabled}>
          <Icon path={mdiMapMarkerRemoveOutline} size={1} />
        </ActionIcon>
      </Tooltip>

      <Modal
        opened={opened}
        onClose={handleClose}
        title={t("components.delete_user_locations_button.title")}
        centered
      >
        <div className={classes["container"]}>
          <Text>
            {t("components.delete_user_locations_button.description", {
              username: user.username,
            })}
          </Text>
          <div className={classes["container__actions"]}>
            <Button variant="subtle" onClick={handleClose}>
              {t("components.delete_user_locations_button.actions.cancel")}
            </Button>
            <Button onClick={handleDeleteLocations} color="error.5">
              {t("components.delete_user_locations_button.actions.delete")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
