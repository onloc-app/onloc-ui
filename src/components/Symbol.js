import PlaceIcon from "@mui/icons-material/Place";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import ComputerOutlinedIcon from "@mui/icons-material/ComputerOutlined";
import LaptopWindowsOutlinedIcon from "@mui/icons-material/LaptopWindowsOutlined";
import LaptopChromebookOutlinedIcon from "@mui/icons-material/LaptopChromebookOutlined";
import LaptopMacOutlinedIcon from "@mui/icons-material/LaptopMacOutlined";
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";
import DesktopMacOutlinedIcon from "@mui/icons-material/DesktopMacOutlined";
import MonitorOutlinedIcon from "@mui/icons-material/MonitorOutlined";
import TabletAndroidOutlinedIcon from "@mui/icons-material/TabletAndroidOutlined";
import TabletMacOutlinedIcon from "@mui/icons-material/TabletMacOutlined";

function Symbol({ name = "place", color = "white" }) {
  const DEFAULT_FONT_SIZE = 40;

  let symbol = <PlaceIcon sx={{ fontSize: DEFAULT_FONT_SIZE, color: color }} />;

  switch (name) {
    case "smartphone":
      symbol = (
        <SmartphoneOutlinedIcon
          sx={{ fontSize: DEFAULT_FONT_SIZE, color: color }}
        />
      );
      break;
    case "phone_android":
      symbol = (
        <PhoneAndroidOutlinedIcon
          sx={{ fontSize: DEFAULT_FONT_SIZE, color: color }}
        />
      );
      break;
    case "phone_iphone":
      symbol = (
        <PhoneIphoneOutlinedIcon
          sx={{ fontSize: DEFAULT_FONT_SIZE, color: color }}
        />
      );
      break;
    case "computer":
      symbol = (
        <ComputerOutlinedIcon
          sx={{ fontSize: DEFAULT_FONT_SIZE, color: color }}
        />
      );
      break;
    case "laptop_windows":
      symbol = (
        <LaptopWindowsOutlinedIcon
          sx={{ fontSize: DEFAULT_FONT_SIZE, color: color }}
        />
      );
      break;
    case "laptop_chromebook":
      symbol = (
        <LaptopChromebookOutlinedIcon
          sx={{ fontSize: DEFAULT_FONT_SIZE, color: color }}
        />
      );
      break;
    case "laptop_mac":
      symbol = (
        <LaptopMacOutlinedIcon
          sx={{ fontSize: DEFAULT_FONT_SIZE, color: color }}
        />
      );
      break;
    case "desktop_windows":
      symbol = (
        <DesktopWindowsOutlinedIcon
          sx={{ fontSize: DEFAULT_FONT_SIZE, color: color }}
        />
      );
      break;
    case "desktop_mac":
      symbol = (
        <DesktopMacOutlinedIcon
          sx={{ fontSize: DEFAULT_FONT_SIZE, color: color }}
        />
      );
      break;
    case "monitor":
      symbol = (
        <MonitorOutlinedIcon
          sx={{ fontSize: DEFAULT_FONT_SIZE, color: color }}
        />
      );
      break;
    case "tablet_android":
      symbol = (
        <TabletAndroidOutlinedIcon
          sx={{ fontSize: DEFAULT_FONT_SIZE, color: color }}
        />
      );
      break;
    case "tablet_mac":
      symbol = (
        <TabletMacOutlinedIcon
          sx={{ fontSize: DEFAULT_FONT_SIZE, color: color }}
        />
      );
      break;
    default:
      symbol = <PlaceIcon sx={{ fontSize: 40, color: color }} />;
      break;
  }

  return symbol;
}

export default Symbol;
