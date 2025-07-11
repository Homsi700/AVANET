import type { Server, Dish, PppoeUser, InterfaceStat, TrafficData } from './types';

const servers: Server[] = [];

const dishes: Dish[] = [];

const pppoeUsers: PppoeUser[] = [];

const interfaceStats: InterfaceStat[] = [];

const trafficData: TrafficData = [];


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
