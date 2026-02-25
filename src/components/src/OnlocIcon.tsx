import Icon from "@mdi/react"

const path = `
  M12 4.59
  A4.45 4.45 0 0 0 7.56 9.03
  A4.45 4.45 0 0 0 7.84 10.57
  H7.83
  L9.78 17.26
  A2.22 2.22 0 0 0 12 19.25
  A2.22 2.22 0 0 0 14.22 17.26
  L16.17 10.57
  A4.45 4.45 0 0 0 16.44 9.03
  A4.45 4.45 0 0 0 12 4.59
  Z
  M12 6.8
  A2.22 2.22 0 0 1 14.22 9.03
  A2.22 2.22 0 0 1 12 11.25
  A2.22 2.22 0 0 1 9.78 9.03
  A2.22 2.22 0 0 1 12 6.8
  Z
`

interface OnlocIconProps {
  size: number
}

export default function OnlocIcon({ size }: OnlocIconProps) {
  return <Icon path={path} size={size} />
}
