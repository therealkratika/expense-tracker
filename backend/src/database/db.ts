import pg from 'pg';
import dotenv from 'dotenv';
import process from 'process';
dotenv.config();
const pool: pg.Pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
pool
  .connect()
  .then(() => console.log('PostgreSQL connected'))
  .catch((err: Error) => console.error('PostgreSQL connection error:', err));

pool.on('error', (err: Error) => {
  console.error('Unexpected PostgreSQL error:', err);
});

export default pool;