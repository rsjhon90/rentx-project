import dayjs from 'dayjs';
import { v4 as uuidV4 } from 'uuid';

import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/inMemory/RentalsRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

describe('Create Rental', () => {
  const dayAdd24Hours = dayjs().add(1, 'day').toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
    );
  });

  it('Should be able create a new rental', async () => {
    const rental = await createRentalUseCase.execute({
      user_id: uuidV4(),
      car_id: uuidV4(),
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('Should not be able create a new rental in open to same user', async () => {
    const user_id = uuidV4();

    await createRentalUseCase.execute({
      user_id,
      car_id: uuidV4(),
      expected_return_date: dayAdd24Hours,
    });

    expect(async () => {
      await createRentalUseCase.execute({
        user_id,
        car_id: uuidV4(),
        expected_return_date: dayAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able create a new rental in open to same car', async () => {
    const car_id = uuidV4();

    await createRentalUseCase.execute({
      user_id: uuidV4(),
      car_id,
      expected_return_date: dayAdd24Hours,
    });

    expect(async () => {
      await createRentalUseCase.execute({
        user_id: uuidV4(),
        car_id,
        expected_return_date: dayAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able create a new rental with minimum of 24 hours.', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: uuidV4(),
        car_id: uuidV4(),
        expected_return_date: new Date(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
