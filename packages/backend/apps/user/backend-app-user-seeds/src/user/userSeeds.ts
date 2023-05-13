import { UserDb } from '@cornie-js/backend-app-user-db/entities';
import { DeepPartial } from 'typeorm';

export const user1Password: string = 'password';

export const user1CreateQuery: DeepPartial<UserDb> = {
  email: 'mail@example.com',
  id: 'cb483108-fffb-4043-8168-cca05810ec8d',
  name: 'Bob',
  passwordHash: '$2a$10$dzf/KMU4mfDzXUYlMKVDZ.tUBdNIPYgRC6d24/yJYBoygJZbXZ2H2',
};

export const user2Password: string = 'password';

export const user2CreateQuery: DeepPartial<UserDb> = {
  email: 'mail2@example.com',
  id: '9b5e70cf-ed12-44d1-b9c5-44b1746fd16b',
  name: 'Alice',
  passwordHash: '$2a$10$dzf/KMU4mfDzXUYlMKVDZ.tUBdNIPYgRC6d24/yJYBoygJZbXZ2H2',
};

export const user3Password: string = 'password';

export const user3CreateQuery: DeepPartial<UserDb> = {
  email: 'mail3@example.com',
  id: 'f605e199-e186-4aff-bc9b-56a3ef8dc7e3',
  name: 'Jeff',
  passwordHash: '$2a$10$dzf/KMU4mfDzXUYlMKVDZ.tUBdNIPYgRC6d24/yJYBoygJZbXZ2H2',
};

export const user4Password: string = 'password';

export const user4CreateQuery: DeepPartial<UserDb> = {
  email: 'mail4@example.com',
  id: '32d9b9a6-d98b-4cee-884c-7cf35a7650e5',
  name: 'Sarah',
  passwordHash: '$2a$10$dzf/KMU4mfDzXUYlMKVDZ.tUBdNIPYgRC6d24/yJYBoygJZbXZ2H2',
};
