import { Request, Response } from 'express';

import { ListCategoriesUseCase } from './ListCategoriesUseCase';

export class ListCategoriesController {
  constructor(private listCategoriesUseCase: ListCategoriesUseCase) {}

  handle(request: Request, response: Response): Response {
    try {
      const categories = this.listCategoriesUseCase.execute();

      return response.json(categories);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }
}
