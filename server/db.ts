import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * Pool configuration.
 *
 * Prefer individual PG env vars (PGHOST, PGUSER, PGPASSWORD, PGDATABASE)
 * to avoid URL-encoding issues with special characters in passwords.
 * Falls back to DATABASE_URL if individual vars are not set.
 *
 * Cloud SQL Auth Proxy (unix socket) handles TLS — no ssl needed.
 */

const hasIndividualVars = !!(process.env.PGHOST && process.env.PGUSER && process.env.PGDATABASE);
const connectionString = !hasIndividualVars ? process.env.DATABASE_URL : undefined;

if (!hasIndividualVars && !connectionString) {
    console.warn("[db] ⚠️  No DB credentials found. Set PGHOST/PGUSER/PGPASSWORD/PGDATABASE or DATABASE_URL.");
}

export const pool = new Pool(
    hasIndividualVars
        ? {
            host: process.env.PGHOST,
            user: process.env.PGUSER,
            password: process.env.PGPASSWORD,
            database: process.env.PGDATABASE,
            ssl: { rejectUnauthorized: false },
            max: 10,
            min: 2,
            idleTimeoutMillis: 30_000,
            connectionTimeoutMillis: 5_000,
            application_name: "gutcacau-server",
        }
        : {
            connectionString: connectionString!,
            ssl: { rejectUnauthorized: false },
            max: 10,
            min: 2,
            idleTimeoutMillis: 30_000,
            connectionTimeoutMillis: 5_000,
            application_name: "gutcacau-server",
        }
);

pool.on("error", (err) => {
    console.error("[db] Unexpected pool error:", err.message);
});

export const db = drizzle(pool);
export const isDbConnected = hasIndividualVars || !!connectionString;
