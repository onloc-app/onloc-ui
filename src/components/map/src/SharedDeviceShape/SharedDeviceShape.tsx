import { API_SERVER_URL } from "@/api/config"
import type { Avatar as AvatarType } from "@/types/types"
import { Avatar, rem } from "@mantine/core"
import classes from "./SharedDeviceShape.module.css"

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
        src={`${API_SERVER_URL}/${avatar.url}`}
        style={{ boxShadow: `0 0 ${rem(10)} ${color}` }}
      />
    )
  }
  return (
    <svg
      className={classes["shape"]}
      style={{ filter: `drop-shadow(0 0 ${rem(10)} ${color})` }}
    >
      <path
        d="M 13 12 A 4 4 0 0 1 19 12 L 24 22 A 4 4 0 0 1 22 26 L 10 26 A 4 4 0 0 1 8 22 L 13 12 Z"
        fill={color}
        stroke="white"
        strokeWidth={rem(2)}
        strokeLinejoin="round"
      />
    </svg>
  )
}
