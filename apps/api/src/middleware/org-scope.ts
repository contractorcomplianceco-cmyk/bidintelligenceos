import type { Request, Response, NextFunction } from "express";
import pg from "pg";
import { getDb, isPostgresDriver, runPgOrgClient } from "../db/client.js";
import type { AuthedRequest } from "./auth.js";

let pool: pg.Pool | null = null;

function getPool() {
  if (!pool) {
    getDb();
    pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 12 });
  }
  return pool;
}

/** Request-scoped Postgres connection with app.org_id for RLS policies. */
export async function orgScopeMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!isPostgresDriver()) {
    next();
    return;
  }

  const auth = (req as AuthedRequest).auth;
  if (!auth?.orgId) {
    next();
    return;
  }

  const client = await getPool().connect();
  let released = false;
  const release = () => {
    if (!released) {
      released = true;
      client.release();
    }
  };
  res.on("finish", release);
  res.on("close", release);

  try {
    await client.query(`SELECT set_config('app.org_id', $1, false)`, [auth.orgId]);
    runPgOrgClient(client, () => next());
  } catch (error) {
    release();
    next(error);
  }
}
