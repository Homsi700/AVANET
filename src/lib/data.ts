import type { Server, Dish, PppoeUser, InterfaceStat, TrafficData } from './types';

const servers: Server[] = [
  {
    id: 'mikrotik-01',
    name: 'Main Router - HQ',
    ip: '192.168.88.1',
    type: 'MikroTik',
    status: 'Online',
    cpuUsage: 34,
    memoryUsage: 52,
    uptime: '12d 4h 32m',
    activePppoe: 128,
  },
  {
    id: 'mikrotik-02',
    name: 'Branch Office Router',
    ip: '10.10.1.1',
    type: 'MikroTik',
    status: 'Online',
    cpuUsage: 12,
    memoryUsage: 45,
    uptime: '3d 1h 15m',
    activePppoe: 45,
  },
  {
    id: 'mikrotik-03',
    name: 'Backup Server',
    ip: '192.168.88.2',
    type: 'MikroTik',
    status: 'Offline',
    cpuUsage: 0,
    memoryUsage: 0,
    uptime: '0s',
    activePppoe: 0,
  },
];

const dishes: Dish[] = [
  {
    id: 'ubnt-01',
    name: 'Tower 1 Link',
    ip: '10.0.0.2',
    type: 'UBNT',
    status: 'Online',
    signalStrength: -55,
    noiseFloor: -96,
    txRate: 866.7,
    rxRate: 866.7,
    uptime: '56d 12h',
  },
  {
    id: 'mimosa-01',
    name: 'PtP to Hilltop',
    ip: '10.0.0.3',
    type: 'Mimosa',
    status: 'Online',
    signalStrength: -48,
    noiseFloor: -92,
    txRate: 750,
    rxRate: 750,
    uptime: '120d 5h',
  },
  {
    id: 'ubnt-02',
    name: 'Client Sector 3',
    ip: '10.0.0.4',
    type: 'UBNT',
    status: 'Offline',
    signalStrength: 0,
    noiseFloor: 0,
    txRate: 0,
    rxRate: 0,
    uptime: '0s',
  },
];

const pppoeUsers: PppoeUser[] = [
    { id: 'user-01', name: 'user_one', service: 'pro-5mbps', ipAddress: '172.16.0.5', uptime: '3h 45m', upload: '1.2 GB', download: '5.8 GB' },
    { id: 'user-02', name: 'user_two', service: 'basic-2mbps', ipAddress: '172.16.0.12', uptime: '1d 2h', upload: '500 MB', download: '2.1 GB' },
    { id: 'user-03', name: 'user_three', service: 'pro-10mbps', ipAddress: '172.16.0.8', uptime: '12h 10m', upload: '3.5 GB', download: '15.2 GB' },
    { id: 'user-04', name: 'another_user', service: 'pro-5mbps', ipAddress: '172.16.1.20', uptime: '5m', upload: '10 MB', download: '80 MB' },
];

const interfaceStats: InterfaceStat[] = [
    { id: 'if-1', name: 'ether1-gateway', rxRate: '150.5 Mbps', txRate: '32.1 Mbps', status: 'Running' },
    { id: 'if-2', name: 'ether2-lan', rxRate: '80.2 Mbps', txRate: '120.7 Mbps', status: 'Running' },
    { id: 'if-3', name: 'sfp-plus1', rxRate: '1.2 Gbps', txRate: '980 Mbps', status: 'Running' },
    { id: 'if-4', name: 'ether3', rxRate: '0 bps', txRate: '0 bps', status: 'Down' },
];

const trafficData: TrafficData = [
  { time: '12:00', upload: 25, download: 80 },
  { time: '12:05', upload: 30, download: 95 },
  { time: '12:10', upload: 28, download: 88 },
  { time: '12:15', upload: 40, download: 110 },
  { time: '12:20', upload: 35, download: 105 },
  { time: '12:25', upload: 50, download: 120 },
  { time: '12:30', upload: 45, download: 115 },
];


// Simulate API calls
export const getServers = async (): Promise<Server[]> => {
  return new Promise(resolve => setTimeout(() => resolve(servers), 50));
};

export const getServerById = async (id: string): Promise<Server | undefined> => {
  return new Promise(resolve => setTimeout(() => resolve(servers.find(s => s.id === id)), 50));
};

export const getDishes = async (): Promise<Dish[]> => {
  return new Promise(resolve => setTimeout(() => resolve(dishes), 50));
};

export const getDishById = async (id: string): Promise<Dish | undefined> => {
    return new Promise(resolve => setTimeout(() => resolve(dishes.find(d => d.id === id)), 50));
};

export const getPppoeUsers = async (serverId: string): Promise<PppoeUser[]> => {
    return new Promise(resolve => setTimeout(() => resolve(pppoeUsers), 50));
}

export const getInterfaceStats = async (serverId: string): Promise<InterfaceStat[]> => {
    return new Promise(resolve => setTimeout(() => resolve(interfaceStats), 50));
}

export const getTrafficData = async (serverId: string): Promise<TrafficData> => {
    return new Promise(resolve => setTimeout(() => resolve(trafficData), 50));
}
