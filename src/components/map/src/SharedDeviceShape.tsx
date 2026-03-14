import { SERVER_URL } from "@/api/config"
import type { Avatar as AvatarType } from "@/types/types"
import { Avatar } from "@mantine/core"

interface SharedDeviceShapeProps {
  avatar?: AvatarType | null
  color: string
}

export default function SharedDeviceShape({
  avatar = null,
  color,
}: SharedDeviceShapeProps) {
  if (avatar) {
    return (
      <Avatar
        src={`${SERVER_URL}/${avatar.url}`}
        sx={{ boxShadow: `0px 0px 10px ${color}` }}
      />
    )
  }
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      style={{
        filter: `drop-shadow(0 0 10px ${color})`,
      }}
    >
      <path
        d="M 13 12 A 4 4 0 0 1 19 12 L 24 22 A 4 4 0 0 1 22 26 L 10 26 A 4 4 0 0 1 8 22 L 13 12 Z"
        fill={color}
        stroke="white"
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </svg>
  )
}
