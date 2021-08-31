import { hash } from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';

import crateConnection from '../index';

async function create() {
  const connection = await crateConnection('localhost');

  const id = uuidV4();
  const password = await hash('admin', 8);

  await connection.query(
    `INSERT INTO users(id, name, email, password, "isAdmin", created_at, driver_license)
      values('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'NOW()', 'ABD-5555')
    `,
  );

  await connection.close();
}

create().then(() => console.log('User admin created'));
