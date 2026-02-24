import { Button, Flex, Typography } from "@mantine/core"
import { useNavigate } from "react-router-dom"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <Flex h="100vh" direction="column" align="center" justify="center" gap="xs">
      <Typography fz={24} fw={500} ta="center">
        404 - Page Not Found
      </Typography>
      <Button onClick={() => navigate("/")}>Go back</Button>
    </Flex>
  )
}

export default NotFound
