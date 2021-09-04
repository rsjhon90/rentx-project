import { getRepository, Repository } from 'typeorm';

import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';

import { Rental } from '../entities/Rental';

export class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async create({
    user_id,
    car_id,
    expected_return_date,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      user_id,
      car_id,
      expected_return_date,
      start_date: new Date(),
    });

    await this.repository.save(rental);

    return rental;
  }

  async findOpenRentalByCar(car_id: string): Promise<Rental> {
    const OpenByCar = await this.repository.findOne({
      where: { car_id, end_date: null },
    });

    return OpenByCar;
  }

  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    const OpenByUser = await this.repository.findOne({
      where: { user_id, end_date: null },
    });

    return OpenByUser;
  }
}
