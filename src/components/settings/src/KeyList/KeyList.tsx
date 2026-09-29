import { getApiKeys } from "@/api"
import { CreateApiKeyButton, KeyRow } from "@/components"
import type { ApiKey } from "@/types/types"
import { Skeleton, Title } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import classes from "./KeyList.module.css"

export default function KeyList() {
  const { t } = useTranslation()

  const { data: apiKeys = [], isLoading: isApiKeysLoading } = useQuery<
    ApiKey[]
  >({
    queryKey: ["api_keys"],
    queryFn: async () => getApiKeys(),
  })

  return (
    <div className={classes["container"]}>
      <div className={classes["header"]}>
        <Title>{t("components.key_list.api_keys")}</Title>
        <CreateApiKeyButton />
      </div>
      <div className={classes["list"]}>
        {!isApiKeysLoading ? (
          apiKeys.map((apiKey) => {
            return <KeyRow apiKey={apiKey} key={apiKey.id} />
          })
        ) : (
          <Skeleton height={64} />
        )}
      </div>
    </div>
  )
}
