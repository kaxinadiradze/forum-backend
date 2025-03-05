import Knex from 'knex';
import { Client } from 'pg';

// Configuration for connecting to the default PostgreSQL database
const defaultKnex = Knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres', // replace with your DB user
    password: '12341234', // replace with your DB password
    database: 'forum_db', // connect to the default database
  },
});

// Function to create a new test database
export async function createTestDatabase(): Promise<Knex.Knex<any, unknown[]>> {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: '12341234',
    port: 5432,
  });

  await client.connect();
  const dbName = 'forum_db_test';
  try {
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`,
    );

    if (result.rowCount === 0) {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created`);
    } else {
      console.log(`Database ${dbName} already exists`);
    }

    const knexForTestDb = Knex({
      client: 'pg',
      connection: {
        host: 'localhost',
        user: 'postgres',
        password: '12341234',
        database: dbName,
      },
    });

    // Run migrations and seeds
    await knexForTestDb.migrate.latest();
    console.log('Migrations run successfully.');

    await knexForTestDb.seed.run(); // Ensure seed data is inserted
    console.log('Seed files run successfully.');

    return knexForTestDb;
  } catch (error) {
    console.error('Error during database setup:', error);
  } finally {
    await client.end();
  }
}

// Function to drop a test database
export async function dropTestDatabase() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: '12341234',
    port: 5432,
  });
  await client.connect();
  const dbName = 'forum_db_test';
  await client.query(
    `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${dbName}';`,
  );
  await client.query(`DROP DATABASE IF EXISTS ${dbName}`);
  console.log(`Database ${dbName} dropped`);
  await client.end();
}

export const checkDatabaseExists = async (dbName) => {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: '12341234',
    port: 5432,
  });

  await client.connect();
  const result = await client.query(
    `SELECT 1 FROM pg_database WHERE datname = '${dbName}';`,
  );
  await client.end();
  return result.rowCount > 0;
};

// Cleanup function to close the default Knex connection
export async function cleanup() {
  await defaultKnex.destroy();
}
