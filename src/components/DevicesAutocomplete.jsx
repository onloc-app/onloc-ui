import {
  Autocomplete,
  Box,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import BatteryChip from "./BatteryChip";
import { stringToHexColor } from "../utils";
import Symbol from "./Symbol";

function DevicesAutocomplete({ devices, selectedDevice, setSelectedDevice }) {
  return (
    <Autocomplete
      disablePortal
      fullWidth
      value={selectedDevice || null}
      onChange={(event, newValue) => {
        setSelectedDevice(newValue);
      }}
      options={devices}
      getOptionDisabled={(device) => device.latest_location === null}
      getOptionLabel={(device) => device.name}
      renderOption={(props, device) => (
        <ListItem {...props} key={device.id}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Symbol
              name={device.icon}
              color={stringToHexColor(device.name)}
              fontSize={24}
            />
            <Box>
              <ListItemText primary={device.name} />
            </Box>
            {device.latest_location && device.latest_location.battery ? (
              <BatteryChip level={device.latest_location.battery} />
            ) : (
              ""
            )}
          </Box>
        </ListItem>
      )}
      renderInput={(params) => (
        <TextField {...params} label="Devices" variant="standard" />
      )}
    />
  );
}

export default DevicesAutocomplete;
