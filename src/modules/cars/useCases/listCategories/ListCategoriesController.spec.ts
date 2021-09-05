import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('Create Category Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const passwordAdmin = await hash('admin', 8);
    const passwordUser = await hash('user', 8);

    await connection.query(
      `INSERT INTO users(id, name, email, password, "isAdmin", created_at, driver_license)
        values('${id}', 'admin', 'admin@rentx.com.br', '${passwordAdmin}', true, 'NOW()', 'ABD-5555')
      `,
    );
    await connection.query(
      `INSERT INTO users(id, name, email, password, "isAdmin", created_at, driver_license)
        values('${uuidV4()}', 'user', 'user@rentx.com.br', '${passwordUser}', false, 'NOW()', 'ABD-4444')
      `,
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();

    await connection.close();
  });

  it('should be able to list all categories as an admin user', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body;

    await request(app)
      .post('/categories')
      .send({
        name: 'Category Supertest',
        description: 'Category Supertest',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app).get('/categories');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty('id');
  });
});