import express, { NextFunction, Request, Response } from 'express';
import 'reflect-metadata';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';

import { AppError } from '@shared/errors/AppError';
import createConnection from '@shared/infra/typeorm/index';
// import '@shared/infra/typeorm/index';
import '@shared/container';

import swaggerFile from '../../../swagger.json';
import { router } from './routes';

createConnection();
const app = express();
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);

app.use(
  (err: Error, _request: Request, response: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    console.log(err);
    return response.status(500).json({
      status: 'error',
      message: `Internal Server Error - ${err.message}`,
    });
  },
);

export { app };
