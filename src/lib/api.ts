/**
 * @file This file contains the functions that interact with the network devices' APIs.
 * It uses the 'node-routeros' library to communicate with MikroTik devices.
 */
import type { Server, Dish, PppoeUser, InterfaceStat, TrafficData, AddPppoeUserPayload, DeviceCredentials, ResourceData } from './types';
import { RouterOSAPI, RosException } from 'node-routeros';
import { Transform } from 'stream';

// Helper function to connect, execute, and close the connection to a MikroTik device.
async function executeMikroTikCommand(credentials: DeviceCredentials, command: string, params: any[] = []): Promise<any[]> {
    const conn = new RouterOSAPI({
        host: credentials.ip,
        user: credentials.username,
        password: credentials.password,
        port: credentials.port || 8728,
        timeout: 5, // 5 second timeout
    });

    try {
        await conn.connect();
        const results = await conn.write(command, params);
        return results;
    } catch (err: any) {
        if (err instanceof RosException) {
            throw new Error(`MikroTik API Error: ${err.message}`);
        }
        throw new Error(`Connection failed to ${credentials.ip}:${credentials.port || 8728}. Check network, firewall, and credentials.`);
    } finally {
        if (conn.connected) {
            await conn.close();
        }
    }
}

// --- MIKROTIK API FUNCTIONS ---

/**
 * Tests the connection to a MikroTik server.
 * @param credentials - The device credentials.
 * @returns A promise that resolves if the connection is successful.
 * @throws An error if the connection fails.
 */
export const testMikroTikConnection = async (credentials: DeviceCredentials): Promise<void> => {
    console.log(`[API] Testing connection to MikroTik: ${credentials.ip}:${credentials.port || 8728}`);
    // A simple command to check the connection.
    await executeMikroTikCommand(credentials, '/system/resource/print');
}

/**
 * Fetches the status and resource usage for a specific MikroTik server.
 * @param credentials - The device credentials.
 * @returns A promise that resolves with the server's status data.
 */
export const fetchMikroTikStatus = async (credentials: DeviceCredentials): Promise<Partial<Server>> => {
    console.log(`[API] Fetching status for MikroTik: ${credentials.ip}`);
    const [resource, pppoe] = await Promise.all([
        executeMikroTikCommand(credentials, '/system/resource/print'),
        executeMikroTikCommand(credentials, '/ppp/active/print', ['?service=pppoe', 'count-only=']),
    ]);
    
    const resourceData = resource[0];
    const pppoeCount = pppoe[0]?.ret || 0;

    return {
        status: 'Online',
        cpuUsage: resourceData['cpu-load'],
        memoryUsage: Math.round(((resourceData['total-memory'] - resourceData['free-memory']) / resourceData['total-memory']) * 100),
        uptime: resourceData.uptime,
        activePppoe: parseInt(pppoeCount, 10),
    };
}

/**
 * Adds a new PPPoE user to a MikroTik server.
 * @param payload - The PPPoE user details, including credentials.
 * @throws An error if adding the user fails.
 */
export const addMikroTikPppoeUser = async (payload: AddPppoeUserPayload): Promise<void> => {
    console.log(`[API] Adding PPPoE user '${payload.username}' to server ${payload.serverId}`);
    await executeMikroTikCommand(payload, '/ppp/secret/add', [
        `=name=${payload.username}`,
        `=password=${payload.password}`,
        `=service=${payload.service}`,
        `=profile=${payload.profile}`,
    ]);
}

/**
 * Fetches the list of active PPPoE users from a MikroTik server.
 * @param credentials - The device credentials.
 * @returns A promise that resolves with an array of active PPPoE users.
 */
export const fetchPppoeUsers = async (credentials: DeviceCredentials): Promise<PppoeUser[]> => {
    console.log(`[API] Fetching PPPoE users for: ${credentials.ip}`);
    const results = await executeMikroTikCommand(credentials, '/ppp/active/print');
    return results.map((user: any) => ({
        id: user['.id'],
        name: user.name,
        service: user.service,
        ipAddress: user.address,
        uptime: user.uptime,
        upload: 'N/A', // These values are not directly available here
        download: 'N/A', // Needs traffic monitoring
    }));
}

// A helper to format bytes into a readable string
const formatRate = (bits: number): string => {
    if (bits < 1000) return `${bits} bps`;
    if (bits < 1000000) return `${(bits / 1000).toFixed(1)} Kbps`;
    return `${(bits / 1000000).toFixed(1)} Mbps`;
};

/**
 * Fetches interface statistics from a MikroTik server.
 * @param credentials - The device credentials.
 * @returns A promise that resolves with an array of interface stats.
 */
