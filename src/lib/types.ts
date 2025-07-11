

export type Device = Server | Dish;

export interface BaseDevice {
  id: string;
  name: string;
  ip: string;
  status: 'Online' | 'Offline';
  uptime: string;
  // Store credentials here for API calls. In a real app, this should be handled much more securely.
  username: string;
  password: string;
}

export interface Server extends BaseDevice {
  type: 'MikroTik';
  port?: number;
  cpuUsage: number;
  memoryUsage: number;
  activePppoe: number;
}

export interface Dish extends BaseDevice {
  type: 'UBNT' | 'Mimosa';
  signalStrength: number;
  noiseFloor: number;
  txRate: number;
  rxRate: number;
}

export interface PppoeUser {
  id: string;
  name: string;
  service: string;
  ipAddress: string;
  uptime: string;
  upload: string;
  download: string;
}

export interface InterfaceStat {
  id: string;
  name: string;
  rxRate: string;
  txRate: string;
  status: 'Running' | 'Down';
}

export type TrafficData = {
  time: string;
  upload: number;
  download: number;
}[];

export type ResourceData = {
  time: string;
  cpu: number;
  memory: number;
}[];

// --- API Payload Types ---

// Credentials needed to connect to any device
export type DeviceCredentials = {
    ip: string;
    username: string;
    password: string;
    port?: number;
}

// Data from the "Add Device" form
export type NewDevicePayload = 
    | { type: 'server'; name: string; ip: string; port?: number; username: string; password: string; }
    | { type: 'dish'; name: string; ip: string; username: string; password: string; }

// Data for adding a PPPoE user, combined with device credentials for the API call
export type AddPppoeUserPayload = {
    serverId: string;
    username: string;
    password: string;
    service: string;
    profile: string;
} & DeviceCredentials;
