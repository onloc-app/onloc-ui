import Icon from "@mdi/react"
import { Flex, Text } from "@mantine/core"

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
    <Flex align="center" gap="xs">
      <Icon
        path={isSelected ? selectedIcon : notSelectedIcon}
        size={1}
        color={isSelected ? "white" : undefined}
      />
      <Text
        fw="bold"
        fz="sm"
        c={isSelected ? "white" : undefined}
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          minWidth: 0,
        }}
      >
        {label}
      </Text>
    </Flex>
  )
}
