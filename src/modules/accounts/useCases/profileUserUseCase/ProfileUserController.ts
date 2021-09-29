import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ProfileUserUseCase } from './ProfileUserUseCase';

export class ProfileUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;

    const profileUserUseCase = container.resolve(ProfileUserUseCase);

    const profile = await profileUserUseCase.execute(user_id);

    return response.json(profile);
  }
}
