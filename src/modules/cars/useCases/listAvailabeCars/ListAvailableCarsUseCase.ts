import { inject, injectable } from 'tsyringe';
import { validate as isUuid } from 'uuid';

import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';

import { IRequest } from './IListAvailableCarsDTO';

@injectable()
export class ListAvailableCarsUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  async execute({ name, brand, category_id }: IRequest): Promise<Car[]> {
    if (!isUuid(category_id)) {
      // eslint-disable-next-line no-param-reassign
      category_id = undefined;
    }

    const cars = await this.carsRepository.findAvailable({
      brand,
      category_id,
      name,
    });

    return cars;
  }
}
