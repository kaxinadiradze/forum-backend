import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del(); // Clear existing users

  const hashedPassword = await bcrypt.hash('password123', 10);

  await knex('users').insert([
    {
      id: 'e1c6b9a2-4a3c-4a5b-8a77-1f7b239f51c3',
      username: 'testuser1',
      email: 'testuser1@example.com',
      password: hashedPassword,
      bio: 'I am test user 1.',
      avatar_url: 'https://example.com/avatar1.png',
      two_step_enabled: false,
      is_banned: false,
    },
    {
      id: 'f2d9b8c3-6a4b-4a3d-9b88-2c8d339f62d4',
      username: 'testuser2',
      email: 'testuser2@example.com',
      password: hashedPassword,
      bio: 'I am test user 2.',
      avatar_url: 'https://example.com/avatar2.png',
      two_step_enabled: false,
      is_banned: false,
    },
    {
      id: '043c5ec5-0c85-4234-90a3-15c62a74a9b1',
      username: 'testuser3',
      email: 'testuser3@example.com',
      password: hashedPassword,
      bio: 'I am test user 3.',
      avatar_url: 'https://example.com/avatar3.png',
      two_step_enabled: false,
      is_banned: false,
    },
    {
      id: '07cb61bd-2bce-4d9a-8bda-c3adb9e06334',
      username: 'testuser4',
      email: 'testuser4@example.com',
      password: hashedPassword,
      bio: 'I am test user 4.',
      avatar_url: 'https://example.com/avatar4.png',
      two_step_enabled: false,
      is_banned: true,
    },
  ]);
}
