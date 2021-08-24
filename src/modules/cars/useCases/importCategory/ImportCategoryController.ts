import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ImportCategoryUseCase } from './ImportCategoryUseCase';

export class ImportCategoryController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { file } = request;

      const importCategoryUseCase = container.resolve(ImportCategoryUseCase);

      await importCategoryUseCase.execute(file);
      return response.status(201).send();
    } catch (err) {
      console.error(err);
      return response.status(400).json({ error: err.message });
    }
  }
}
