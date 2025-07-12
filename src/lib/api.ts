/**
 * @file This file contains the functions that interact with the network devices' APIs.
 * It uses the 'node-routeros' library to communicate with MikroTik devices.
 */
import type { Server, Dish, PppoeUser, InterfaceStat, TrafficData, AddPppoeUserPayload, DeviceCredentials, ResourceData } from './types';
import { RouterOSAPI, RosException } from 'node-routeros';
import { Transform } from 'stream';

// Helper function to connect, execute, and close the connection to a MikroTik device.
async function executeMikroTikCommand(credentials: DeviceCredentials, command: string, params: any[] = []): Promise<any[]> {
    const portsToTry = credentials.port ? [credentials.port] : [8728, 7070];
    let lastError: Error | null = null;
    let finalPort = credentials.port ? credentials.port.toString() : portsToTry.join(' & ');

    for (const port of portsToTry) {
        const conn = new RouterOSAPI({
            host: credentials.ip,
            user: credentials.username,
            password: credentials.password,
            port: port,
            timeout: 10, // 10 second timeout
        });

        try {
            await conn.connect();
            const results = await conn.write(command, params);
            // If connection and command are successful, close and return results
            if (conn.connected) {
                await conn.close();
            }
            return results;
        } catch (err: any) {
            lastError = err;
            console.log(`[API] Connection to ${credentials.ip}:${port} failed. Trying next port if available.`);
            if (conn.connected) {
                await conn.close();
            }
        }
    }
    
    if (lastError) {
         if ((lastError as any).code === 'ETIMEDOUT' || (lastError instanceof Error && lastError.message.includes('Timed out'))) {
             throw new Error(`Connection timed out to ${credentials.ip}:${finalPort}. Please check network connectivity and firewall rules. Ensure the API service (port ${portsToTry.join('/')}) is enabled and accessible on the MikroTik device, not the WinBox port.`);
        }
        if (lastError instanceof RosException) {
            throw new Error(`MikroTik API Error: ${lastError.message}. Check your username and password.`);
        }
    }
    
    throw new Error(`Connection failed to ${credentials.ip}:${finalPort}. Check credentials and that the API service is not restricted.`);
}

// --- MIKROTIK API FUNCTIONS ---

/**
 * Tests the connection to a MikroTik server.
 * @param credentials - The device credentials.
 * @returns A promise that resolves if the connection is successful.
 * @throws An error if the connection fails.
 */
export const testMikroTikConnection = async (credentials: DeviceCredentials): Promise<void> => {
    console.log(`[API] Testing connection to MikroTik: ${credentials.ip}:${credentials.port ? credentials.port : 'default ports'}`);
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
 * Fetches the available PPPoE profiles from a MikroTik server.
 * @param credentials - The device credentials.
 * @returns A promise that resolves with an array of profile names.
 */
export const fetchMikroTikProfiles = async (credentials: DeviceCredentials): Promise<string[]> => {
    console.log(`[API] Fetching PPPoE profiles for: ${credentials.ip}`);
    const results = await executeMikroTikCommand(credentials, '/ppp/profile/print', ['?.proplist=name']);
    return results.map((profile: any) => profile.name);
}


/**
 * Adds a new PPPoE user to a MikroTik server.
 * @param payload - The PPPoE user details, including credentials.
 * @throws An error if adding the user fails.
 */
export const addMikroTikPppoeUser = async (payload: AddPppoeUserPayload): Promise<void> => {
    console.log(`[API] Adding PPPoE user '${payload.username}' to server with IP ${payload.ip}`);
    await executeMikroTikCommand(payload, '/ppp/secret/add', [
        `=name=${payload.username}`,
        `=password=${payload.userPassword}`,
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

// Helper function to split an array into chunks of a specific size.
function chunkArray<T>(array: T[], size: number): T[][] {
    const chunked_arr: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunked_arr.push(array.slice(i, i + size));
    }
    return chunked_arr;
}

/**
 * Fetches interface statistics from a MikroTik server.
 * This version iterates through each interface individually for better compatibility with older RouterOS versions.
 * @param credentials - The device credentials.
 * @returns A promise that resolves with an array of interface stats.
 */
export const fetchInterfaceStats = async (credentials: DeviceCredentials): Promise<InterfaceStat[]> => {
    console.log(`[API] Fetching interface stats for: ${credentials.ip}`);
    
    let conn: RouterOSAPI | null = null;
    try {
        const portsToTry = credentials.port ? [credentials.port] : [8728, 7070];
        
        for (const port of portsToTry) {
             try {
                conn = new RouterOSAPI({
                    host: credentials.ip,
                    user: credentials.username,
                    password: credentials.password,
                    port: port,
                    timeout: 15,
                });
                await conn.connect();
                break;
             } catch (err) {
                 console.log(`[API] Connection attempt to ${credentials.ip}:${port} failed.`);
                 if (conn && conn.connected) await conn.close();
                 conn = null;
             }
        }

        if (!conn || !conn.connected) {
             throw new Error(`Could not establish API connection to ${credentials.ip} on attempted ports.`);
        }

        const interfaces = await conn.write('/interface/print');
        const statsMap = new Map<string, any>();

        // Iterate through each interface and monitor it individually
        for (const iface of interfaces) {
            const ifaceName = iface.name;
            if (!ifaceName) continue; // Skip interfaces without a name

            try {
                // Use `=interface=${ifaceName}` which works even with spaces on single lookups
                const trafficStream = conn.stream(['/interface/monitor-traffic', `=interface=${ifaceName}`, '=once=']);
                const trafficData: any = await new Promise((resolve, reject) => {
                    trafficStream.once('data', resolve);
                    trafficStream.once('error', reject);
                    setTimeout(() => reject(new Error(`Timeout monitoring interface: ${ifaceName}`)), 2000); // 2s timeout per interface
                });
                statsMap.set(ifaceName, trafficData);
            } catch (error) {
                console.error(`[API] Could not monitor traffic for interface "${ifaceName}":`, error);
                // Set a default/error state for this interface's traffic
                statsMap.set(ifaceName, { 'rx-bits-per-second': 0, 'tx-bits-per-second': 0 });
            }
        }
        
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
        console.error(`[ Server ] Error fetching interface stats: ${err.message}`);
        throw err;
    } finally {
        if (conn && conn.connected) {
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
