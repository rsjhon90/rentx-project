import { v4 as uuidV4 } from 'uuid';

import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { SpecificationsRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;

describe('Create Car Specification', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory,
    );
  });

  it('should NOT be able to add a specification to a non-existent car', async () => {
    const car_id = uuidV4();
    const specifications_id = [uuidV4(), uuidV4()];

    await expect(
      createCarSpecificationUseCase.execute({
        car_id,
        specifications_id,
      }),
    ).rejects.toEqual(new AppError('Car does not Exists.', 404));
  });

  it('should be able to add a new specification to the car', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Mustang',
      description: 'Description Car',
      daily_rate: 140,
      license_plate: 'TTT-55588',
      fine_amount: 100,
      brand: 'Ford',
      category_id: uuidV4(),
    });

    await carsRepositoryInMemory.create({
      name: 'Car2',
      description: 'Description Car',
      daily_rate: 140,
      license_plate: 'TTT-55588',
      fine_amount: 100,
      brand: 'Subaru',
      category_id: uuidV4(),
    });

    const spec1 = await specificationsRepositoryInMemory.create({
      name: 'Câmbio automático',
      description: 'Carro com câmbio automático',
    });
    const spec2 = await specificationsRepositoryInMemory.create({
      name: 'sport',
      description: 'Carro com câmbio automático',
    });

    const specifications_id = [spec1.id, spec2.id];

    const specificationsCars = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id,
    });

    expect(specificationsCars).toHaveProperty('specifications');
    expect(specificationsCars.specifications.length).toBe(2);
  });
});
