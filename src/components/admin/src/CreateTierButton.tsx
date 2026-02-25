import { mdiPlus } from "@mdi/js"
import Icon from "@mdi/react"
import { useState, type FormEvent } from "react"
import MaxDevicesField from "./MaxDevicesField"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Tier } from "@/types/types"
import { postTier } from "@/api/src/tierApi"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"
import type { ApiError } from "@/api"
import { useTranslation } from "react-i18next"
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
      handleClose()
      resetForm()
      queryClient.invalidateQueries({ queryKey: ["tiers"] })
    },
    onError: (error: ApiError) => {
      auth.throwMessage(error.message, Severity.ERROR)
    },
  })

  const [opened, setOpened] = useState<boolean>(false)
  const [name, setName] = useState<string>("")
  const [nameError, setNameError] = useState<string>("")
  const [maxDevices, setMaxDevices] = useState<number | null>(null)

  const resetForm = () => {
    setName("")
    setNameError("")
    setMaxDevices(null)
  }

  const handleOpen = () => setOpened(true)
  const handleClose = () => setOpened(false)

  const handleCreateTier = (event: FormEvent) => {
    event.preventDefault()

    setNameError("")

    if (name.trim() !== "") {
      postTierMutation.mutate({
        id: -1n,
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
        label={t("components.create_tier_button.tooltip")}
        position="right"
      >
        <ActionIcon onClick={handleOpen}>
          <Icon path={mdiPlus} size={1} />
        </ActionIcon>
      </Tooltip>

      <Modal
        opened={opened}
        onClose={handleClose}
        title={t("components.create_tier_button.title")}
        centered
      >
        <form onSubmit={handleCreateTier}>
          <Group>
            <Stack w="100%" px="md">
              <TextInput
                label={t("components.create_tier_button.name_field.label")}
                error={nameError}
                withAsterisk
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <MaxDevicesField
                withAsterisk
                value={maxDevices}
                onChange={setMaxDevices}
              />
            </Stack>
          </Group>
          <Space h="xl" />
          <Group justify="end" gap="xs">
            <Button variant="subtle" onClick={handleClose}>
              {t("components.create_tier_button.actions.cancel")}
            </Button>
            <Button type="submit" disabled={name.trim() === ""}>
              {t("components.create_tier_button.actions.create")}
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  )
}
