import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client.js';

console.log('DATABASE_URL:', process.env.DATABASE_URL);

const prisma = new PrismaClient();

try {
  const res = await prisma.$queryRaw`SELECT 1`;
  console.log('DB QUERY OK:', res);
} catch (err) {
  console.error('DB QUERY ERROR:', err && err.message ? err.message : err);
  if (err && err.cause) console.error('Cause:', err.cause);
} finally {
  await prisma.$disconnect();
}
