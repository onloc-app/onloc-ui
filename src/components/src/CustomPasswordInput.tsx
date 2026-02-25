import Icon from "@mdi/react"
import { mdiEye, mdiEyeOff } from "@mdi/js"
import { PasswordInput, type PasswordInputProps } from "@mantine/core"

type CustomPasswordInputProps = PasswordInputProps

function CustomPasswordInput(props: CustomPasswordInputProps) {
  return (
    <PasswordInput
      visibilityToggleIcon={({ reveal }) =>
        reveal ? (
          <Icon path={mdiEyeOff} size={0.8} />
        ) : (
          <Icon path={mdiEye} size={0.8} />
        )
      }
      {...props}
    />
  )
}

export default CustomPasswordInput
