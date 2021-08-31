import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { IListCarDTO } from '@modules/cars/dtos/IListCarDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';

import { ICarsRepository } from '../ICarsRepository';

export class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];

  async create({
    brand,
    category_id,
    daily_rate,
    description,
    fine_amount,
    license_plate,
    name,
  }: ICreateCarDTO): Promise<Car> {
    const car = new Car();

    const newCar = Object.assign(car, {
      brand,
      category_id,
      daily_rate,
      description,
      fine_amount,
      license_plate,
      name,
      available: true,
    });

    this.cars.push(newCar);

    return newCar;
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    const car = this.cars.find(car => car.license_plate === license_plate);

    return car;
  }

  async findAvailable({
    brand,
    category_id,
    name,
  }: IListCarDTO): Promise<Car[]> {
    const allCarsAvaiable = this.cars.filter(car => {
      if (car.available) {
        if (brand) {
          return car.brand === brand;
        }
        if (category_id) {
          return car.category_id === category_id;
        }
        if (name) {
          return car.name === name;
        }

        return true;
      }

      return false;
    });

    return allCarsAvaiable;
  }
}
