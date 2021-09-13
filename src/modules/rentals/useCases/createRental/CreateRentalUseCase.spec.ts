import dayjs from 'dayjs';
import { v4 as uuidV4 } from 'uuid';

import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/inMemory/RentalsRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

describe('Create Rental', () => {
  const dayAdd24Hours = dayjs().add(1, 'days').toDate();
  let car: Car;

  beforeEach(async () => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
      carsRepositoryInMemory,
    );

    car = await carsRepositoryInMemory.create({
      name: 'Car1',
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Brand',
      category_id: 'category',
    });
  });

  it('Should be able create a new rental', async () => {
    const rental = await createRentalUseCase.execute({
      user_id: uuidV4(),
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('When renting a car, it should no longer be available.', async () => {
    await createRentalUseCase.execute({
      user_id: uuidV4(),
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    expect(car.available).toBeFalsy();
  });

  it('Should not be able create a new rental in open to same user', async () => {
    const user_id = uuidV4();

    await createRentalUseCase.execute({
      user_id,
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id,
        car_id: uuidV4(),
        expected_return_date: dayAdd24Hours,
      }),
    ).rejects.toEqual(new AppError("There's a rental in progress for user!"));
  });

  it('Should not be able create a new rental in open to same car', async () => {
    await createRentalUseCase.execute({
      user_id: uuidV4(),
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: uuidV4(),
        car_id: car.id,
        expected_return_date: dayAdd24Hours,
      }),
    ).rejects.toEqual(new AppError('Car is unavailable!'));
  });

  it('Should not be able create a new rental with minimum of 24 hours.', async () => {
    await expect(
      createRentalUseCase.execute({
        user_id: uuidV4(),
        car_id: uuidV4(),
        expected_return_date: new Date(),
      }),
    ).rejects.toEqual(new AppError('Minimum rental time is 24 hours.'));
  });
});
