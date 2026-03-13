import { upsertAvatar } from "@/api"
import { SERVER_URL } from "@/api/config"
import { useAuth } from "@/hooks/useAuth"
import { Avatar, Button, FileInput, Flex } from "@mantine/core"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"

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

  const [file, setFile] = useState<File | null>(null)

  const avatarSrc = file
    ? URL.createObjectURL(file)
    : user?.avatar?.url && `${SERVER_URL}/${user.avatar.url}`

  return (
    <Flex w="100%" align="end" gap="xs" wrap="wrap">
      {user?.avatar?.url && (
        <Avatar src={avatarSrc} size="lg" sx={{ borderRadius: "50%" }} />
      )}
      <FileInput
        label={t("components.avatar_picker.avatar")}
        value={file}
        onChange={(file) => setFile(file)}
        clearable
        miw={100}
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
    </Flex>
  )
}
