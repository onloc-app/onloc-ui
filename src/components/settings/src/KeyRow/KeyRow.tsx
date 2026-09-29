import { formatISODate } from "@/helpers/utils"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"
import type { ApiKey } from "@/types/types"
import { ActionIcon, Divider, Paper, Text, Tooltip } from "@mantine/core"
import { mdiContentCopy, mdiEyeOffOutline, mdiEyeOutline } from "@mdi/js"
import { Icon } from "@mdi/react"
import { useTranslation } from "react-i18next"
import DeleteApiKeyButton from "../DeleteApiKeyButton"
import { useToggle } from "@mantine/hooks"
import classes from "./KeyRow.module.css"
import { useMemo } from "react"

interface KeyRowProps {
  apiKey: ApiKey
}

export default function KeyRow({ apiKey }: KeyRowProps) {
  const auth = useAuth()
  const { t } = useTranslation()

  const [visible, toggle] = useToggle()

  const hiddenKey = useMemo(() => {
    let str = ""
    for (let i = 0; i < apiKey.key.length; i++) {
      str += "•"
    }
    return str
  }, [apiKey])

  return (
    <Paper withBorder>
      <div className={classes["container"]}>
        <div className={classes["header"]}>
          <div className={classes["header__information"]}>
            <Text className={classes["header__information__name"]}>
              {apiKey.name}
            </Text>
            {apiKey.created_at && (
              <Text className={classes["header__information__date"]}>
                {formatISODate(apiKey.created_at)}
              </Text>
            )}
          </div>
          <div className={classes["header__actions"]}>
            <Tooltip
              label={t("components.key_row.copy_clipboard")}
              openDelay={500}
              position="top"
            >
              <ActionIcon
                onClick={() => {
                  try {
                    navigator.clipboard.writeText(apiKey.key)
                    auth.throwMessage(
                      "components.key_row.copy_success",
                      Severity.SUCCESS,
                    )
                  } catch (error) {
                    if (error instanceof DOMException) {
                      auth.throwMessage(error.message, Severity.ERROR)
                    } else {
                      auth.throwMessage(
                        "components.key_row.copy_error",
                        Severity.ERROR,
                      )
                    }
                    console.error(error)
                  }
                }}
              >
                <Icon path={mdiContentCopy} size={1} />
              </ActionIcon>
            </Tooltip>
            <DeleteApiKeyButton apiKey={apiKey} />
          </div>
        </div>
        <Divider className={classes["divider"]} />
        <div className={classes["content"]}>
          <div className={classes["content__key"]}>
            <Text
              className={visible ? undefined : classes["content__key--hidden"]}
            >
              {visible ? apiKey.key : hiddenKey}
            </Text>
          </div>
          <ActionIcon size="lg" onClick={() => toggle()}>
            {visible ? (
              <Icon path={mdiEyeOffOutline} size={1} />
            ) : (
              <Icon path={mdiEyeOutline} size={1} />
            )}
          </ActionIcon>
        </div>
      </div>
    </Paper>
  )
}
