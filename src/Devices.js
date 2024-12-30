import { useAuth } from "./contexts/AuthProvider";
import MainAppBar from "./components/MainAppBar";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import { getDevices } from "./api";
import { formatISODate, stringToHexColor } from "./utils";
import Symbol from "./components/Symbol";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";

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

  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
  const handleDeleteDialogOpen = () => setDeleteDialogOpened(true);
  const handleDeleteDialogClose = () => setDeleteDialogOpened(false);

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
          <DeviceList
            devices={devices}
            expanded={expanded}
            handleExpand={handleExpand}
            deleteCallback={() => {
              handleDeleteDialogOpen();
            }}
            navigate={navigate}
          />
        </Box>
      </Box>
      <Dialog
        open={deleteDialogOpened}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>Delete selected device?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The device and all of its associated data will be permanently
            deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteDialogClose}>
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
              onClick={deleteCallback}
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
