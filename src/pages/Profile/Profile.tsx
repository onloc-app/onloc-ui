import {
  AvatarPicker,
  ChangePasswordButton,
  ChangeUsernameInput,
  DeleteAccountButton,
} from "@/components"
import { Title } from "@mantine/core"
import { useTranslation } from "react-i18next"
import classes from "./Profile.module.css"

function Profile() {
  const { t } = useTranslation()

  return (
    <div className={classes["container"]}>
      <div className={classes["container__inner"]}>
        <div className={classes["content"]}>
          <Title>{t("pages.profile.account")}</Title>
          <AvatarPicker />
          <ChangeUsernameInput />
          <ChangePasswordButton />
          <DeleteAccountButton />
        </div>
      </div>
    </div>
  )
}

export default Profile
