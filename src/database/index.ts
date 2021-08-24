import { createConnection, getConnectionOptions } from 'typeorm';

interface IOptions {
  host: string;
}

getConnectionOptions().then(options => {
  const newOptions = options as IOptions;

  newOptions.host = 'database';
  createConnection({
    ...options,
  })
    .then()
    .catch(err => {
      console.error('Unable to connect to the database: ', err);
    });
});

// createConnection()
//   .then()
//   .catch(err => {
//     console.error('Unable to connect to the database: ', err);
//   });
