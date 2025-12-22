import { getApiKeys } from "@/api"
import type { ApiKey } from "@/types/types"
import { Box, Typography } from "@mui/material"
import { KeyRow } from "@/components"
import { useQuery } from "@tanstack/react-query"
import { CreateApiKeyButton } from "@/components"
import { useTranslation } from "react-i18next"

export default function KeyList() {
  const { t } = useTranslation()

  const { data: apiKeys = [] } = useQuery<ApiKey[]>({
    queryKey: ["api_keys"],
    queryFn: async () => getApiKeys(),
  })

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: 24, md: 32 },
              fontWeight: 500,
              textAlign: { xs: "left", sm: "center", md: "left" },
            }}
          >
            {t("components.key_list.api_keys")}
          </Typography>
          <CreateApiKeyButton />
        </Box>
        {apiKeys.map((apiKey) => {
          return <KeyRow apiKey={apiKey} key={apiKey.id} />
        })}
      </Box>
    </>
  )
}
