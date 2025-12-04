import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

let pool: Pool | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

export function isDatabaseAvailable(): boolean {
  return !!process.env.DATABASE_URL;
}

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
  }
  
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  
  if (!dbInstance) {
    dbInstance = drizzle({ client: pool, schema });
  }
  
  return dbInstance;
}

export { pool };
export const db = isDatabaseAvailable() ? getDb() : null as any;
