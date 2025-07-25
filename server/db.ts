import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon serverless to use WebSockets in the Node.js environment
neonConfig.webSocketConstructor = ws;

// Check for required environment variable
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Initialize connection pool
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create Drizzle instance with our schema
export const db = drizzle({ client: pool, schema });