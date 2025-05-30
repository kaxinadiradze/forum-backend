import type { Knex } from 'knex';
export const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'forum_db',
      user: 'postgres',
      password: '12341234',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations',
      extension: 'ts',
    },
  },
  test: {
    client: 'postgresql',
    connection: {
      database: 'forum_db_test',
      user: 'postgres',
      password: '12341234',
    },
    seeds: {
      directory: './seeds',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './migrations',
      extension: 'ts',
    },
  },
};

module.exports = config;
