import { ApiError, deleteApiKey } from "@/api"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"
import type { ApiKey } from "@/types/types"
import { ActionIcon, Button, Group, Modal, Tooltip } from "@mantine/core"
import { mdiDeleteOutline } from "@mdi/js"
import Icon from "@mdi/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"

interface DeleteApiKeyButtonProps {
  apiKey: ApiKey
}

export default function DeleteApiKeyButton({
  apiKey,
}: DeleteApiKeyButtonProps) {
  const auth = useAuth()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const [opened, setOpened] = useState<boolean>(false)

  const deleteApiKeyMutation = useMutation({
    mutationFn: () => deleteApiKey(apiKey.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api_keys"] })
      handleClose()
    },
    onError: (error: ApiError) => {
      auth?.throwMessage(error.message, Severity.ERROR)
    },
  })

  const handleOpen = () => {
    setOpened(true)
  }

  const handleClose = () => {
    setOpened(false)
  }

  return (
    <>
      <Tooltip
        label={`${t("components.delete_api_key_button.delete")} ${apiKey.name}`}
        openDelay={500}
        position="top"
      >
        <ActionIcon onClick={handleOpen} color="error.7">
          <Icon path={mdiDeleteOutline} size={1} />
        </ActionIcon>
      </Tooltip>

      <Modal
        opened={opened}
        onClose={handleClose}
        title={t("components.delete_api_key_button.title", {
          name: apiKey.name,
        })}
        centered
      >
        <Group justify="end" gap="xs">
          <Button variant="subtle" onClick={handleClose}>
            {t("components.delete_api_key_button.cancel")}
          </Button>
          <Button
            color="error.5"
            onClick={() => {
              deleteApiKeyMutation.mutate()
            }}
          >
            {t("components.delete_api_key_button.delete")}
          </Button>
        </Group>
      </Modal>
    </>
  )
}
