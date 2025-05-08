import { useNavigate } from "react-router-dom"
import { Box, Button, Typography } from "@mui/material"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2.5,
        mt: 10,
      }}
    >
      <Typography variant="h4" color="text.primary">
        404 - Page Not Found
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        Go back
      </Button>
    </Box>
  )
}

export default NotFound
