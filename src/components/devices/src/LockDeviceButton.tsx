import { lockDevice } from "@/api"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"
import type { Device } from "@/types/types"
import { mdiLockOutline } from "@mdi/js"
import Icon from "@mdi/react"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Tooltip,
} from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import { useState, type FormEvent } from "react"
import { useTranslation } from "react-i18next"

interface LockDeviceButtonProps {
  device: Device
}

export default function LockDeviceButton({ device }: LockDeviceButtonProps) {
  const auth = useAuth()
  const { t } = useTranslation()

  const [dialogOpened, setDialogOpened] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleDialogOpen = () => {
    setDialogOpened(true)
  }
  const handleDialogClose = () => {
    setDialogOpened(false)
  }

  const lockDeviceMutation = useMutation({
    mutationFn: (message: string | null = null) =>
      lockDevice(device.id, message),
    onSuccess: (status) => {
      if (status === 200) {
        auth.throwMessage(
          "components.lock_device_button.lock_sent",
          Severity.SUCCESS,
        )
      } else {
        auth.throwMessage(
          "components.lock_device_button.lock_queued",
          Severity.INFO,
        )
      }
    },
    onError: (error) => auth.throwMessage(error.message, Severity.ERROR),
  })

  const handleLock = (event: FormEvent) => {
    event.preventDefault()

    lockDeviceMutation.mutate(
      message && message.trim().length > 0 ? message : null,
    )
    setMessage(null)
    handleDialogClose()
  }

  return (
    <>
      <Tooltip
        title={`${t("components.lock_device_button.lock")} ${device.name}`}
        enterDelay={500}
        placement="bottom"
      >
        <Button
          color="contrast"
          sx={{ paddingInline: 2, borderRadius: 9999 }}
          endIcon={<Icon path={mdiLockOutline} size={1} />}
          onClick={handleDialogOpen}
        >
          {t("components.lock_device_button.lock")}
        </Button>
      </Tooltip>
      <Dialog open={dialogOpened} onClose={handleDialogClose}>
        <form onSubmit={handleLock}>
          <DialogTitle>{`${t("components.lock_device_button.lock")} ${device.name}?`}</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                paddingTop: 1,
              }}
            >
              <TextField
                label={t("components.lock_device_button.message_label")}
                size="small"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>
              {t("components.lock_device_button.cancel")}
            </Button>
            <Button variant="contained" onClick={handleLock} type="submit">
              {t("components.lock_device_button.lock")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
