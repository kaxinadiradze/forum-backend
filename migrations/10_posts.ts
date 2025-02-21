import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('posts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.text('content');
    table.uuid('thread_id').references('id').inTable('threads');
    table.uuid('user_id').references('id').inTable('users');
    table
      .uuid('parent_post_id')
      .nullable()
      .references('id')
      .inTable('posts')
      .onDelete('CASCADE');
    table.integer('views').defaultTo(0);
    table.boolean('is_locked').defaultTo(false);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('posts');
}
