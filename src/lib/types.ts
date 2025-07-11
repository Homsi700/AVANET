export type Device = Server | Dish;

export interface BaseDevice {
  id: string;
  name: string;
  ip: string;
  status: 'Online' | 'Offline';
  uptime: string;
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
