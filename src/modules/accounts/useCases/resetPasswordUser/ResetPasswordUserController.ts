import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ResetPasswordUserUseCase } from './ResetPasswordUserUseCase';

export class ResetPasswordUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const token = request.query.token as string;
    const { password } = request.body;

    const resetPasswordUserUseCase = container.resolve(
      ResetPasswordUserUseCase,
    );

    await resetPasswordUserUseCase.execute({
      token,
      password,
    });

    return response.send();
  }
}
