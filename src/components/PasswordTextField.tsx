import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from "@mui/material"
import { useState } from "react"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"

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
                {showPassword ? <Visibility /> : <VisibilityOff />}
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
