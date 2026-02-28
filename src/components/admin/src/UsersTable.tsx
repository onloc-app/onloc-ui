import { ApiError, getTiers, getUsers, postUserTier } from "@/api"
import {
  DeleteUserButton,
  DeleteUserLocationsButton,
  TierSelect,
} from "@/components"
import { formatISODate } from "@/helpers/utils"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"
import { type Tier, type User, type UserTier } from "@/types/types"
import {
  ActionIcon,
  Group,
  Skeleton,
  Space,
  Typography,
  useMantineTheme,
} from "@mantine/core"
import { mdiPlus } from "@mdi/js"
import Icon from "@mdi/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  DataTable,
  type DataTableColumn,
  type DataTableSortStatus,
} from "mantine-datatable"
import "mantine-datatable/styles.css"
import { memo, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

const PAGE_SIZE = 12

function UsersTable() {
  const queryClient = useQueryClient()
  const auth = useAuth()
  const theme = useMantineTheme()
  const { t } = useTranslation()

  const { data: rawTiers = [], isLoading: isTiersLoading } = useQuery<Tier[]>({
    queryKey: ["tiers"],
    queryFn: getTiers,
  })

  const tiers = useMemo(() => {
    return [...rawTiers].sort((a, b) => a.order_rank - b.order_rank)
  }, [rawTiers])

  const { data: users, isLoading: usersIsLoading } = useQuery<User[]>({
    queryKey: ["admin_users"],
    queryFn: getUsers,
  })

  const postUserTierMutation = useMutation({
    mutationFn: (userTier: UserTier) => postUserTier(userTier),
    onSuccess: (userTier: UserTier) => {
      queryClient.setQueryData<User[]>(["admin_users"], (users = []) => {
        return users.map((user) => {
          if (user.id !== userTier.user_id) return user
          return {
            ...user,
            tier: tiers.find((tier) => tier.id === userTier.tier_id) ?? null,
          }
        })
      })
    },
    onError: (error: ApiError) =>
      auth.throwMessage(error.message, Severity.ERROR),
  })

  const [page, setPage] = useState(1)
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<User>>({
    columnAccessor: "id",
    direction: "asc",
  })

  const records = useMemo(() => {
    if (!users) return []

    const data = [...users].sort((a, b) => {
      const accessor = sortStatus.columnAccessor as keyof User
      const aVal = a[accessor]
      const bVal = b[accessor]

      if (typeof aVal === "bigint" && typeof bVal === "bigint") {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      }
      if (typeof aVal === "string" && typeof bVal === "string") {
        return aVal.toLowerCase().localeCompare(bVal.toLowerCase())
      }
      return (aVal as number) - (bVal as number)
    })

    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE

    const slicedData = data.slice(from, to)

    return sortStatus.direction === "desc" ? slicedData.reverse() : slicedData
  }, [users, page, sortStatus])

  const columns: DataTableColumn<User>[] = useMemo(
    () => [
      {
        accessor: "id",
        title: t("components.users_table.columns.id.name"),
        sortable: true,
      },
      {
        accessor: "username",
        title: t("components.users_table.columns.username.name"),
        sortable: true,
      },
      {
        accessor: "created_at",
        title: t("components.users_table.columns.created_at.name"),
        render: ({ created_at }) =>
          created_at ? formatISODate(created_at.toString()) : null,
        sortable: true,
      },
      {
        accessor: "updated_at",
        title: t("components.users_table.columns.updated_at.name"),
        render: ({ updated_at }) =>
          updated_at ? formatISODate(updated_at.toString()) : null,
        sortable: true,
      },
      {
        accessor: "number_of_devices",
        title: t("components.users_table.columns.number_of_devices.name"),
        sortable: true,
        cellsStyle: (user) => {
          const numberOfDevices = user.number_of_devices
          const maxDevices = user.tier?.max_devices
          if (
            numberOfDevices != null &&
            maxDevices != null &&
            numberOfDevices > maxDevices
          ) {
            return { color: theme.colors.error[5], fontWeight: 500 }
          }
          return {}
        },
      },
      {
        accessor: "number_of_locations",
        title: t("components.users_table.columns.number_of_locations.name"),
        sortable: true,
      },
      {
        accessor: "tiers",
        title: t("components.users_table.columns.tier.name"),
        render: (user) => (
          <Group w={200}>
            {user.tier ? (
              <>
                <TierSelect
                  currentTier={user.tier}
                  tiers={tiers}
                  onTierChange={(tier) => {
                    postUserTierMutation.mutate({
                      id: -1n,
                      user_id: user.id,
                      tier_id: tier.id,
                    })
                  }}
                />
              </>
            ) : !user.admin ? (
              <ActionIcon
                onClick={() => {
                  postUserTierMutation.mutate({
                    id: -1n,
                    user_id: user.id,
                    tier_id: tiers[0].id,
                  })
                }}
              >
                <Icon path={mdiPlus} size={1} />
              </ActionIcon>
            ) : null}
          </Group>
        ),
      },
      {
        accessor: "actions",
        title: t("components.users_table.columns.actions.name"),
        textAlign: "right",
        render: (user) => (
          <Group justify="end">
            {!user.admin ? <DeleteUserButton user={user} /> : null}
            <DeleteUserLocationsButton user={user} />
          </Group>
        ),
      },
    ],
    [t, tiers, theme, postUserTierMutation],
  )

  if (usersIsLoading || isTiersLoading) return <Skeleton height={100} />

  if (!users) {
    return (
      <Typography>{t("components.users_table.empty_table_message")}</Typography>
    )
  }

  return (
    <>
      <Typography fz={{ base: 24, md: 32 }} fw={500}>
        {t("components.users_table.title")}
      </Typography>
      <Space h="sm" />
      <DataTable
        columns={columns}
        records={records}
        withTableBorder
        borderRadius="md"
        highlightOnHover
        totalRecords={users.length}
        recordsPerPage={PAGE_SIZE}
        page={page}
        onPageChange={(p) => setPage(p)}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
      />
    </>
  )
}

export default memo(UsersTable)
