import { deleteAvatar, upsertAvatar } from "@/api"
import { API_SERVER_URL } from "@/api/config"
import { useAuth } from "@/hooks/useAuth"
import { Avatar, Button, FileInput } from "@mantine/core"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import classes from "./AvatarPicker.module.css"

export default function AvatarPicker() {
  const auth = useAuth()
  const { user } = auth
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const upsertAvatarMutation = useMutation({
    mutationFn: (file: File) => upsertAvatar(file),
    onSuccess: () => {
      setFile(null)
      queryClient.invalidateQueries({ queryKey: ["current_user_info"] })
    },
  })

  const deleteAvatarMutation = useMutation({
    mutationFn: deleteAvatar,
    onSuccess: () => {
      setFile(null)
      queryClient.invalidateQueries({ queryKey: ["current_user_info"] })
    },
  })

  const [file, setFile] = useState<File | null>(null)

  const avatarSrc = file
    ? URL.createObjectURL(file)
    : user?.avatar?.url && `${API_SERVER_URL}/${user.avatar.url}`

  return (
    <div className={classes["container"]}>
      {user?.avatar?.url && <Avatar src={avatarSrc} size="lg" />}
      <FileInput
        className={classes["input"]}
        label={t("components.avatar_picker.avatar")}
        value={file}
        onChange={(file) => setFile(file)}
        clearable
      />
      <Button
        variant="outline"
        disabled={!file}
        onClick={() => {
          if (file) upsertAvatarMutation.mutate(file)
        }}
      >
        {t("components.avatar_picker.upload")}
      </Button>
      {user?.avatar && (
        <Button color="error.5" onClick={() => deleteAvatarMutation.mutate()}>
          {t("components.avatar_picker.delete")}
        </Button>
      )}
    </div>
  )
}
