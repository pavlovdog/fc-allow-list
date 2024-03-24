import { headers } from "next/headers";
import Knex from 'knex';
import { Client } from 'pg';

export function currentURL(pathname: string): URL {
  const headersList = headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";

  try {
    return new URL(pathname, `${protocol}://${host}`);
  } catch (error) {
    return new URL("http://localhost:3000");
  }
}

export function vercelURL() {
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined;
}


export type AllowListRecord = {
  fid: number;
  address: `0x${string}`;
}



export class AllowList {
  private knex: ReturnType<typeof Knex>;
  private client: Client;

  constructor() {
    this.knex = Knex({
      client: 'pg',
      connection: {
        charset: 'utf8',
        timezone: 'UTC',
        user: process.env.REPLICATOR_DB_USER,
        password: process.env.REPLICATOR_DB_PASSWORD,
        host: process.env.REPLICATOR_DB_HOST,
        port: Number(process.env.REPLICATOR_DB_PORT),
        database: process.env.REPLICATOR_DB_DATABASE,
      },
      debug: false,
      acquireConnectionTimeout: 300000, // 5 minute timeout
      pool: { min: 0, max: 100, propagateCreateError: false }, // Adjust pool settings as necessary
    });

    this.client = new Client({
      user: process.env.REPLICATOR_DB_USER,
      password: process.env.REPLICATOR_DB_PASSWORD,
      host: process.env.REPLICATOR_DB_HOST,
      port: Number(process.env.REPLICATOR_DB_PORT),
      database: process.env.REPLICATOR_DB_DATABASE,
    });
  }

  public async fetch(
    castHash: string,
    castFid: number,
    type: string
  ) {
    console.log('connect');
    console.log({
      user: process.env.REPLICATOR_DB_USER,
      password: process.env.REPLICATOR_DB_PASSWORD,
      host: process.env.REPLICATOR_DB_HOST,
      port: Number(process.env.REPLICATOR_DB_PORT),
      database: process.env.REPLICATOR_DB_DATABASE,
    });
    await this.client.connect();
    console.log('now')
    const result = await this.client.query('SELECT NOW()')
    console.log(result)

    if (type === 'byLike') {
      return this.fetchByLikes(castHash, castFid);
    } else {
      return this.fetchByComments(castHash, castFid);
    }
  }

  public async fetchByComments(
    parentHash: string,
    parentFid: number
  ) {
    return this.knex<AllowListRecord>('casts as c')
      .distinctOn('c.fid')
      .select('c.fid', this.knex.raw("v.claim->>'address' as address"))
      .join('verifications as v', 'c.fid', 'v.fid')
      .where('c.parent_hash', this.knex.raw("decode(?, 'hex')", [parentHash.replace('0x', '')]))
      .where('c.parent_fid', parentFid)
      .whereNull('c.deleted_at')
      .whereNull('v.deleted_at')
      .where(this.knex.raw("length(v.claim->>'address') = 42"))
      .orderBy(['c.fid', { column: 'c.created_at', order: 'asc' }]);
  }

  public async fetchByLikes(
    targetHash: string,
    targetFid: number
  ) {
    return this.knex<AllowListRecord>('reactions as r')
      .distinctOn('r.fid')
      .select('r.fid', this.knex.raw("v.claim->>'address' as address"))
      .join('verifications as v', 'r.fid', 'v.fid')
      .where('r.target_hash', this.knex.raw("decode(?, 'hex')", [targetHash.replace('0x', '')]))
      .where('r.target_fid', targetFid)
      .whereNull('r.deleted_at')
      .whereNull('v.deleted_at')
      .where(this.knex.raw("length(v.claim->>'address') = 42"))
      .orderBy(['r.fid', { column: 'r.created_at', order: 'asc' }]);
  }
}
