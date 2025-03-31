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
import { Device } from "../types/types";

interface DevicesAutocompleteProps {
  devices: Device[];
  selectedDevice: Device;
  callback: (device: Device | null) => void;
}

function DevicesAutocomplete({
  devices,
  selectedDevice,
  callback,
}: DevicesAutocompleteProps) {
  return (
    <Autocomplete
      disablePortal
      fullWidth
      value={selectedDevice || null}
      onChange={(_, newValue) => {
        callback(newValue);
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
