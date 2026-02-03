import {
  ApiError,
  getConnections,
  getUsers,
  sendConnectionRequest,
} from "@/api"
import { useAuth } from "@/hooks/useAuth"
import { ConnectionStatus, Severity } from "@/types/enums"
import { type Connection, type User } from "@/types/types"
import { mdiPlus } from "@mdi/js"
import Icon from "@mdi/react"
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo, useState, type FormEvent } from "react"
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
    return users.filter((user) => user.id !== auth.user?.id)
  }, [users, auth])

  const { data: connections } = useQuery<Connection[]>({
    queryKey: ["connections"],
    queryFn: () => getConnections(),
  })

  const sendConnectionRequestMutation = useMutation({
    mutationFn: (addressee: User) => {
      return sendConnectionRequest(addressee.id)
    },
    onSuccess: () => {
      auth.throwMessage(
        "components.add_connection_button.connection_added",
        Severity.SUCCESS,
      )
      handleDialogClose()
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

  const [addressee, setAddressee] = useState<User | null>(null)
  const resetForm = () => {
    setAddressee(null)
  }

  const [dialogOpened, setDialogOpened] = useState(false)
  const handleDialogOpen = () => setDialogOpened(true)
  const handleDialogClose = () => setDialogOpened(false)

  const handleAddConnection = (e: FormEvent) => {
    e.preventDefault()

    if (!addressee) return

    sendConnectionRequestMutation.mutate(addressee)
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

  if (!users) return

  return (
    <>
      <Tooltip
        title={t("components.add_connection_button.title")}
        enterDelay={500}
        placement="right"
      >
        <IconButton onClick={handleDialogOpen}>
          <Icon path={mdiPlus} size={1} />
        </IconButton>
      </Tooltip>
      <Dialog open={dialogOpened} onClose={handleDialogClose}>
        <form onSubmit={handleAddConnection}>
          <DialogTitle>
            {t("components.add_connection_button.title")}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                flexDirecton: "column",
                gap: 1.5,
                paddingTop: 1,
              }}
            >
              <Autocomplete
                fullWidth
                value={addressee}
                options={formattedUsers}
                getOptionLabel={(option) => option.username!}
                getOptionDisabled={(user) => haveConnection(user)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label={t(
                      "components.add_connection_button.autocomplete_label",
                    )}
                  />
                )}
                onChange={(_, user) => {
                  setAddressee(user)
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>
              {t("components.add_connection_button.cancel")}
            </Button>
            <Button
              variant="contained"
              disabled={addressee === null}
              onClick={handleAddConnection}
            >
              {t("components.add_connection_button.send")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
