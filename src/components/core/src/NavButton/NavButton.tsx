import { Icon } from "@mdi/react"
import { Text } from "@mantine/core"
import classes from "./NavButton.module.css"

interface NavButtonProps {
  label: string
  isSelected: boolean
  notSelectedIcon: string
  selectedIcon: string
}

export default function NavButton({
  label,
  isSelected,
  notSelectedIcon,
  selectedIcon,
}: NavButtonProps) {
  return (
    <div className={classes.container}>
      <Icon path={isSelected ? selectedIcon : notSelectedIcon} size={1} />
      <Text className={classes.container_text}>{label}</Text>
    </div>
  )
}
