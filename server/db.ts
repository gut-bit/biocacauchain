import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * Pool configuration.
 *
 * Uses DATABASE_URL for all connections (Neon, Railway Postgres, etc).
 * SSL is enabled by default for Neon serverless Postgres.
 */

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.warn("[db] ⚠️  No DATABASE_URL found. Set DATABASE_URL environment variable.");
}

export const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 10,
    min: 0,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 15_000,
    application_name: "gutcacau-server",
});

pool.on("error", (err) => {
    console.error("[db] Unexpected pool error:", err.message);
});

export const db = drizzle(pool);
export const isDbConnected = !!connectionString;
