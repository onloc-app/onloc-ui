import type { ConnectionStatus, CrudAction, SettingType } from "@/types/enums"

export interface Device {
  id: string
  user_id: string
  name: string
  icon: string | null
  can_ring?: boolean
  can_lock?: boolean
  created_at?: string | null
  updated_at?: string | null
  latest_location?: Location | null
  device_share?: DeviceShare | null
  is_connected?: boolean
}

export interface Location {
  id: string
  device_id: string
  accuracy?: number | null
  altitude?: number | null
  altitude_accuracy?: number | null
  latitude: number
  longitude: number
  battery?: number | null
  created_at?: string | null
  updated_at?: string | null
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterCredentials {
  username: string
  password: string
}

export interface User {
  id: string
  username?: string
  password?: string
  password_confirmation?: string
  admin?: boolean
  created_at?: Date
  updated_at?: Date
  tier?: Tier | null
  number_of_devices?: number
  number_of_locations?: number
}

export interface Setting {
  id: string
  key: string
  value: string
}

export interface SettingTemplate {
  key: string
  desc: string
  defaultValue: string
  type: SettingType
  options?: SettingOption[]
}

export interface SettingOption {
  value: string
  name: string
}

export interface Preference {
  id: string
  user_id: string
  key: string
  value: string
}

export interface Session {
  id: string
  user_id: string
  token: string
  agent?: string | null
  created_at?: string
  updated_at?: string
}

export interface ApiKey {
  id: string
  user_id: string
  name: string
  key: string
  created_at?: string
  updated_at?: string
}

export interface Tier {
  id: string
  order_rank: number
  name: string
  max_devices: number | null
  created_at?: string
  updated_at?: string
}

export interface UserTier {
  id: string
  user_id: string
  tier_id: string
  created_at?: string
  updated_at?: string
}

export interface SocketLocationChange {
  action: CrudAction
  locations: Location[]
}

export interface Connection {
  id: string
  requester_id: string
  addressee_id: string
  status: ConnectionStatus
  created_at?: string
  updated_at?: string
  username?: string
}

export interface DeviceShare {
  id: string
  connection_id: string
  device_id: string
  can_ring: boolean
  can_lock: boolean
  created_at?: string
  updated_at?: string
  device?: Device
}
