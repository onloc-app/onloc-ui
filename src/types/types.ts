export interface Device {
    id: number;
    name: string;
    icon: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    latest_location?: Location | null;
}

export interface Location {
    id: number;
    device_id: number;
    accuracy?: number | null;
    altitude?: number | null;
    altitude_accuracy?: number | null;
    latitude: number;
    longitude: number;
    battery?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    password: string;
    password_confirmation: string;
}

export interface User {
    id: number;
    username?: string;
    password?: string;
    password_confirmation?: string;
    admin?: boolean;
}

export interface Setting {
    id: number;
    key: string;
    value: string;
}

export interface Session {
    id: number;
    name: string;
    last_used_at: string;
    created_at: string;
}