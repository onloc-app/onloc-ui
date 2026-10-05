import { ApiError, postDevice } from "@/api"
import { ColorPicker, DeviceIconsSelect } from "@/components"
import { useAuth } from "@/hooks/useAuth"
import { DeviceType, Severity } from "@/types/enums"
import { type Device } from "@/types/types"
import {
  ActionIcon,
  Button,
  Modal,
  SegmentedControl,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core"
import { mdiPlus } from "@mdi/js"
import { Icon } from "@mdi/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, type SubmitEventHandler } from "react"
import { useTranslation } from "react-i18next"
import classes from "./AddDeviceButton.module.css"

interface AddDeviceButtonProps {
  disabled?: boolean
}

export default function AddDeviceButton({
  disabled = false,
}: AddDeviceButtonProps) {
  const auth = useAuth()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const postDeviceMutation = useMutation({
    mutationFn: (device: Device) => {
      return postDevice(device)
    },
    onSuccess: () => {
      auth.throwMessage(
        "components.add_device_button.device_added",
        Severity.SUCCESS,
      )
      handleClose()
      resetForm()
      queryClient.invalidateQueries({ queryKey: ["devices"] })
    },
    onError: (error: ApiError) => {
      auth.throwMessage(error.message, Severity.ERROR)
    },
  })

  const [name, setName] = useState<string>("")
  const [nameError, setNameError] = useState<string>("")
  const [color, setColor] = useState<string | null>(null)
  const [type, setType] = useState<DeviceType>(DeviceType.MOBILE_APP)
  const [icon, setIcon] = useState<string | null>(null)
  const resetForm = () => {
    setName("")
    setNameError("")
    setColor(null)
    setType(DeviceType.MOBILE_APP)
    setIcon(null)
  }

  const [opened, setOpened] = useState<boolean>(false)
  const handleOpen = () => setOpened(true)
  const handleClose = () => setOpened(false)

  const handleCreateDevice: SubmitEventHandler = (e?) => {
    e?.preventDefault()

    setNameError("")

    if (name.trim() !== "") {
      postDeviceMutation.mutate({
        id: -1n,
        user_id: auth.user?.id ?? -1n,
        name: name,
        color: color,
        icon: icon,
        can_ring: type === DeviceType.MOBILE_APP,
        can_lock: type === DeviceType.MOBILE_APP,
        can_flash: type === DeviceType.MOBILE_APP,
      })
    } else {
      setNameError("components.add_device_button.name_required")
    }
  }

  return (
    <>
      <Tooltip
        label={t("components.add_device_button.add_a_device")}
        openDelay={500}
        position="right"
      >
        <ActionIcon disabled={disabled} onClick={handleOpen}>
          <Icon path={mdiPlus} size={1} />
        </ActionIcon>
      </Tooltip>

      <Modal
        opened={opened}
        onClose={handleClose}
        title={t("components.add_device_button.add_a_device")}
        centered
      >
        <form className={classes["form"]} onSubmit={handleCreateDevice}>
          <div className={classes["form__content"]}>
            <TextInput
              label={t("components.add_device_button.fields.name")}
              withAsterisk
              error={t(nameError)}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <ColorPicker
              label={t("components.add_device_button.fields.color")}
              value={color}
              name={name}
              onChange={setColor}
            />
            <div className={classes["form__type"]}>
              <Text size="sm" className={classes["form__type__label"]}>
                {t("components.add_device_button.fields.type")}
              </Text>
              <SegmentedControl
                value={type}
                data={[
                  {
                    value: DeviceType.MOBILE_APP,
                    label: t("enums.device_type.mobile_app"),
                  },
                  {
                    value: DeviceType.TRACKER,
                    label: t("enums.device_type.tracker"),
                  },
                ]}
                onChange={(newValue) => setType(newValue as DeviceType)}
              />
            </div>
            <DeviceIconsSelect selectedIcon={icon} onChange={setIcon} />
          </div>
          <div className={classes["form__actions"]}>
            <Button variant="subtle" onClick={handleClose}>
              {t("components.add_device_button.cancel")}
            </Button>
            <Button type="submit" disabled={name.trim() === ""}>
              {t("components.add_device_button.add")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
