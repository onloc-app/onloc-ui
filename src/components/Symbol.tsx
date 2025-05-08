import PlaceIcon from "@mui/icons-material/Place"
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined"
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined"
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined"
import ComputerOutlinedIcon from "@mui/icons-material/ComputerOutlined"
import LaptopWindowsOutlinedIcon from "@mui/icons-material/LaptopWindowsOutlined"
import LaptopChromebookOutlinedIcon from "@mui/icons-material/LaptopChromebookOutlined"
import LaptopMacOutlinedIcon from "@mui/icons-material/LaptopMacOutlined"
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined"
import DesktopMacOutlinedIcon from "@mui/icons-material/DesktopMacOutlined"
import MonitorOutlinedIcon from "@mui/icons-material/MonitorOutlined"
import TabletAndroidOutlinedIcon from "@mui/icons-material/TabletAndroidOutlined"
import TabletMacOutlinedIcon from "@mui/icons-material/TabletMacOutlined"

export const IconEnum: Record<string, React.ElementType> = {
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
}

interface SymbolProps {
  name?: string | null
  color?: string
  fontSize?: number
}

function Symbol({ name, color = "white", fontSize = 40 }: SymbolProps) {
  const IconComponent = name ? IconEnum[name] : PlaceIcon

  return <IconComponent sx={{ fontSize: fontSize, color: color }} />
}

export default Symbol
