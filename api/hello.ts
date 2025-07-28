import postgres from 'postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

console.log('✅ Starting handler...');
console.log('✅ DATABASE_URL is:', process.env.DATABASE_URL);

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    console.log('📥 Incoming request to /api/hello');
    const result = await sql`SELECT 'Hello from Neon!' AS message`;

    console.log('✅ Query result:', result);
    res.status(200).json(result[0]);
  } catch (err: any) {
    console.error('❌ Error in /api/hello:', err.message);
    res.status(500).json({ error: err.message });
  }
}
