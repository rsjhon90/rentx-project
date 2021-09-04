import { inject, injectable } from 'tsyringe';

import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

@injectable()
export class CreateRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({
    user_id,
    car_id,
    expected_return_date,
  }: IRequest): Promise<Rental> {
    const carUnavailable = await this.rentalsRepository.findOpenRentalByCar(
      car_id,
    );
    if (carUnavailable) {
      throw new AppError('Car is unavailable!');
    }

    const rentalOpenToUser = await this.rentalsRepository.findOpenRentalByUser(
      user_id,
    );
    if (rentalOpenToUser) {
      throw new AppError("There's a rental in progress for user!");
    }

    const minimumHourToRental = 24;
    const dateNow = this.dateProvider.dateNow();
    const hoursCompared = this.dateProvider.compareInHours(
      dateNow,
      expected_return_date,
    );
    if (hoursCompared < minimumHourToRental) {
      throw new AppError('Minimum rental time is 24 hours.');
    }

    const rental = await this.rentalsRepository.create({
      car_id,
      user_id,
      expected_return_date,
    });

    return rental;
  }
}
