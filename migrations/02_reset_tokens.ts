import type { Knex } from 'knex';

const tableName = 'reset_tokens';

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'); // Ensure uuid-ossp extension is available

  return knex.schema.createTable(tableName, (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()')); // Primary key as UUID
    t.string('email').notNullable();
    t.uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    t.string('reset_token');
    t.timestamp('reset_token_expires_at', { useTz: true });
    t.unique(['email', 'user_id']);
    t.foreign('email')
      .references('email')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(tableName); // Drop the table when rolling back
}
