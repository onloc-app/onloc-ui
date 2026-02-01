import { rejectConnectionRequest } from "@/api"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"
import type { Connection } from "@/types/types"
import { mdiAccountRemoveOutline, mdiCancel, mdiClose } from "@mdi/js"
import Icon from "@mdi/react"
import { IconButton } from "@mui/material"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface RejectConnectionButtonProps {
  connection: Connection
  mode?: "reject" | "delete" | "cancel"
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
      auth.throwMessage(
        "components.reject_connection_button.rejected",
        Severity.SUCCESS,
      )
    },
    onError: () => {
      auth.throwMessage(
        "components.reject_connection_button.error",
        Severity.ERROR,
      )
    },
  })

  let icon = mdiClose
  if (mode === "delete") icon = mdiAccountRemoveOutline
  if (mode === "cancel") icon = mdiCancel

  return (
    <IconButton
      color="error"
      sx={{ borderRadius: 2 }}
      onClick={() => rejectConnectionRequestMutation.mutate()}
    >
      <Icon path={icon} size={1} />
    </IconButton>
  )
}
