import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (connectionString) {
      this.pool = new Pool({
        connectionString,
        ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
      });
    } else {
      this.pool = new Pool({
        host: process.env.PG_HOST || 'localhost',
        port: parseInt(process.env.PG_PORT || '5432'),
        database: process.env.PG_DATABASE || 'travel_db',
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSWORD || 'postgres',
      });
    }
  }

  async onModuleInit() {
    try {
      const client = await this.pool.connect();
      console.log('✅ Kết nối thành công đến PostgreSQL database!');

      try {
        await client.query(`
          ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE;
          ALTER TABLE users ALTER COLUMN email DROP NOT NULL;
          ALTER TABLE users ALTER COLUMN name DROP NOT NULL;
        `);
      } catch (e: any) {}

      client.release();
    } catch (err: any) {
      const errorDetail = err.message || err.code || JSON.stringify(err);
      console.error(`❌ Lỗi kết nối CSDL PostgreSQL: ${errorDetail}`);
    }
  }

  async query(text: string, params?: any[]): Promise<QueryResult<any>> {
    return this.pool.query(text, params);
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
