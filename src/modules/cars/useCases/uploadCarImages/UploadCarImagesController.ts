import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UploadCarImagesUseCase } from './UploadCarImagesUseCase';

interface IFiles {
  filename: string;
}

export class UploadCarImagesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const images = request.files as IFiles[];

    const uploadCarImagesUseCase = container.resolve(UploadCarImagesUseCase);
    const images_name = images.map(image => image.filename);

    await uploadCarImagesUseCase.execute({
      images_name,
      car_id: id,
    });

    return response.status(201).send();
  }
}
