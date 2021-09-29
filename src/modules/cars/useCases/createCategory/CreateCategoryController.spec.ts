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

  it('should be able to create a new category', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post('/categories')
      .send({
        name: 'Category Supertest',
        description: 'Category Supertest',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it('Should not be able create a new category with name exists', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post('/categories')
      .send({
        name: 'Category Supertest',
        description: 'Category Supertest',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
  });

  it('Should not be able create a new category as a non-admin user', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'user@rentx.com.br',
      password: 'user',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post('/categories')
      .send({
        name: 'Category non-admin Supertest',
        description: 'Category non-admin Supertest',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(401);
  });
});
