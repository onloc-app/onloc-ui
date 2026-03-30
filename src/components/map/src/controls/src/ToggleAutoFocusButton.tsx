import { ActionIcon, Tooltip } from "@mantine/core"
import {
  mdiImageFilterCenterFocusStrong,
  mdiImageFilterCenterFocusStrongOutline,
} from "@mdi/js"
import Icon from "@mdi/react"
import { useTranslation } from "react-i18next"

interface ToggleAutoFocusButtonProps {
  autoFocus: boolean
  onToggle: (autoFocus: boolean) => void
}

export default function ToggleAutoFocusButton({
  autoFocus,
  onToggle,
}: ToggleAutoFocusButtonProps) {
  const { t } = useTranslation()

  const tooltipLabel = autoFocus
    ? "components.map_controls.disable_auto_focus"
    : "components.map_controls.enable_auto_focus"

  return (
    <Tooltip label={t(tooltipLabel)} position="left">
      <ActionIcon onClick={() => onToggle(!autoFocus)}>
        {autoFocus ? (
          <Icon path={mdiImageFilterCenterFocusStrong} size={1} />
        ) : (
          <Icon path={mdiImageFilterCenterFocusStrongOutline} size={1} />
        )}
      </ActionIcon>
    </Tooltip>
  )
}
