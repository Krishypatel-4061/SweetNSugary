/**
 * lib/db.ts
 *
 * Shared PostgreSQL connection pool using the `pg` library.
 * The pool is created once and re-used across all API routes and
 * server actions to avoid exhausting database connections.
 *
 * DATABASE_URL is loaded from the .env.local file and points to
 * the Neon serverless PostgreSQL instance.
 */

import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        // Required for hosted databases (e.g. Neon) that use self-signed certs
        rejectUnauthorized: false,
    },
});

export default pool;
