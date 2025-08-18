import 'dotenv/config';
import { Client } from 'pg';

const client = new Client({ connectionString: process.env.DATABASE_URL });

try {
	await client.connect();
	await client.query(`DROP SCHEMA public CASCADE;`);
	await client.query(`CREATE SCHEMA public;`);
	console.log(`💚 Schema dropped 💚`);
} catch (error) {
	console.error(`🚨 Error resetting schema:`, error);
} finally {
	await client.end();
}
