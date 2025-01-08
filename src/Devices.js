import { useAuth } from "./contexts/AuthProvider";
import MainAppBar from "./components/MainAppBar";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
} from "@mui/material";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import { deleteDevice, getDevices, postDevice } from "./api";
import { formatISODate, stringToHexColor } from "./utils";
import Symbol, { IconEnum } from "./components/Symbol";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

function Devices() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { device_id } = location.state || {};

  const [devices, setDevices] = useState([]);

  useEffect(() => {
    async function fetchDevices() {
      const data = await getDevices(auth.token);
      if (data) {
        setDevices(data);
      }
    }
    fetchDevices();

    const updateInterval = setInterval(() => fetchDevices(), 60000);
    return () => clearInterval(updateInterval);
  }, []);

  const [expanded, setExpanded] = useState(device_id ? device_id : false);
  const handleExpand = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const [deviceNameToCreate, setDeviceNameToCreate] = useState("");
  const [deviceNameToCreateError, setDeviceNameToCreateError] = useState("");
  const [deviceIconToCreate, setDeviceIconToCreate] = useState("");
  const resetCreateDevice = () => {
    setDeviceNameToCreate("");
    setDeviceIconToCreate("");
  };

  const [createDialogOpened, setCreateDialogOpened] = useState(false);
  const handleCreateDialogOpen = () => {
    setCreateDialogOpened(true);
  };
  const handleCreateDialogClose = () => {
    setCreateDialogOpened(false);
  };

  const [deviceIdToDelete, setDeviceIdToDelete] = useState(null);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
  const handleDeleteDialogOpen = (deviceId) => {
    setDeviceIdToDelete(deviceId);
    setDeleteDialogOpened(true);
  };
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpened(false);
  };

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
          {devices ? (
            <DeviceList
              devices={devices}
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
        <DialogTitle>Create a device</DialogTitle>
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
                options={Object.keys(IconEnum).map((key) => ({
                  label: key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase()),
                  value: key,
                  icon: IconEnum[key],
                }))}
                renderOption={(props, option) => (
                  <Box {...props}>
                    <option.icon sx={{ fontSize: 20, mr: 1 }} />
                    {option.label}
                  </Box>
                )}
                renderInput={(params) => <TextField {...params} label="Icon" />}
                onChange={(e, newValue) =>
                  setDeviceIconToCreate(newValue?.value || "")
                }
                value={deviceIconToCreate}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose}>Cancel</Button>
          <Button
            onClick={async () => {
              if (deviceNameToCreate.trim() !== "") {
                setDeviceNameToCreateError("");
                const response = await postDevice(auth.token, {
                  name: deviceNameToCreate,
                  icon: String(deviceIconToCreate),
                });
                if (!response.status && response.message) {
                  handleCreateDialogClose();
                  auth.throwMessage(
                    response.message,
                    auth.SeverityEnum.SUCCESS
                  );
                  resetCreateDevice();
                  setDevices([...devices, response.device]);
                } else {
                  auth.throwMessage(response.message, auth.SeverityEnum.ERROR);
                }
              } else {
                setDeviceNameToCreateError("Name is required");
              }
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog to delete a device */}
      <Dialog open={deleteDialogOpened} onClose={handleDeleteDialogClose}>
        <DialogTitle>
          Delete{" "}
          {deviceIdToDelete
            ? devices.find((device) => device.id === deviceIdToDelete).name
            : "selected device"}
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
            onClick={async () => {
              handleDeleteDialogClose();
              const response = await deleteDevice(auth.token, deviceIdToDelete);
              if (!response.status && response.message) {
                auth.throwMessage(response.message, auth.SeverityEnum.SUCCESS);
                setDeviceIdToDelete(null);
                setDevices(
                  devices.filter((device) => device.id !== deviceIdToDelete)
                );
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function DeviceList({
  devices,
  expanded,
  handleExpand,
  deleteCallback,
  navigate,
}) {
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
      );
    });
  }
}

function DeviceAccordion({
  device,
  expanded,
  handleExpand,
  deleteCallback,
  navigate,
}) {
  return (
    <Accordion
      expanded={expanded === device.id}
      onChange={handleExpand(device.id)}
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
              <Typography component="span">{device.name}</Typography>
              {device.latest_location ? (
                <Typography component="span" sx={{ color: "text.secondary" }}>
                  Latest location:{" "}
                  {formatISODate(device.latest_location.created_at)}
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
                  });
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
  );
}

export default Devices;
