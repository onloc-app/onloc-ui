import { ApiError, getUsers } from "@/api"
import { getTiers } from "@/api/src/tierApi"
import { postUserTier } from "@/api/src/userTierApi"
import {
  DeleteUserButton,
  DeleteUserLocationsButton,
  TierButton,
} from "@/components"
import { formatISODate } from "@/helpers/utils"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"
import { type Tier, type User, type UserTier } from "@/types/types"
import { mdiPlus } from "@mdi/js"
import Icon from "@mdi/react"
import { Box, IconButton, Skeleton, Typography } from "@mui/material"
import { DataGrid, useGridApiRef, type GridColDef } from "@mui/x-data-grid"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"

export default function UsersTable() {
  const gridApiRef = useGridApiRef()
  const queryClient = useQueryClient()
  const auth = useAuth()

  const { data: rawTiers = [], isLoading: isTiersLoading } = useQuery<Tier[]>({
    queryKey: ["tiers"],
    queryFn: () => getTiers(),
  })

  const tiers = useMemo(() => {
    return [...rawTiers].sort((a, b) => a.order_rank - b.order_rank)
  }, [rawTiers])

  const { data: users, isLoading: usersIsLoading } = useQuery<User[]>({
    queryKey: ["admin_users"],
    queryFn: () => getUsers(),
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
      requestAnimationFrame(() => {
        gridApiRef.current?.autosizeColumns(autosizeOptions)
      })
    },
    onError: (error: ApiError) =>
      auth.throwMessage(error.message, Severity.ERROR),
  })

  const autosizeOptions = {
    columns: ["tier"],
    includeHeaders: true,
    includeOutliers: false,
  }

  if (usersIsLoading || isTiersLoading) return <Skeleton height={100} />

  if (!users) return <Typography variant="body1">No users found.</Typography>

  const columns: GridColDef<(typeof users)[number]>[] = [
    { field: "id", headerName: "ID" },
    { field: "username", headerName: "Username" },
    {
      field: "created_at",
      headerName: "Created At",
      width: 180,
      type: "dateTime",
      valueFormatter: (value) => formatISODate(value),
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      width: 180,
      type: "dateTime",
      valueFormatter: (value) => formatISODate(value),
    },
    {
      field: "number_of_devices",
      headerName: "Devices",
      valueGetter: (_, user) => user.number_of_devices,
      renderCell: ({ row: user }) => {
        return (
          <Typography
            sx={{ display: "inline" }}
            color={
              user.number_of_devices &&
              user.tier &&
              user.tier?.max_devices !== null &&
              user.number_of_devices > user.tier.max_devices
                ? "error"
                : undefined
            }
          >
            {user.number_of_devices}
          </Typography>
        )
      },
    },
    { field: "number_of_locations", headerName: "Locations" },
    ...(tiers.length > 0
      ? [
          {
            field: "tier",
            headerName: "Tier",
            resizable: false,
            type: "string",
            cellClassName: "unselectable",
            align: "center",
            valueGetter: (_, user) => {
              return user.tier?.name
            },
            renderCell: ({ row: user }) => {
              return (
                <>
                  {user.tier ? (
                    <TierButton
                      currentTier={user.tier}
                      tiers={tiers}
                      onTierChange={(tier) => {
                        postUserTierMutation.mutate({
                          id: -1,
                          user_id: user.id,
                          tier_id: tier.id,
                        })
                      }}
                    />
                  ) : !user.admin ? (
                    <IconButton
                      onClick={() =>
                        postUserTierMutation.mutate({
                          id: -1,
                          user_id: user.id,
                          tier_id: tiers[0].id,
                        })
                      }
                    >
                      <Icon path={mdiPlus} size={1} />
                    </IconButton>
                  ) : null}
                </>
              )
            },
          } as GridColDef<User>,
        ]
      : []),
    {
      field: "actions",
      headerName: "Actions",
      resizable: false,
      type: "actions",
      cellClassName: "unselectable",
      renderCell: ({ row: user }) => {
        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            {!user.admin ? <DeleteUserButton user={user} /> : null}
            <DeleteUserLocationsButton
              user={user}
              disabled={user.number_of_locations === 0}
            />
          </Box>
        )
      },
    },
  ]

  return (
    <Box>
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: 24, md: 32 },
          fontWeight: 500,
          mb: 2,
          textAlign: { xs: "left", sm: "center", md: "left" },
        }}
      >
        Users
      </Typography>
      <DataGrid
        apiRef={gridApiRef}
        rows={users}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        sx={{
          // Makes cells with the "unselectable" class unselectable (no outline)
          "& .MuiDataGrid-cell.unselectable:focus-within": {
            outline: "none !important",
          },
        }}
        pageSizeOptions={[20]}
        disableRowSelectionOnClick
        density="standard"
      />
    </Box>
  )
}
