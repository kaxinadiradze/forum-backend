import type { Knex } from 'knex';
const tableName = 'users';
export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  await knex.schema.createTable(tableName, (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('username').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.text('bio'); // Optional bio
    table.string('avatar_url'); // Optional avatar URL
    table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp for registration
    table.timestamp('updated_at').defaultTo(knex.fn.now()); // Timestamp for the last update
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}
