import { useAuth } from "./contexts/AuthProvider"
import MainAppBar from "./components/MainAppBar"
import { useState, createElement, SyntheticEvent } from "react"
import { useNavigate, useLocation, NavigateFunction } from "react-router-dom"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material"
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined"
import { deleteDevice, getDevices, postDevice } from "./api/index"
import { formatISODate, sortDevices, stringToHexColor } from "./utils/utils"
import Symbol, { IconEnum } from "./components/Symbol"
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined"
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import BatteryChip from "./components/BatteryChip"
import SortSelect from "./components/SortSelect"
import { Device } from "./types/types"
import { Severity, Sort } from "./types/enums"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import ApiError from "./api/src/apiError"

interface DeviceListProps {
  devices: Device[]
  expanded: string | boolean
  handleExpand: (
    panel: string
  ) => (event: SyntheticEvent, isExpanded: boolean) => void
  deleteCallback: (deviceId: number) => void
  navigate: NavigateFunction
}

interface DeviceAccordionProps {
  device: Device
  expanded: string | boolean
  handleExpand: (
    panel: string
  ) => (event: SyntheticEvent, isExpanded: boolean) => void
  deleteCallback: (deviceId: number) => void
  navigate: NavigateFunction
}

function Devices() {
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const { device_id } = location.state || {}

  const [sortType, setSortType] = useState<Sort>(Sort.NAME)
  const [sortReversed, setSortReversed] = useState<boolean>(false)

  const { data: devices = [] } = useQuery({
    queryKey: ["devices"],
    queryFn: async () => {
      if (!auth) return []
      return sortDevices(await getDevices(auth.token), sortType, sortReversed)
    },
  })

  const postDeviceMutation = useMutation({
    mutationFn: (newDevice: Device) => {
      if (!auth) throw new Error()
      return postDevice(auth.token, newDevice)
    },
    onSuccess: (data) => {
      auth?.throwMessage(data.message, Severity.SUCCESS)
      handleCreateDialogClose()
      resetCreateDevice()
      queryClient.invalidateQueries({ queryKey: ["devices"] })
    },
    onError: (error: ApiError) => {
      auth?.throwMessage(error.message, Severity.ERROR)
    },
  })

  const deleteDeviceMutation = useMutation({
    mutationFn: (deletedDeviceId: number) => {
      if (!auth) throw new Error()
      return deleteDevice(auth.token, deletedDeviceId)
    },
    onSuccess: (data) => {
      handleDeleteDialogClose()
      auth?.throwMessage(data.message, auth.Severity.SUCCESS)
      setDeviceIdToDelete(null)
      queryClient.invalidateQueries({ queryKey: ["devices"] })
    },
    onError: (error: ApiError) => {
      auth?.throwMessage(error.message, Severity.ERROR)
    },
  })

  const [expanded, setExpanded] = useState<string | boolean>(
    device_id?.toString() ?? false
  )
  const handleExpand =
    (panel: string) => (_: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  const [deviceNameToCreate, setDeviceNameToCreate] = useState<string>("")
  const [deviceNameToCreateError, setDeviceNameToCreateError] =
    useState<string>("")
  const [deviceIconToCreate, setDeviceIconToCreate] = useState<string>("")
  const resetCreateDevice = () => {
    setDeviceNameToCreate("")
    setDeviceIconToCreate("")
  }

  const [createDialogOpened, setCreateDialogOpened] = useState<boolean>(false)
  const handleCreateDialogOpen = () => {
    setCreateDialogOpened(true)
  }
  const handleCreateDialogClose = () => {
    setCreateDialogOpened(false)
  }

  const [deviceIdToDelete, setDeviceIdToDelete] = useState<number | null>(null)
  const [deleteDialogOpened, setDeleteDialogOpened] = useState<boolean>(false)
  const handleDeleteDialogOpen = (deviceId: number) => {
    setDeviceIdToDelete(deviceId)
    setDeleteDialogOpened(true)
  }
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpened(false)
  }

  return (
    <>
      <MainAppBar selectedNav="devices" />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 1,
          height: "calc(100vh - 64px)",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: "80%", md: "60%" },
            height: "100%",
            padding: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1.5,
                marginBottom: 2,
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
                Devices
              </Typography>
              <IconButton onClick={handleCreateDialogOpen}>
                <AddOutlinedIcon />
              </IconButton>
            </Box>
            <SortSelect
              defaultType={sortType}
              defaultReversed={sortReversed}
              options={[Sort.NAME, Sort.LATEST_LOCATION]}
              callback={(type: Sort, reversed) => {
                setSortType(type)
                setSortReversed(reversed)
              }}
            />
          </Box>
          {devices ? (
            <DeviceList
              devices={sortDevices(devices, sortType, sortReversed)}
              expanded={expanded}
              handleExpand={handleExpand}
              deleteCallback={handleDeleteDialogOpen}
              navigate={navigate}
            />
          ) : (
            ""
          )}
        </Box>
      </Box>

      {/* Dialog to create a device */}
      <Dialog open={createDialogOpened} onClose={handleCreateDialogClose}>
        <DialogTitle>Create a Device</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              paddingTop: 1,
            }}
          >
            <TextField
              label="Name"
              required
              size="small"
              value={deviceNameToCreate}
              onChange={(e) => setDeviceNameToCreate(e.target.value)}
              error={deviceNameToCreateError != ""}
              helperText={deviceNameToCreateError}
            />
            <Box>
              <Autocomplete
                size="small"
                options={Object.keys(IconEnum)}
                renderOption={(props, option) => {
                  const icon = IconEnum[option]
                  const label = option
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())

                  return (
                    <li {...props}>
                      {createElement(icon, { sx: { fontSize: 20, mr: 1 } })}
                      {label}
                    </li>
                  )
                }}
                renderInput={(params) => <TextField {...params} label="Icon" />}
                onChange={(_, newValue) =>
                  setDeviceIconToCreate(newValue || "")
                }
                value={deviceIconToCreate}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (!auth) return

              postDeviceMutation.mutate({
                id: 0,
                name: deviceNameToCreate,
                icon: deviceIconToCreate,
                created_at: null,
                updated_at: null,
                latest_location: null,
              })
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog to delete a device */}
      <Dialog open={deleteDialogOpened} onClose={handleDeleteDialogClose}>
        <DialogTitle>
          Delete
          {devices.find((device) => device.id === deviceIdToDelete)?.name ||
            "selected device"}
          ?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            The device and all of its associated data will be permanently
            deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button
            onClick={() => {
              if (!deviceIdToDelete) return
              deleteDeviceMutation.mutate(deviceIdToDelete)
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

function DeviceList({
  devices,
  expanded,
  handleExpand,
  deleteCallback,
  navigate,
}: DeviceListProps) {
  if (devices) {
    return devices.map((device) => {
      return (
        <DeviceAccordion
          key={device.id}
          device={device}
          expanded={expanded}
          handleExpand={handleExpand}
          deleteCallback={deleteCallback}
          navigate={navigate}
        />
      )
    })
  }
}

function DeviceAccordion({
  device,
  expanded,
  handleExpand,
  deleteCallback,
  navigate,
}: DeviceAccordionProps) {
  return (
    <Accordion
      expanded={expanded === device.id.toString()}
      onChange={handleExpand(device.id.toString())}
    >
      <AccordionSummary expandIcon={<ExpandMoreOutlinedIcon />}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
            }}
          >
            <Symbol name={device.icon} color={stringToHexColor(device.name)} />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Typography component="span">{device.name}</Typography>
                {device.latest_location && device.latest_location.battery ? (
                  <BatteryChip level={device.latest_location.battery} />
                ) : (
                  ""
                )}
              </Box>
              {device.latest_location && device.latest_location.created_at ? (
                <Typography component="span" sx={{ color: "text.secondary" }}>
                  Latest location:{" "}
                  {formatISODate(device.latest_location.created_at.toString())}
                </Typography>
              ) : (
                ""
              )}
            </Box>
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box></Box>
          <Box sx={{ display: "flex", gap: 1.5 }}>
            {device.latest_location ? (
              <IconButton
                onClick={() => {
                  navigate(`/map`, {
                    state: { device_id: device.id },
                  })
                }}
                title="See on map"
              >
                <ExploreOutlinedIcon />
              </IconButton>
            ) : (
              ""
            )}

            <IconButton
              onClick={() => deleteCallback(device.id)}
              color="error"
              title={`Delete ${device.name}`}
            >
              <DeleteOutlinedIcon />
            </IconButton>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

export default Devices
