import { Knex } from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('payments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('stripe_session_id').unique().notNullable();
    table
      .uuid('recipient_id')
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.integer('amount').notNullable();
    table.string('currency').notNullable();
    table.string('status').notNullable().defaultTo('pending');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('payments');
}
