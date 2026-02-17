import { postApiKey } from "@/api"
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Space,
  Stack,
  TextInput,
  Tooltip,
} from "@mantine/core"
import { mdiPlus } from "@mdi/js"
import Icon from "@mdi/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, type SubmitEventHandler } from "react"
import { useTranslation } from "react-i18next"

export default function CreateApiKeyButton() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const [opened, setOpened] = useState<boolean>(false)
  const [apiKeyName, setApiKeyName] = useState<string>("")
  const [apiKeyNameError, setApiKeyNameError] = useState<string>("")

  const postApiKeyMutation = useMutation({
    mutationFn: () => postApiKey(apiKeyName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api_keys"] })
      handleClose()
      setApiKeyName("")
    },
  })

  const handleCreateApiKey: SubmitEventHandler<HTMLFormElement> = async (
    e?,
  ) => {
    e?.preventDefault()

    setApiKeyNameError("")
    if (apiKeyName.trim().length > 0) {
      postApiKeyMutation.mutate()
    } else {
      setApiKeyNameError("components.create_api_key_button.name_required")
    }
  }

  const handleOpen = () => {
    setOpened(true)
  }

  const handleClose = () => {
    setOpened(false)
  }

  return (
    <>
      <Tooltip
        label={t("components.create_api_key_button.title")}
        openDelay={500}
        position="right"
      >
        <ActionIcon onClick={() => handleOpen()}>
          <Icon path={mdiPlus} size={1} />
        </ActionIcon>
      </Tooltip>

      <Modal
        opened={opened}
        onClose={handleClose}
        title={t("components.create_api_key_button.title")}
        centered
      >
        <form onSubmit={handleCreateApiKey}>
          <Group gap="xs">
            <Stack>
              <TextInput
                label={t("components.create_api_key_button.name")}
                withAsterisk
                error={t(apiKeyNameError)}
                value={apiKeyName}
                onChange={(e) => setApiKeyName(e.target.value)}
              />
            </Stack>
          </Group>
          <Space h="lg" />
          <Group justify="end" gap="xs">
            <Button variant="subtle" onClick={handleClose}>
              {t("components.create_api_key_button.cancel")}
            </Button>
            <Button type="submit">
              {t("components.create_api_key_button.create")}
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  )
}
