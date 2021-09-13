import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';

import { IRentalsRepository } from '../IRentalsRepository';

export class RentalsRepositoryInMemory implements IRentalsRepository {
  rentals: Rental[] = [];

  async create({
    car_id,
    expected_return_date,
    user_id,
    end_date,
    id,
    total,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = Object.assign(new Rental(), {
      car_id,
      expected_return_date,
      user_id,
      start_date: new Date(),
    });

    if (!id) {
      this.rentals.push(rental);
    }

    if (id) {
      const index = this.rentals.findIndex(rental => rental.id === id);
      this.rentals[index].end_date = end_date;
      this.rentals[index].total = total;

      return this.rentals[index];
    }

    return rental;
  }
  async findOpenRentalByCar(cars_id: string): Promise<Rental> {
    return this.rentals.find(
      rental => rental.car_id === cars_id && !rental.end_date,
    );
  }
  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    return this.rentals.find(
      rental => rental.user_id === user_id && !rental.end_date,
    );
  }

  async findById(id: string): Promise<Rental> {
    const rental = this.rentals.find(rental => rental.id === id);

    return rental;
  }

  async findAllRentalsByUser(user_id: string): Promise<Rental[]> {
    const rentals = this.rentals.filter(rental => rental.user_id === user_id);

    return rentals;
  }
}
