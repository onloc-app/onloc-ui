import { getApiKeys } from "@/api"
import { CreateApiKeyButton, KeyRow } from "@/components"
import type { ApiKey } from "@/types/types"
import { Flex, Typography } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

export default function KeyList() {
  const { t } = useTranslation()

  const { data: apiKeys = [] } = useQuery<ApiKey[]>({
    queryKey: ["api_keys"],
    queryFn: async () => getApiKeys(),
  })

  return (
    <>
      <Flex direction="column" gap={16}>
        <Flex justify="start" align="center" gap={16}>
          <Typography fz={{ base: 24, md: 32 }} fw={500}>
            {t("components.key_list.api_keys")}
          </Typography>
          <CreateApiKeyButton />
        </Flex>
        {apiKeys.map((apiKey) => {
          return <KeyRow apiKey={apiKey} key={apiKey.id} />
        })}
      </Flex>
    </>
  )
}
