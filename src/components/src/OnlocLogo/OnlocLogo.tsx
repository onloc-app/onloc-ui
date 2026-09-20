import { Flex, Title } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import OnlocIcon from "../OnlocIcon"
import classes from "./OnlocLogo.module.css"

export default function OnlocLogo() {
  const navigate = useNavigate()

  return (
    <Flex
      onClick={() => navigate("/")}
      justify="center"
      align="center"
      style={{ cursor: "pointer" }}
    >
      <OnlocIcon size={1.5} />
      <Title className={classes.title}>
        Onloc
      </Title>
    </Flex>
  )
}
