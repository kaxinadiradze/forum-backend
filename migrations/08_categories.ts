import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('categories', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable().unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
  await knex('categories').insert([
    { name: 'Cybersecurity' },
    { name: 'Technology' },
    { name: 'Health' },
    { name: 'Science' },
    { name: 'Politics' },
    { name: 'Sports' },
    { name: 'Entertainment' },
    { name: 'Business' },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('categories');
}
