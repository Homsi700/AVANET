
import type { Server, Dish, PppoeUser, InterfaceStat, TrafficData, Device, AddPppoeUserPayload, NewDevicePayload, DeviceCredentials, ResourceData } from './types';
import * as api from './api';
import { readDB, writeDB } from './db';

const getDeviceCredentials = (device: Device): DeviceCredentials => {
    const credentials: DeviceCredentials = {
        ip: device.ip,
        username: (device as any).username,
        password: (device as any).password,
    }
    if (device.type === 'MikroTik' && device.port) {
        credentials.port = device.port;
    }
    return credentials;
}

// --- Query functions ---

export const getDevices = async (): Promise<Device[]> => {
  console.log("Fetching all devices from the database file.");
  const db = await readDB();
  const devices = db.devices || [];
  
  // For each device, fetch its live status from the actual device API.
  const liveDevices = await Promise.all(devices.map(async (device) => {
    try {
      const credentials = getDeviceCredentials(device);
      const status = device.type === 'MikroTik'
        ? await api.fetchMikroTikStatus(credentials)
        : await api.fetchDishStatus(credentials);
      return { ...device, ...status };
    } catch (error) {
      console.error(`Failed to fetch status for ${device.name} (${device.ip}):`, error);
      return { ...device, status: 'Offline' as const };
    }
  }));

  return liveDevices;
};

export const getServers = async (): Promise<Server[]> => {
  const allDevices = await getDevices();
  return allDevices.filter(d => d.type === 'MikroTik') as Server[];
};

export const getServerById = async (id: string): Promise<Server | undefined> => {
    const db = await readDB();
    const server = db.devices.find(s => s.id === id && s.type === 'MikroTik') as Server | undefined;
    if (!server) return undefined;

    try {
        const credentials = getDeviceCredentials(server);
        const status = await api.fetchMikroTikStatus(credentials);
        return { ...server, ...status };
    } catch (error) {
        console.error(`Failed to fetch status for server ${id}:`, error);
        return { ...server, status: 'Offline' };
    }
};

export const getDishes = async (): Promise<Dish[]> => {
  const allDevices = await getDevices();
  return allDevices.filter(d => d.type === 'UBNT' || d.type === 'Mimosa') as Dish[];
};

export const getDishById = async (id: string): Promise<Dish | undefined> => {
  const db = await readDB();
  const dish = db.devices.find(d => d.id === id && (d.type === 'UBNT' || d.type === 'Mimosa')) as Dish | undefined;
  if (!dish) return undefined;
  
   try {
        const credentials = getDeviceCredentials(dish);
        const status = await api.fetchDishStatus(credentials);
        return { ...dish, ...status };
    } catch (error) {
        console.error(`Failed to fetch status for dish ${id}:`, error);
        return { ...dish, status: 'Offline' };
    }
};

export const getPppoeUsers = async (serverId: string): Promise<PppoeUser[]> => {
    const db = await readDB();
    const server = db.devices.find(s => s.id === serverId);
    if (!server) {
        console.error(`Server with id ${serverId} not found for getPppoeUsers.`);
        return [];
    }
    try {
        const credentials = getDeviceCredentials(server);
        return await api.fetchPppoeUsers(credentials);
    } catch (error) {
        console.error(`Failed to fetch PPPoE users for server ${serverId}:`, error);
        return [];
    }
}

export const getInterfaceStats = async (serverId: string): Promise<InterfaceStat[]> => {
    const db = await readDB();
    const server = db.devices.find(s => s.id === serverId);
    if (!server) {
         console.error(`Server with id ${serverId} not found for getInterfaceStats.`);
        return [];
    }
     try {
        const credentials = getDeviceCredentials(server);
        return await api.fetchInterfaceStats(credentials);
    } catch (error) {
        console.error(`Failed to fetch interface stats for server ${serverId}:`, error);
        return [];
    }
}

export const getTrafficData = async (serverId: string): Promise<TrafficData> => {
    const db = await readDB();
    const server = db.devices.find(s => s.id === serverId);
    if (!server) {
        console.error(`Server with id ${serverId} not found for getTrafficData.`);
        return [];
    }
     try {
        const credentials = getDeviceCredentials(server);
        return await api.fetchTrafficData(credentials);
    } catch (error) {
        console.error(`Failed to fetch traffic data for server ${serverId}:`, error);
        return [];
    }
}

