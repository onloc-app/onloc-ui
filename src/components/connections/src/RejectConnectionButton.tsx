import { rejectConnectionRequest } from "@/api"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"
import type { Connection } from "@/types/types"
import { ActionIcon } from "@mantine/core"
import { mdiAccountRemoveOutline, mdiCancel, mdiClose } from "@mdi/js"
import Icon from "@mdi/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface RejectConnectionButtonProps {
  connection: Connection
  mode?: "reject" | "remove" | "cancel"
}

export default function RejectConnectionButton({
  connection,
  mode = "reject",
}: RejectConnectionButtonProps) {
  const auth = useAuth()
  const queryClient = useQueryClient()

  const rejectConnectionRequestMutation = useMutation({
    mutationFn: () => rejectConnectionRequest(connection.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] })
      let message = "components.reject_connection_button.rejected"
      if (mode === "remove")
        message = "components.reject_connection_button.removed"
      if (mode === "cancel")
        message = "components.reject_connection_button.canceled"
      auth.throwMessage(message, Severity.SUCCESS)
    },
    onError: () => {
      let message = "components.reject_connection_button.errors.rejected"
      if (mode === "remove")
        message = "components.reject_connection_button.errors.removed"
      if (mode === "cancel")
        message = "components.reject_connection_button.errors.canceled"
      auth.throwMessage(message, Severity.ERROR)
    },
  })

  let icon = mdiClose
  if (mode === "remove") icon = mdiAccountRemoveOutline
  if (mode === "cancel") icon = mdiCancel

  return (
    <ActionIcon
      color="error.5"
      radius="md"
      onClick={() => rejectConnectionRequestMutation.mutate()}
    >
      <Icon path={icon} size={1} />
    </ActionIcon>
  )
}
