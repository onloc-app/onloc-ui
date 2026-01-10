import type { CrudAction, SettingType } from "@/types/enums"

export interface Device {
  id: number
  user_id: number
  name: string
  icon: string | null
  can_ring?: boolean
  created_at?: string | null
  updated_at?: string | null
  latest_location?: Location | null
  is_connected?: boolean
}

export interface Location {
  id: number
  device_id: number
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
  id: number
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
  id: number
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
  id: number
  user_id: number
  key: string
  value: string
}

export interface Session {
  id: number
  user_id: number
  token: string
  agent?: string | null
  created_at?: string
  updated_at?: string
}

export interface ApiKey {
  id: number
  user_id: number
  name: string
  key: string
  created_at?: string
  updated_at?: string
}

export interface Tier {
  id: number
  order_rank: number
  name: string
  max_devices: number | null
  created_at?: string
  updated_at?: string
}

export interface UserTier {
  id: number
  user_id: number
  tier_id: number
  created_at?: string
  updated_at?: string
}

export interface SocketLocationChange {
  action: CrudAction
  locations: Location[]
}
