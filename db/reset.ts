import 'dotenv/config';
import { Client } from 'pg';

if (process.env.NODE_ENV !== 'development') {
  console.error('‼️ Database reset is only allowed in development environment ‼️');
  process.exit(1);
}

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function reset() {
  try {
    await client.connect();
    await client.query('DROP SCHEMA public CASCADE;');
    await client.query('CREATE SCHEMA public;');
    console.log('💚 Schema dropped 💚');
  } catch (error) {
    console.error('🚨 Error resetting schema:', error);
  } finally {
    await client.end();
  }
}

reset();
