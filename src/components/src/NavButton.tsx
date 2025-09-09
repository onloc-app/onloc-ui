import Icon from "@mdi/react"
import { Button } from "@mui/material"
import { useColorMode } from "../../contexts/ThemeContext"
import { ReactNode } from "react"

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
  const { resolvedMode } = useColorMode()

  return (
    <Button
      variant={isSelected ? "contained" : "text"}
      onClick={onClick}
      sx={{
        gap: 1,
        ...(resolvedMode === "light" && {
          color: isSelected ? "#9768ff" : "white",
          backgroundColor: isSelected ? "white" : "#9768ff",
          "&:hover": {
            backgroundColor: isSelected ? "#fffd" : "#fff2",
          },
        }),
      }}
    >
      <Icon path={isSelected ? selectedIcon : notSelectedIcon} size={1} />
      {children}
    </Button>
  )
}