export const getResourceData = async (serverId: string): Promise<ResourceData> => {
    const db = await readDB();
    const server = db.devices.find(s => s.id === serverId);
     if (!server) {
        console.error(`Server with id ${serverId} not found for getResourceData.`);
        return [];
    }
     try {
        const credentials = getDeviceCredentials(server);
        return await api.fetchResourceData(credentials);
    } catch (error) {
        console.error(`Failed to fetch resource data for server ${serverId}:`, error);
        return [];
    }
}


// --- Mutation functions ---

export const addDevice = async (deviceData: NewDevicePayload): Promise<void> => {
    // Automatically split IP and port if they are entered together
    if (deviceData.ip.includes(':')) {
        const [ip, port] = deviceData.ip.split(':');
        deviceData.ip = ip;
        // If it's a server, assign the port. This avoids adding a port to a dish.
        if (deviceData.type === 'server' && !deviceData.port) {
            deviceData.port = parseInt(port, 10);
        }
    }
    
    const credentials: DeviceCredentials = {
        ip: deviceData.ip,
        username: deviceData.username,
        password: deviceData.password,
    };
    if (deviceData.type === 'server') {
        credentials.port = (deviceData as any).port;
    }

    // Test connection before adding
    try {
         if (deviceData.type === 'server') {
            await api.testMikroTikConnection(credentials);
        } else {
            await api.testDishConnection(credentials);
        }
    } catch(e: any) {
        console.error(e.message); // Add this line to log the original error
        throw new Error(`فشل الاتصال بالجهاز: ${e.message}`);
    }
   

    const newDeviceBase = {
        id: `${deviceData.type}-${Date.now()}`,
        name: deviceData.name,
        ip: deviceData.ip,
        username: deviceData.username,
        password: deviceData.password, // In a real app, encrypt this!
        status: 'Offline' as const, // Start as Offline, first fetch will update it.
        uptime: 'N/A',
    };

    let newDevice: Device;

    if (deviceData.type === 'server') {
        newDevice = {
            ...newDeviceBase,
            type: 'MikroTik',
            port: deviceData.port,
            cpuUsage: 0,
            memoryUsage: 0,
            activePppoe: 0,
        };
    } else {
         newDevice = {
            ...newDeviceBase,
            type: 'UBNT',
            signalStrength: 0,
            noiseFloor: 0,
            txRate: 0,
            rxRate: 0,
        };
    }
    
    const db = await readDB();
    db.devices.push(newDevice);
    await writeDB(db);

    console.log("Device added to db.json:", newDevice);
}

export const updateDeviceById = async (id: string, deviceData: Partial<Device>): Promise<void> => {
    const db = await readDB();
    const deviceIndex = db.devices.findIndex(device => device.id === id);
    if (deviceIndex === -1) {
        throw new Error('لم يتم العثور على الجهاز لتحديثه.');
    }

    // Merge old data with new data
    const updatedDevice = { ...db.devices[deviceIndex], ...deviceData };

    // If password is an empty string, it means user didn't want to change it.
    // So we keep the old one.
    if (deviceData.password === '') {
        updatedDevice.password = db.devices[deviceIndex].password;
    }

    db.devices[deviceIndex] = updatedDevice;
    await writeDB(db);
    console.log(`Device with id ${id} updated in db.json.`);
};

export const addPppoeUser = async (payload: AddPppoeUserPayload): Promise<void> => {
    const db = await readDB();
    const server = db.devices.find(d => d.id === payload.serverId);
    if (!server || server.type !== 'MikroTik') {
        throw new Error("لم يتم العثور على السيرفر أو أنه ليس من نوع MikroTik.");
    }
    const credentials = getDeviceCredentials(server);
    await api.addMikroTikPppoeUser({ ...payload, ...credentials });
}

export const deleteDeviceById = async (id: string): Promise<void> => {
    const db = await readDB();
    const initialLength = db.devices.length;
    db.devices = db.devices.filter(device => device.id !== id);
    if (db.devices.length === initialLength) {
        throw new Error('لم يتم العثور على الجهاز لحذفه.');
    }
    await writeDB(db);
    console.log(`Device with id ${id} deleted from db.json.`);
}
