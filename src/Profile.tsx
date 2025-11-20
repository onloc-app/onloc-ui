import { Box, Button, TextField, Typography } from "@mui/material"
import { MainAppBar } from "@/components"
import { useAuth } from "@/hooks/useAuth"
import { useState } from "react"
import { ChangePasswordButton, DeleteUserButton } from "./components/profile"
import { NavOptions } from "./types/enums"

function Profile() {
  const auth = useAuth()

  const [username, setUsername] = useState<string>(auth?.user?.username || "")

  if (!auth || !auth.user) return

  return (
    <>
      <MainAppBar selectedNav={NavOptions.PROFILE} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 1,
          height: "calc(100vh - 64px)",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: "80%", md: "60%" },
            height: "100%",
            padding: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              gap: 1,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: 24, md: 32 },
                fontWeight: 500,
                mb: 2,
                textAlign: { xs: "left", sm: "center", md: "left" },
              }}
            >
              Account
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
              }}
            >
              <TextField
                label="Username"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value)
                }}
              ></TextField>
              <Button
                variant="outlined"
                disabled={auth.user.username === username || !username.trim()}
                onClick={async () => {
                  try {
                    await auth.changeUsernameAction(username)
                  } catch (error: unknown) {
                    console.error(error)
                  }
                }}
              >
                Save
              </Button>
            </Box>
            <ChangePasswordButton />
            <DeleteUserButton />
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Profile
