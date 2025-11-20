import { getUsers } from "@/api"
import { formatISODate } from "@/helpers/utils"
import { type User } from "@/types/types"
import { Box, Skeleton, Typography } from "@mui/material"
import { DataGrid, type GridColDef } from "@mui/x-data-grid"
import { useQuery } from "@tanstack/react-query"
import DeleteUserButton from "./DeleteUserButton"
import DeleteUserLocationsButton from "./DeleteUserLocationsButton"

export default function UsersTable() {
  const { data: users, isLoading: usersIsLoading } = useQuery<User[]>({
    queryKey: ["admin_users"],
    queryFn: () => getUsers(),
  })

  if (usersIsLoading) return <Skeleton height={100} />

  if (!users) return <Typography variant="body1">No users found.</Typography>

  const columns: GridColDef<(typeof users)[number]>[] = [
    { field: "id", headerName: "ID" },
    { field: "username", headerName: "Username" },
    {
      field: "created_at",
      headerName: "Created At",
      width: 180,
      valueFormatter: (value) => formatISODate(value),
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      width: 180,
      valueFormatter: (value) => formatISODate(value),
    },
    { field: "number_of_devices", headerName: "Devices" },
    { field: "number_of_locations", headerName: "Locations" },
    {
      field: "actions",
      headerName: "Actions",
      resizable: false,
      type: "actions",
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            {!params.row.admin ? <DeleteUserButton user={params.row} /> : null}
            <DeleteUserLocationsButton
              user={params.row}
              disabled={params.row.number_of_locations === 0}
            />
          </Box>
        )
      },
    },
  ]

  return (
    <Box>
      <DataGrid
        rows={users}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[20]}
        disableRowSelectionOnClick
        density="standard"
      />
    </Box>
  )
}
