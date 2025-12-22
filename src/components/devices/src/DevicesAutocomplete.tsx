import {
  Autocomplete,
  Box,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material"
import { sortDevices, stringToHexColor } from "@/helpers/utils"
import { BatteryChip, ConnectionDot, Symbol } from "@/components"
import type { Device } from "@/types/types"
import { useTranslation } from "react-i18next"

interface DevicesAutocompleteProps {
  devices: Device[]
  selectedDevice: Device | null
  callback: (device: Device | null) => void
}

function DevicesAutocomplete({
  devices,
  selectedDevice,
  callback,
}: DevicesAutocompleteProps) {
  const { t } = useTranslation()

  return (
    <Autocomplete
      disablePortal
      fullWidth
      value={selectedDevice}
      onChange={(_, newValue) => {
        callback(newValue)
      }}
      options={sortDevices(devices)}
      getOptionDisabled={(device) => device.latest_location === null}
      getOptionLabel={(device) => device.name}
      renderOption={(props, device) => (
        <ListItem {...props} key={device.id}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: 1,
            }}
          >
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
              />
              <Box>
                <ListItemText primary={device.name} />
              </Box>
              {device.latest_location && device.latest_location.battery ? (
                <BatteryChip level={device.latest_location.battery} />
              ) : null}
            </Box>
            {device.is_connected ? <ConnectionDot /> : null}
          </Box>
        </ListItem>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t("components.devices_autocomplete.devices")}
          variant="standard"
        />
      )}
    />
  )
}

export default DevicesAutocomplete
