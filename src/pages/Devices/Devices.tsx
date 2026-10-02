import { getDevices, getSharedDevices } from "@/api"
import { AddDeviceButton, DeviceAccordionList, SortSelect } from "@/components"
import { sortDevices } from "@/helpers/utils"
import { useAuth } from "@/hooks/useAuth"
import { Sort } from "@/types/enums"
import { Skeleton, Text, Title } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import classes from "./Devices.module.css"

export default function Devices() {
  const { user } = useAuth()
  const { t } = useTranslation()

  const [sortType, setSortType] = useState<Sort>(Sort.NAME)
  const [sortReversed, setSortReversed] = useState<boolean>(false)

  const { data: devices = [], isLoading: isDevicesLoading } = useQuery({
    queryKey: ["devices"],
    queryFn: async () => {
      return sortDevices(await getDevices(), sortType, sortReversed)
    },
  })

  const { data: sharedDevices = [], isLoading: isSharedDevicesLoading } =
    useQuery({
      queryKey: ["shared_devices"],
      queryFn: getSharedDevices,
    })

  const sortedDevices = sortDevices(devices, sortType, sortReversed)
  const sortedSharedDevices = sortDevices(sharedDevices, sortType, sortReversed)

  const maxDevicesReached =
    !!user?.tier?.max_devices && devices.length >= user.tier.max_devices

  const maxDevicesBusted =
    !!user?.tier?.max_devices && devices.length > user.tier.max_devices

  return (
    <div className={classes["container"]}>
      <div className={classes["container__inner"]}>
        <div className={classes["devices"]}>
          <div className={classes["devices__header"]}>
            <div className={classes["devices__header__left"]}>
              <Title>{t("pages.devices.title")}</Title>
              <AddDeviceButton disabled={maxDevicesReached} />
              {user?.tier && user.tier.max_devices !== null && (
                <Text color={maxDevicesBusted ? "error" : undefined}>
                  {devices.length} / {user.tier.max_devices}
                </Text>
              )}
            </div>
            <SortSelect
              defaultType={sortType}
              defaultReversed={sortReversed}
              options={[Sort.NAME, Sort.LATEST_LOCATION]}
              callback={(type: Sort, reversed) => {
                setSortType(type)
                setSortReversed(reversed)
              }}
            />
          </div>
          {isDevicesLoading ? (
            <Skeleton height={64} />
          ) : (
            <DeviceAccordionList devices={sortedDevices} />
          )}
        </div>
        {sharedDevices && sharedDevices.length > 0 && (
          <div className={classes["devices"]}>
            <div className={classes["devices__header"]}>
              <Title>{t("pages.devices.shared")}</Title>
            </div>
            {isSharedDevicesLoading ? (
              <Skeleton height={64} />
            ) : (
              <DeviceAccordionList devices={sortedSharedDevices} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
