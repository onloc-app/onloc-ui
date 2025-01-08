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

export const IconEnum = {
  place: PlaceIcon,
  smartphone: SmartphoneOutlinedIcon,
  phone_android: PhoneAndroidOutlinedIcon,
  phone_iphone: PhoneIphoneOutlinedIcon,
  computer: ComputerOutlinedIcon,
  laptop_windows: LaptopWindowsOutlinedIcon,
  laptop_chromebook: LaptopChromebookOutlinedIcon,
  laptop_mac: LaptopMacOutlinedIcon,
  desktop_windows: DesktopWindowsOutlinedIcon,
  desktop_mac: DesktopMacOutlinedIcon,
  monitor: MonitorOutlinedIcon,
  tablet_android: TabletAndroidOutlinedIcon,
  tablet_mac: TabletMacOutlinedIcon,
};

function Symbol({ name = "place", color = "white" }) {
  const DEFAULT_FONT_SIZE = 40;

  const IconComponent = IconEnum[name] || PlaceIcon;

  return <IconComponent sx={{ fontSize: DEFAULT_FONT_SIZE, color: color }} />;
}

export default Symbol;
