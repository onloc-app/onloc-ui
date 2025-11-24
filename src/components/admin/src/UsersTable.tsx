import { getUsers } from "@/api"
import { formatISODate } from "@/helpers/utils"
import { type Tier, type User } from "@/types/types"
import { Box, Skeleton, Typography } from "@mui/material"
import { DataGrid, useGridApiRef, type GridColDef } from "@mui/x-data-grid"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import {
  DeleteUserButton,
  DeleteUserLocationsButton,
  TierButton,
} from "@/components"
import ReactDOM from "react-dom"

export default function UsersTable() {
  const gridApiRef = useGridApiRef()

  // TODO: placeholder data
  const tiers: Tier[] = [
    { id: 0, name: "Basic", max_devices: 3 },
    { id: 1, name: "Pro", max_devices: 5 },
    { id: 2, name: "Ultimate", max_devices: 10 },
  ]

  const [currentTier, setCurrentTier] = useState<Tier>(tiers[0])

  const { data: users, isLoading: usersIsLoading } = useQuery<User[]>({
    queryKey: ["admin_users"],
    queryFn: () => getUsers(),
  })

  const autosizeOptions = {
    columns: ["tier"],
    includeHeaders: true,
    includeOutliers: false,
  }

  if (usersIsLoading) return <Skeleton height={100} />

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
    { field: "number_of_devices", headerName: "Devices" },
    { field: "number_of_locations", headerName: "Locations" },
    {
      field: "tier",
      headerName: "Tier",
      resizable: false,
      type: "string",
      cellClassName: "unselectable",
      valueGetter: (_, user) => {
        // TODO: change to role name
        return user.username
      },
      renderCell: ({ row: user }) => {
        // TODO: admins dont have a role
        return (
          <>
            {!user.admin ? (
              <TierButton
                currentTier={currentTier}
                tiers={tiers}
                onTierChange={(tier) => {
                  ReactDOM.flushSync(() => {
                    // TODO: make backend POST request
                    setCurrentTier(tier)
                  })
                  gridApiRef.current?.autosizeColumns(autosizeOptions)
                }}
              />
            ) : null}
          </>
        )
      },
    },
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
