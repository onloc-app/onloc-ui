import {
  ApiError,
  getConnections,
  getUsers,
  sendConnectionRequest,
} from "@/api"
import { sortUsers } from "@/helpers/utils"
import { useAuth } from "@/hooks/useAuth"
import { ConnectionStatus, Severity } from "@/types/enums"
import { type Connection, type User } from "@/types/types"
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Select,
  Space,
  Stack,
  Tooltip,
} from "@mantine/core"
import { mdiPlus } from "@mdi/js"
import Icon from "@mdi/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo, useState, type SubmitEventHandler } from "react"
import { useTranslation } from "react-i18next"

export default function AddConnectionButton() {
  const auth = useAuth()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const { data: users } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  })

  const formattedUsers = useMemo(() => {
    if (!users) return []
    return sortUsers(users.filter((user) => user.id !== auth.user?.id))
  }, [users, auth])

  const { data: connections } = useQuery<Connection[]>({
    queryKey: ["connections"],
    queryFn: () => getConnections(),
  })

  const sendConnectionRequestMutation = useMutation({
    mutationFn: (id: bigint) => sendConnectionRequest(id),
    onSuccess: () => {
      auth.throwMessage(
        "components.add_connection_button.connection_added",
        Severity.SUCCESS,
      )
      handleClose()
      resetForm()
      queryClient.invalidateQueries({ queryKey: ["connections"] })
    },
    onError: (error: ApiError) => {
      if (error.status === 400) {
        auth.throwMessage(
          "components.add_connection_button.connection_exists",
          Severity.ERROR,
        )
      } else {
        auth.throwMessage(error.message, Severity.ERROR)
      }
    },
  })

  const [addresseeId, setAddresseeId] = useState<bigint | null>(null)
  const resetForm = () => {
    setAddresseeId(null)
  }

  const [opened, setOpened] = useState(false)
  const handleOpen = () => setOpened(true)
  const handleClose = () => setOpened(false)

  const handleAddConnection: SubmitEventHandler = (e?) => {
    e?.preventDefault()

    if (!addresseeId) return

    sendConnectionRequestMutation.mutate(addresseeId)
  }

  const haveConnection = (user: User): boolean => {
    const connection =
      connections?.find(
        (u) => u.requester_id === user.id || u.addressee_id === user.id,
      ) ?? null
    return (
      connection !== null && connection.status !== ConnectionStatus.REJECTED
    )
  }

  const options = formattedUsers
    .filter((user) => !haveConnection(user))
    .map((user) => ({
      label: user.username!,
      value: user.id.toString(),
    }))

  if (!users) return

  return (
    <>
      <Tooltip
        label={t("components.add_connection_button.title")}
        openDelay={500}
        position="right"
      >
        <ActionIcon onClick={handleOpen}>
          <Icon path={mdiPlus} size={1} />
        </ActionIcon>
      </Tooltip>

      <Modal
        opened={opened}
        onClose={handleClose}
        title={t("components.add_connection_button.title")}
        centered
      >
        <form onSubmit={handleAddConnection}>
          <Group>
            <Stack w="100%" px="md">
              <Select
                withAsterisk
                label={t("components.add_connection_button.select_label")}
                data={options}
                value={addresseeId?.toString() ?? null}
                onChange={(value) =>
                  setAddresseeId(value ? BigInt(value) : null)
                }
                clearable
                searchable
                checkIconPosition="right"
              />
            </Stack>
          </Group>
          <Space h="xl" />
          <Group justify="end" gap="xs">
            <Button variant="subtle" onClick={handleClose}>
              {t("components.add_connection_button.cancel")}
            </Button>
            <Button type="submit" disabled={!addresseeId}>
              {t("components.add_connection_button.send")}
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  )
}
