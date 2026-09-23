import { Title } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import { OnlocIcon } from "@/components"
import classes from "./OnlocLogo.module.css"

export default function OnlocLogo() {
  const navigate = useNavigate()

  return (
    <div className={classes["container"]} onClick={() => navigate("/")}>
      <OnlocIcon size={1.5} />
      <Title className={classes["title"]}>Onloc</Title>
    </div>
  )
}
