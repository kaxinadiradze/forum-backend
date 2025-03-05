import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('reset_tokens').del(); // Clear existing data

  await knex('reset_tokens').insert([
    { id: 'ee27da27-0957-4123-b0dd-14da2175b029', name: 'member' },
    { id: 'f3b8a1e3-2d52-4a1b-bf48-64871a9e0c53', name: 'moderator' },
    { id: 'd92a44b1-5ea6-489d-bca6-4fa7e93c1a2a', name: 'vip' },
  ]);
}
