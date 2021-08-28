import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { UsersRepository } from '@modules/accounts/infra/typeorm/repositories/UsersRepository';
import { AppError } from '@shared/errors/AppError';

interface IPayload {
  sub: string;
}

async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token missing', 401);
  }

  const [, token] = authHeader.split(' ');

  console.log(token);

  try {
    const { sub: user_id } = verify(
      token,
      '3edd465b-6ae5-47d8-8644-a57a62aa8f51',
    ) as IPayload;

    const usersRepository = new UsersRepository();

    const user = await usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User does not Exists', 401);
    }

    request.user = {
      id: user_id,
    };

    return next();
  } catch {
    throw new AppError('Invalid token', 401);
  }
}

export { ensureAuthenticated };
