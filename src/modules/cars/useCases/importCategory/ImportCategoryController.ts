import { Request, Response } from 'express';

import { ImportCategoryUseCase } from './ImportCategoryUseCase';

export class ImportCategoryController {
  constructor(private importCategoryUseCase: ImportCategoryUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { file } = request;

      const result = await this.importCategoryUseCase.execute(file);
      return response.json(result);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }
}
