import type { Server, Dish, PppoeUser, InterfaceStat, TrafficData, Device } from './types';

// In-memory store for devices. In a real application, this would be a database.
const devices: (Server | Dish)[] = [];

// In a real application, this data would be fetched from the actual devices.
const pppoeUsers: PppoeUser[] = [];
const interfaceStats: InterfaceStat[] = [];
const trafficData: TrafficData = [];


// --- Query functions ---
// These functions will eventually contain the API logic to connect to your devices.

export const getServers = async (): Promise<Server[]> => {
  console.log("Fetching all servers from the in-memory store.");
  // TODO: Replace this with actual API calls to your MikroTik servers.
  const servers = devices.filter(d => d.type === 'MikroTik') as Server[];
  // For each server, you would typically fetch its live status here.
  return new Promise(resolve => setTimeout(() => resolve(servers), 50));
};

export const getServerById = async (id: string): Promise<Server | undefined> => {
    console.log(`Fetching server with ID: ${id}`);
  // TODO: Replace this with an API call to the specific MikroTik server.
  const server = devices.find(s => s.id === id && s.type === 'MikroTik') as Server | undefined;
  // Here, you would fetch detailed data for this specific server.
  return new Promise(resolve => setTimeout(() => resolve(server), 50));
};

export const getDishes = async (): Promise<Dish[]> => {
  console.log("Fetching all dishes from the in-memory store.");
  // TODO: Replace this with actual API calls to your UBNT/Mimosa devices.
  const dishes = devices.filter(d => d.type === 'UBNT' || d.type === 'Mimosa') as Dish[];
  // For each dish, you would fetch its live status.
  return new Promise(resolve => setTimeout(() => resolve(dishes), 50));
};

export const getDishById = async (id: string): Promise<Dish | undefined> => {
  console.log(`Fetching dish with ID: ${id}`);
  // TODO: Replace with an API call to the specific UBNT/Mimosa device.
  const dish = devices.find(d => d.id === id && (d.type === 'UBNT' || d.type === 'Mimosa')) as Dish | undefined;
  // Fetch detailed data for this specific dish.
  return new Promise(resolve => setTimeout(() => resolve(dish), 50));
};

export const getPppoeUsers = async (serverId: string): Promise<PppoeUser[]> => {
    console.log(`Fetching PPPoE users for server: ${serverId}`);
    // TODO: Implement API call to MikroTik server to get active PPPoE users.
    return new Promise(resolve => setTimeout(() => resolve(pppoeUsers), 50));
}

export const getInterfaceStats = async (serverId: string): Promise<InterfaceStat[]> => {
    console.log(`Fetching interface stats for server: ${serverId}`);
    // TODO: Implement API call to MikroTik server to get interface stats.
    return new Promise(resolve => setTimeout(() => resolve(interfaceStats), 50));
}

export const getTrafficData = async (serverId: string): Promise<TrafficData> => {
    console.log(`Fetching traffic data for server: ${serverId}`);
    // TODO: Implement API call to MikroTik server to get traffic data.
    return new Promise(resolve => setTimeout(() => resolve(trafficData), 50));
}


// --- Mutation functions ---

export const addDevice = async (deviceData: { type: 'server' | 'dish' } & Omit<Device, 'id' | 'status' | 'uptime' | 'type' | 'cpuUsage' | 'memoryUsage' | 'activePppoe' | 'signalStrength' | 'noiseFloor' | 'txRate' | 'rxRate'> ): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // TODO: Add logic here to test the connection to the device before adding it.
            // If connection fails, call reject(new Error("Unable to connect to device.")).

            const newDeviceBase = {
                id: `${deviceData.type}-${Date.now()}`,
                name: deviceData.name,
                ip: deviceData.ip,
                status: 'Offline', // Start as Offline, a background job should update it.
                uptime: 'N/A',
            };

            let newDevice: Device;

            if (deviceData.type === 'server') {
                newDevice = {
                    ...newDeviceBase,
                    type: 'MikroTik',
                    port: (deviceData as any).port,
                    // These values should be updated by a separate monitoring service/job
                    cpuUsage: 0,
                    memoryUsage: 0,
                    activePppoe: 0,
                };
            } else {
                 newDevice = {
                    ...newDeviceBase,
                    type: 'UBNT', // Defaulting to UBNT, could be a field in the form.
                    // These values should be updated by a separate monitoring service/job
                    signalStrength: 0,
                    noiseFloor: 0,
                    txRate: 0,
                    rxRate: 0,
                };
            }
            
            devices.push(newDevice);
            console.log("Device added:", newDevice);
            console.log("Current devices in store:", devices);
            resolve();
        }, 500);
    });
}
