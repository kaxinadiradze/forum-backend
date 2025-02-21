import { Knex } from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('reports', function (table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('reporter_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .uuid('reported_user_id')
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .uuid('reported_post_id')
      .nullable()
      .references('id')
      .inTable('posts')
      .onDelete('CASCADE');
    table.text('reason').notNullable();
    table
      .enu('status', ['pending', 'reviewed', 'resolved'])
      .defaultTo('pending');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTableIfExists('reports');
}
