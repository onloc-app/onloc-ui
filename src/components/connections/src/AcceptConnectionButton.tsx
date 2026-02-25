import { acceptConnectionRequest } from "@/api"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"
import type { Connection } from "@/types/types"
import { ActionIcon } from "@mantine/core"
import { mdiCheck } from "@mdi/js"
import Icon from "@mdi/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface AcceptConnectionButtonProps {
  connection: Connection
}

export default function AcceptConnectionButton({
  connection,
}: AcceptConnectionButtonProps) {
  const auth = useAuth()
  const queryClient = useQueryClient()

  const acceptConnectionRequestMutation = useMutation({
    mutationFn: () => acceptConnectionRequest(connection.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] })
      auth.throwMessage(
        "components.accept_connection_button.accepted",
        Severity.SUCCESS,
      )
    },
    onError: () => {
      auth.throwMessage(
        "components.accept_connection_button.error",
        Severity.ERROR,
      )
    },
  })

  return (
    <ActionIcon
      color="success.3"
      radius="md"
      onClick={() => acceptConnectionRequestMutation.mutate()}
    >
      <Icon path={mdiCheck} size={1} />
    </ActionIcon>
  )
}
