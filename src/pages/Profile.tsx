import {
  ChangePasswordButton,
  DeleteAccountButton,
  MainAppShell,
} from "@/components"
import { useAuth } from "@/hooks/useAuth"
import { NavOptions } from "@/types/enums"
import { Box, Button, Flex, TextInput, Typography } from "@mantine/core"
import { useState } from "react"
import { useTranslation } from "react-i18next"

function Profile() {
  const auth = useAuth()
  const { t } = useTranslation()

  const [username, setUsername] = useState<string>(auth?.user?.username || "")

  if (!auth || !auth.user) return

  return (
    <MainAppShell selectedNav={NavOptions.PROFILE}>
      <Flex direction="column" align="center" p="xs">
        <Box w={{ base: "100%", sm: "80%", md: "60%" }} h="100%" p="xs">
          <Flex direction="column" align="start" gap={8}>
            <Typography fz={{ base: 24, md: 32 }} fw={500} mb={2}>
              {t("pages.profile.account")}
            </Typography>
            <Flex align="end" justify="center" gap={8}>
              <TextInput
                label={t("pages.profile.username")}
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value)
                }}
              ></TextInput>
              <Button
                variant="outline"
                disabled={auth.user.username === username || !username.trim()}
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
            </Flex>
            <ChangePasswordButton />
            <DeleteAccountButton />
          </Flex>
        </Box>
      </Flex>
    </MainAppShell>
  )
}

export default Profile
