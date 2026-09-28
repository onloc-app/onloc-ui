import { useAuth } from "@/hooks/useAuth"
import { Button, TextInput } from "@mantine/core"
import { useState } from "react"
import classes from "./ChangeUsernameInput.module.css"
import { useTranslation } from "react-i18next"

export default function ChangeUsernameInput() {
  const auth = useAuth()
  const { t } = useTranslation()

  const [username, setUsername] = useState<string>(auth?.user?.username || "")

  return (
    <div className={classes["container"]}>
      <TextInput
        label={t("pages.profile.username")}
        value={username}
        onChange={(event) => {
          setUsername(event.target.value)
        }}
      />
      <Button
        variant="outline"
        disabled={auth?.user?.username === username || !username.trim()}
        onClick={async () => {
          try {
            await auth.changeUsernameAction(username)
          } catch (error) {
            console.error(error)
          }
        }}
      >
        {t("pages.profile.save")}
      </Button>
    </div>
  )
}
