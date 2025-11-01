import 'dotenv/config';
import { query } from '../lib/db';

async function migrate() {
  try {
    console.log('Starting migration...');

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Users table created successfully');

    // Create an index on email for faster lookups
    await query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
