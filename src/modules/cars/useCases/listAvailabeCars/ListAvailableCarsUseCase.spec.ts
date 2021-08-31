import { v4 as uuidV4 } from 'uuid';

import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('List cars', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory,
    );
  });

  it('should be able to list all available cars', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car1',
      description: 'Description Car',
      daily_rate: 140,
      license_plate: 'TTT-55588',
      fine_amount: 100,
      brand: 'Car_brand',
      category_id: 'category_id',
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it('should be able list all available cars by name', async () => {
    const car1 = await carsRepositoryInMemory.create({
      name: 'Car1',
      description: 'Description Car',
      daily_rate: 140,
      license_plate: 'TTT-55588',
      fine_amount: 100,
      brand: 'Ford',
      category_id: '1',
    });

    await carsRepositoryInMemory.create({
      name: 'Car2',
      description: 'Description Car',
      daily_rate: 140,
      license_plate: 'TTT-55588',
      fine_amount: 100,
      brand: 'Subaru',
      category_id: '2',
    });

    await carsRepositoryInMemory.create({
      name: 'Car3',
      description: 'Description Car',
      daily_rate: 140,
      license_plate: 'TTT-55588',
      fine_amount: 100,
      brand: 'BMW',
      category_id: '3',
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: 'Car1',
    });

    expect(cars).toEqual(
      expect.arrayContaining([expect.objectContaining(car1)]),
    );
  });

  it('should be able list all available cars by brand', async () => {
    await carsRepositoryInMemory.create({
      name: 'Car1',
      description: 'Description Car',
      daily_rate: 140,
      license_plate: 'TTT-55588',
      fine_amount: 100,
      brand: 'Ford',
      category_id: '1',
    });

    const car2 = await carsRepositoryInMemory.create({
      name: 'Car2',
      description: 'Description Car',
      daily_rate: 140,
      license_plate: 'TTT-55588',
      fine_amount: 100,
      brand: 'Subaru',
      category_id: '2',
    });

    await carsRepositoryInMemory.create({
      name: 'Car3',
      description: 'Description Car',
      daily_rate: 140,
      license_plate: 'TTT-55588',
      fine_amount: 100,
      brand: 'BMW',
      category_id: '3',
    });

    const cars = await listAvailableCarsUseCase.execute({
      brand: 'Subaru',
    });

    expect(cars).toEqual(
      expect.arrayContaining([expect.objectContaining(car2)]),
    );
  });

  it('should be able list all available cars by category', async () => {
    const id1 = uuidV4();
    const id2 = uuidV4();
    const id3 = uuidV4();

    await carsRepositoryInMemory.create({
      name: 'Car1',
      description: 'Description Car',
      daily_rate: 140,
      license_plate: 'TTT-55588',
      fine_amount: 100,
      brand: 'Ford',
      category_id: id1,
    });

    await carsRepositoryInMemory.create({
      name: 'Car2',
      description: 'Description Car',
      daily_rate: 140,
      license_plate: 'TTT-55588',
      fine_amount: 100,
      brand: 'Subaru',
      category_id: id2,
    });

    const car3 = await carsRepositoryInMemory.create({
      name: 'Car3',
      description: 'Description Car',
      daily_rate: 140,
      license_plate: 'TTT-55588',
      fine_amount: 100,
      brand: 'BMW',
      category_id: id3,
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: id3,
    });

    expect(cars).toEqual(
      expect.arrayContaining([expect.objectContaining(car3)]),
    );
  });
});
