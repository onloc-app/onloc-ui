import { ActionIcon, Tooltip } from "@mantine/core"
import { mdiClipboardAccountOutline } from "@mdi/js"
import Icon from "@mdi/react"
import { useTranslation } from "react-i18next"

interface ShowAvatarsButtonProps {
  showAvatars: boolean
  onClick: (showAvatars: boolean) => void
}

export default function ToggleAvatorsButton({
  showAvatars,
  onClick,
}: ShowAvatarsButtonProps) {
  const { t } = useTranslation()

  const translationString = showAvatars
    ? "components.map_controls.hide_avatars"
    : "components.map_controls.show_avatars"

  return (
    <Tooltip label={t(translationString)} position="left">
      <ActionIcon onClick={() => onClick(!showAvatars)}>
        <Icon path={mdiClipboardAccountOutline} size={1} />
      </ActionIcon>
    </Tooltip>
  )
}
