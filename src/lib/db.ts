
import fs from 'fs/promises';
import path from 'path';
import type { Device } from './types';

// Resolve the path to the db.json file.
// Using __dirname ensures the path is correct whether running in dev or prod.
// In Next.js, we might need a more robust way to locate the project root if __dirname behaves unexpectedly.
// For now, let's assume it's in the root of the project.
const dbPath = path.resolve(process.cwd(), 'db.json');

type Database = {
    devices: Device[];
}

// Ensure the db.json file exists.
async function ensureDbFileExists() {
    try {
        await fs.access(dbPath);
    } catch (error) {
        // If the file doesn't exist, create it with an empty structure.
        await fs.writeFile(dbPath, JSON.stringify({ devices: [] }, null, 2), 'utf-8');
        console.log('Created db.json file.');
    }
}


/**
 * Reads the entire database from the JSON file.
 * @returns {Promise<Database>} A promise that resolves with the database content.
 */
export const readDB = async (): Promise<Database> => {
    await ensureDbFileExists();
    try {
        const fileContent = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(fileContent) as Database;
    } catch (error) {
        console.error('Error reading from db.json:', error);
        // If parsing fails or file is empty, return a default structure.
        return { devices: [] };
    }
};

/**
 * Writes the entire database to the JSON file.
 * @param {Database} data - The data to write to the file.
 * @returns {Promise<void>}
 */
export const writeDB = async (data: Database): Promise<void> => {
    await ensureDbFileExists();
    try {
        await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing to db.json:', error);
    }
};
