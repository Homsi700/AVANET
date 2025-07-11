import type { Server, Dish, PppoeUser, InterfaceStat, TrafficData, Device } from './types';

// In-memory store for devices
const devices: (Server | Dish)[] = [];

const pppoeUsers: PppoeUser[] = [];

const interfaceStats: InterfaceStat[] = [];

const trafficData: TrafficData = [];


// Simulate API calls
export const getServers = async (): Promise<Server[]> => {
  const servers = devices.filter(d => d.type === 'MikroTik') as Server[];
  return new Promise(resolve => setTimeout(() => resolve(servers), 50));
};

export const getServerById = async (id: string): Promise<Server | undefined> => {
  const server = devices.find(s => s.id === id && s.type === 'MikroTik') as Server | undefined;
  return new Promise(resolve => setTimeout(() => resolve(server), 50));
};

export const getDishes = async (): Promise<Dish[]> => {
  const dishes = devices.filter(d => d.type === 'UBNT' || d.type === 'Mimosa') as Dish[];
  return new Promise(resolve => setTimeout(() => resolve(dishes), 50));
};

export const getDishById = async (id: string): Promise<Dish | undefined> => {
  const dish = devices.find(d => d.id === id && (d.type === 'UBNT' || d.type === 'Mimosa')) as Dish | undefined;
  return new Promise(resolve => setTimeout(() => resolve(dish), 50));
};

export const getPppoeUsers = async (serverId: string): Promise<PppoeUser[]> => {
    console.log(`Fetching PPPoE users for server: ${serverId}`);
    return new Promise(resolve => setTimeout(() => resolve(pppoeUsers), 50));
}

export const getInterfaceStats = async (serverId: string): Promise<InterfaceStat[]> => {
    console.log(`Fetching interface stats for server: ${serverId}`);
    return new Promise(resolve => setTimeout(() => resolve(interfaceStats), 50));
}

export const getTrafficData = async (serverId: string): Promise<TrafficData> => {
    console.log(`Fetching traffic data for server: ${serverId}`);
    return new Promise(resolve => setTimeout(() => resolve(trafficData), 50));
}


// --- Mutation functions ---

export const addDevice = async (deviceData: { type: 'server' | 'dish' } & Omit<Device, 'id' | 'status' | 'uptime' | 'type' | 'cpuUsage' | 'memoryUsage' | 'activePppoe' | 'signalStrength' | 'noiseFloor' | 'txRate' | 'rxRate'> ): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newDevice: Device = {
                id: `device-${Date.now()}`,
                name: deviceData.name,
                ip: deviceData.ip,
                status: 'Online', // Placeholder
                uptime: '1d 4h', // Placeholder
                ... (deviceData.type === 'server' ? {
                    type: 'MikroTik',
                    port: (deviceData as any).port,
                    cpuUsage: 0,
                    memoryUsage: 0,
                    activePppoe: 0,
                } : {
                    type: 'UBNT', // Default to UBNT for now
                    signalStrength: 0,
                    noiseFloor: 0,
                    txRate: 0,
                    rxRate: 0,
                })
            } as Device;
            
            devices.push(newDevice);
            console.log("Device added:", newDevice);
            console.log("All devices:", devices);
            resolve();
        }, 500);
    });
}
