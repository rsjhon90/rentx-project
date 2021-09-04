import { inject, injectable } from 'tsyringe';
import { validate as isUuid } from 'uuid';

import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { ISpecificationRepository } from '@modules/cars/repositories/ISpecificationsRepository';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  car_id: string;
  specifications_id: string[];
}

@injectable()
export class CreateCarSpecificationUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('SpecificationsRepository')
    private specificationsRepository: ISpecificationRepository,
  ) {}

  async execute({ car_id, specifications_id }: IRequest): Promise<Car> {
    if (!isUuid(car_id)) {
      throw new AppError('Car does not Exists');
    }

    const carExists = await this.carsRepository.findById(car_id);
    if (!carExists) {
      throw new AppError('Car does not Exists');
    }

    const specifications = await this.specificationsRepository.findByIds(
      specifications_id,
    );

    carExists.specifications = specifications;

    await this.carsRepository.create(carExists);

    return carExists;
  }
}
