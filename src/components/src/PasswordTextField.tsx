import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from "@mui/material"
import { useState } from "react"
import Icon from "@mdi/react"
import { mdiEye, mdiEyeOff } from "@mdi/js"

type PasswordTextFieldProps = TextFieldProps

function PasswordTextField(props: PasswordTextFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  const handleShowPassword = () => setShowPassword((show) => !show)

  return (
    <TextField
      type={showPassword ? "text" : "password"}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                title={
                  showPassword ? "Hide the password" : "Display the password"
                }
                onClick={handleShowPassword}
              >
                {showPassword ? (
                  <Icon path={mdiEye} size={1} />
                ) : (
                  <Icon path={mdiEyeOff} size={1} />
                )}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      {...props}
    />
  )
}

export default PasswordTextField
