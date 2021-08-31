import { getRepository, Repository } from 'typeorm';

import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { IListCarDTO } from '@modules/cars/dtos/IListCarDTO';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';

import { Car } from '../entities/Car';

export class CarsRepository implements ICarsRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = getRepository(Car);
  }

  async create(data: ICreateCarDTO): Promise<Car> {
    const car = this.repository.create(data);

    await this.repository.save(car);

    return car;
  }
  async findByLicensePlate(license_plate: string): Promise<Car> {
    const car = await this.repository.findOne({ license_plate });

    return car;
  }

  async findAvailable({
    category_id,
    name,
    brand,
  }: IListCarDTO): Promise<Car[]> {
    const carsQuery = this.repository
      .createQueryBuilder('c')
      .where('available = :available', { available: true });

    if (brand) {
      carsQuery.andWhere("c.brand ILIKE '%'||:brand||'%'", { brand });
    }
    if (name) {
      carsQuery.andWhere("c.name ILIKE '%'||:name||'%'", { name });
    }
    if (category_id) {
      carsQuery.andWhere('c.category_id = :category_id', { category_id });
    }

    const cars = await carsQuery.getMany();

    return cars;
  }
}
