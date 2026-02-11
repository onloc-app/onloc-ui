import { acceptConnectionRequest } from "@/api"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"
import type { Connection } from "@/types/types"
import { mdiCheck } from "@mdi/js"
import Icon from "@mdi/react"
import { IconButton } from "@mui/material"
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
    <IconButton
      color="success"
      sx={{ borderRadius: 2 }}
      onClick={() => acceptConnectionRequestMutation.mutate()}
    >
      <Icon path={mdiCheck} size={1} />
    </IconButton>
  )
}