export const fetchInterfaceStats = async (credentials: DeviceCredentials): Promise<InterfaceStat[]> => {
    console.log(`[API] Fetching interface stats for: ${credentials.ip}`);
    
    const conn = new RouterOSAPI({
        host: credentials.ip,
        user: credentials.username,
        password: credentials.password,
        port: credentials.port || 8728,
        timeout: 10,
    });

    try {
        await conn.connect();
        
        // Get initial interface list
        const interfaces = await conn.write('/interface/print');
        const interfaceNames = interfaces.map((i: any) => i.name).join(',');

        // Create a stream to monitor traffic
        const stream = conn.stream(['/interface/monitor-traffic', `=interface=${interfaceNames}`, '=once=']);
        
        const data: any[] = await new Promise((resolve, reject) => {
            const collectedData: any[] = [];
            const dataTimeout = setTimeout(() => {
                stream.close();
                reject(new Error("Timeout waiting for interface data from stream."));
            }, 5000); // 5 second timeout for stream data

            stream.on('data', (chunk) => {
                collectedData.push(chunk);
                if (collectedData.length >= interfaces.length) {
                   clearTimeout(dataTimeout);
                   stream.close();
                   resolve(collectedData);
                }
            });
            stream.on('error', (err) => {
                 clearTimeout(dataTimeout);
                 reject(err);
            });
            stream.on('end', () => {
                 clearTimeout(dataTimeout);
                 resolve(collectedData);
            });
        });

        const statsMap = new Map<string, any>();
        data.forEach(stat => statsMap.set(stat.name, stat));
        
        return interfaces.map((iface: any) => {
            const traffic = statsMap.get(iface.name);
            return {
                id: iface['.id'],
                name: iface.name,
                status: iface.running ? 'Running' : 'Down',
                rxRate: traffic ? formatRate(traffic['rx-bits-per-second']) : '0 bps',
                txRate: traffic ? formatRate(traffic['tx-bits-per-second']) : '0 bps',
            };
        });

    } catch (err: any) {
        console.error(`Error fetching interface stats: ${err.message}`);
        throw err;
    } finally {
        if (conn.connected) {
            await conn.close();
        }
    }
}


/**
 * Fetches traffic data from a MikroTik server.
 * @param credentials - The device credentials.
 * @returns A promise that resolves with traffic data.
 */
export const fetchTrafficData = async (credentials: DeviceCredentials): Promise<TrafficData> => {
    console.log(`[API] Fetching traffic data for: ${credentials.ip}`);
    // This is more complex and requires background monitoring.
    // For now, returning mock data. A real implementation would involve
    // storing historical data or using a monitoring tool.
    const generateData = () => {
        const data = [];
        for (let i = 5; i >= 0; i--) {
            data.push({
                time: `${i}:00`,
                upload: Math.floor(Math.random() * 10) + 1,
                download: Math.floor(Math.random() * 50) + 5,
            });
        }
        return data;
    }
    return Promise.resolve(generateData());
}

/**
 * Fetches resource usage data from a MikroTik server.
 * @param credentials - The device credentials.
 * @returns A promise that resolves with resource usage data.
 */
export const fetchResourceData = async (credentials: DeviceCredentials): Promise<ResourceData> => {
    console.log(`[API] Fetching resource data for: ${credentials.ip}`);
    // This is also complex for real-time history.
    // Returning mock data for the chart.
    const generateData = () => {
        const data = [];
        for (let i = 5; i >= 0; i--) {
            data.push({
                time: `${i}:00`,
                cpu: Math.floor(Math.random() * 80) + 10,
                memory: Math.floor(Math.random() * 70) + 20,
            });
        }
        return data;
    }
    return Promise.resolve(generateData());
}


// --- UBNT/MIMOSA API FUNCTIONS (PLACEHOLDERS) ---

/**
 * Tests the connection to a Dish device.
 * @param credentials - The device credentials.
 * @returns A promise that resolves if the connection is successful.
 * @throws An error if the connection fails.
 */
export const testDishConnection = async (credentials: DeviceCredentials): Promise<void> => {
  console.log(`[API] Testing connection to Dish: ${credentials.ip}`);
  // TODO: Implement actual connection test logic here (e.g., using axios).
  return new Promise(resolve => setTimeout(resolve, 300));
}


/**
 * Fetches the status and performance metrics for a Dish device.
 * @param credentials - The device credentials.
 * @returns A promise that resolves with the dish's status data.
 */
export const fetchDishStatus = async (credentials: DeviceCredentials): Promise<Partial<Dish>> => {
    console.log(`[API] Fetching status for Dish: ${credentials.ip}`);
    // TODO: Implement actual API call to get device status (e.g., status.cgi).
    // This is placeholder data.
    return new Promise(resolve => setTimeout(() => resolve({
        status: 'Online',
        signalStrength: -Math.floor(Math.random() * 30) - 40, // -40 to -70
        noiseFloor: -Math.floor(Math.random() * 10) - 90, // -90 to -100
        txRate: Math.floor(Math.random() * 300) + 50,
        rxRate: Math.floor(Math.random() * 300) + 50,
        uptime: `${Math.floor(Math.random() * 30)}d ${Math.floor(Math.random() * 23)}h`,
    }), 200));
}
