import Icon from "@mdi/react"
import type { ReactNode } from "react"
import { Button } from "@mantine/core"

interface NavButtonProps {
  children?: ReactNode
  isSelected: boolean
  notSelectedIcon: string
  selectedIcon: string
  onClick: () => void
}

export default function NavButton({
  children,
  isSelected,
  notSelectedIcon,
  selectedIcon,
  onClick = () => {},
}: NavButtonProps) {
  return (
    <Button
      variant={isSelected ? "filled" : "subtle"}
      onClick={onClick}
      leftSection={
        <Icon path={isSelected ? selectedIcon : notSelectedIcon} size={1} />
      }
    >
      {children}
    </Button>
  )
}
