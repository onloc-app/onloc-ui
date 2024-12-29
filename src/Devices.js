import { useAuth } from "./contexts/AuthProvider";
import MainAppBar from "./components/MainAppBar";
import { Box } from "@mui/material";

function Devices() {
  const auth = useAuth();

  return (
    <>
      <MainAppBar selectedNav="devices" />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 1,
          height: "calc(100vh - 64px)",
          border: "1px solid white"
        }}
      >
        <Box
          sx={{
            width: {xs: "100%", sm: "80%", md: "60%"},
            height: "100%",
            padding: 1,
            border: "1px solid red"
          }}
        >
          hello world
        </Box>
      </Box>
    </>
  );
}

export default Devices;
