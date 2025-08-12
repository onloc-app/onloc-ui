import { useAuth } from "./contexts/AuthProvider"
import MainAppBar from "./components/MainAppBar"
import { useState, SyntheticEvent } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material"
import { deleteDevice, getDevices, postDevice } from "./api/index"
import { formatISODate, sortDevices, stringToHexColor } from "./helpers/utils"
import Symbol, { IconEnum } from "./components/Symbol"
import BatteryChip from "./components/BatteryChip"
import SortSelect from "./components/SortSelect"
import { Device } from "./types/types"
import { Severity, Sort } from "./types/enums"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import ApiError from "./api/src/apiError"
import Icon from "@mdi/react"
import {
  mdiRuler,
  mdiChevronDown,
  mdiDeleteOutline,
  mdiCompassOutline,
  mdiPlus,
  mdiPhoneRingOutline,
} from "@mdi/js"
import { getDistance, getGeolocation } from "./helpers/locations"

interface DeviceListProps {
  devices: Device[]
  expanded: string | boolean
  handleExpand: (
    panel: string
  ) => (event: SyntheticEvent, isExpanded: boolean) => void
  deleteCallback: (deviceId: number) => void
}

interface DeviceAccordionProps {
  device: Device
  expanded: string | boolean
  handleExpand: (
    panel: string
  ) => (event: SyntheticEvent, isExpanded: boolean) => void
  deleteCallback: (deviceId: number) => void
  userGeolocation: GeolocationCoordinates | null
}

function Devices() {
  const auth = useAuth()
  const location = useLocation()
  const queryClient = useQueryClient()
  const { device_id } = location.state || {}

  const [sortType, setSortType] = useState<Sort>(Sort.NAME)
  const [sortReversed, setSortReversed] = useState<boolean>(false)

  const { data: devices = [] } = useQuery({
    queryKey: ["devices"],
    queryFn: async () => {
      if (!auth) return []
      return sortDevices(await getDevices(), sortType, sortReversed)
    },
  })

  const postDeviceMutation = useMutation({
    mutationFn: (newDevice: Device) => {
      if (!auth) throw new Error()
      return postDevice(newDevice)
    },
    onSuccess: () => {
      auth?.throwMessage("Device created", Severity.SUCCESS)
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
      return deleteDevice(deletedDeviceId)
    },
    onSuccess: () => {
      handleDeleteDialogClose()
      auth?.throwMessage("Device deleted", auth.Severity.SUCCESS)
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
                <Icon path={mdiPlus} size={1} />
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
          <Box>
            {devices ? (
              <DeviceList
                devices={sortDevices(devices, sortType, sortReversed)}
                expanded={expanded}
                handleExpand={handleExpand}
                deleteCallback={handleDeleteDialogOpen}
              />
            ) : (
              ""
            )}
          </Box>
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
            />
            <Box>
              <Autocomplete
                size="small"
                options={Object.keys(IconEnum)}
                renderOption={(props, option) => {
                  const label = option
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())

                  return (
                    <li {...props}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mr: 1,
                        }}
                      >
                        <Symbol name={option} />
                      </Box>
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
          {`Delete ${
            devices.find((device) => device.id === deviceIdToDelete)?.name ||
            "selected device"
          }?`}
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
            variant="contained"
            color="error"
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
}: DeviceListProps) {
  const { data: userGeolocation = null } = useQuery({
    queryKey: ["geolocation"],
    queryFn: () => getGeolocation(),
  })

  if (devices) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {devices.map((device) => {
          return (
            <DeviceAccordion
              key={device.id}
              device={device}
              expanded={expanded}
              handleExpand={handleExpand}
              deleteCallback={deleteCallback}
              userGeolocation={userGeolocation?.coords!}
            />
          )
        })}
      </Box>
    )
  }
}

function DeviceAccordion({
  device,
  expanded,
  handleExpand,
  deleteCallback,
  userGeolocation,
}: DeviceAccordionProps) {
  const auth = useAuth()
  const navigate = useNavigate()

  return (
    <Box>
      <Accordion
        expanded={expanded === device.id.toString()}
        onChange={handleExpand(device.id.toString())}
        square
        disableGutters
        sx={{ borderRadius: 4 }}
      >
        <AccordionSummary expandIcon={<Icon path={mdiChevronDown} size={1} />}>
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
              <Symbol
                name={device.icon}
                color={stringToHexColor(device.name)}
                size={1.6}
              />
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Typography component="span">{device.name}</Typography>
                  {device.latest_location && device.latest_location.battery ? (
                    <BatteryChip level={device.latest_location.battery} />
                  ) : (
                    ""
                  )}
                  {userGeolocation && device.latest_location ? (
                    <Chip
                      sx={{ paddingLeft: 0.5 }}
                      icon={<Icon path={mdiRuler} size={0.8} />}
                      label={
                        <Typography>
                          {getDistance(
                            {
                              id: 0,
                              device_id: 0,
                              latitude: userGeolocation.latitude,
                              longitude: userGeolocation.longitude,
                            },
                            device.latest_location
                          )}
                        </Typography>
                      }
                      size="small"
                    />
                  ) : (
                    ""
                  )}
                </Box>
                {device.latest_location && device.latest_location.created_at ? (
                  <Typography component="span" sx={{ color: "text.secondary" }}>
                    Latest location:{" "}
                    {formatISODate(
                      device.latest_location.created_at.toString()
                    )}
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
            {/* Left actions */}
            <Box>
              <Button
                color="contrast"
                sx={{ paddingInline: 2, borderRadius: 9999 }}
                endIcon={<Icon path={mdiPhoneRingOutline} size={1} />}
                onClick={() => {
                  auth?.socketRef.current?.emit("ring", { deviceId: device.id })
                }}
              >
                Ring
              </Button>
            </Box>

            {/* Right actions */}
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
                  <Icon path={mdiCompassOutline} size={1} />
                </IconButton>
              ) : (
                ""
              )}

              <IconButton
                onClick={() => deleteCallback(device.id)}
                color="error"
                title={`Delete ${device.name}`}
              >
                <Icon path={mdiDeleteOutline} size={1} />
              </IconButton>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}

export default Devices
