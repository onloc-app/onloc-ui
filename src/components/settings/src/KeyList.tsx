import { getApiKeys } from "@/api"
import { CreateApiKeyButton, KeyRow } from "@/components"
import type { ApiKey } from "@/types/types"
import { Flex, Skeleton, Space, Stack, Typography } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

export default function KeyList() {
  const { t } = useTranslation()

  const { data: apiKeys = [], isLoading: isApiKeysLoading } = useQuery<
    ApiKey[]
  >({
    queryKey: ["api_keys"],
    queryFn: async () => getApiKeys(),
  })

  return (
    <>
      <Flex direction="column">
        <Flex justify="start" align="center" gap="xs">
          <Typography fz={{ base: 24, md: 32 }} fw={500}>
            {t("components.key_list.api_keys")}
          </Typography>
          <CreateApiKeyButton />
        </Flex>
        <Space h="sm" />
        <Stack>
          {!isApiKeysLoading ? (
            apiKeys.map((apiKey) => {
              return <KeyRow apiKey={apiKey} key={apiKey.id} />
            })
          ) : (
            <Skeleton height={64} />
          )}
        </Stack>
      </Flex>
    </>
  )
}
