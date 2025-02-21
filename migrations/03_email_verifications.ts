import type { Knex } from 'knex';

const tableName = 'email_verifications';

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'); // Ensure uuid-ossp extension is available

  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').references('id').inTable('users').notNullable();
    table.string('new_email').notNullable();
    table.string('verification_token').notNullable();
    table.timestamp('token_expires_at').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(tableName); // Drop the table when rolling back
}
