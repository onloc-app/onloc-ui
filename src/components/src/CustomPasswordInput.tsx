import Icon from "@mdi/react"
import { mdiEyeOffOutline, mdiEyeOutline } from "@mdi/js"
import { PasswordInput, type PasswordInputProps } from "@mantine/core"

type CustomPasswordInputProps = PasswordInputProps

function CustomPasswordInput(props: CustomPasswordInputProps) {
  return (
    <PasswordInput
      visibilityToggleIcon={({ reveal }) =>
        reveal ? (
          <Icon path={mdiEyeOffOutline} size={0.8} />
        ) : (
          <Icon path={mdiEyeOutline} size={0.8} />
        )
      }
      {...props}
    />
  )
}

export default CustomPasswordInput
