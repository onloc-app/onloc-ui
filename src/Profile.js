import { Box, Button, Divider, TextField } from "@mui/material";
import MainAppBar from "./components/MainAppBar";
import { useAuth } from "./contexts/AuthProvider";
import { useState } from "react";

function Profile() {
  const auth = useAuth();

  const [username, setUsername] = useState(auth.user.username);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <>
      <MainAppBar selectedNav="profile" />
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
                  setUsername(event.target.value);
                }}
              ></TextField>
              <Button
                variant="outlined"
                disabled={auth.user.username === username}
                onClick={async () => {
                  const data = await auth.changeUsernameAction(username);
                  setUsername(data.username);
                }}
              >
                Save
              </Button>
            </Box>
            <Button variant="contained">Change Password</Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Profile;
