import { ICreateCarDTO } from '../dtos/ICreateCarDTO';
import { IListCarDTO } from '../dtos/IListCarDTO';
import { Car } from '../infra/typeorm/entities/Car';

export interface ICarsRepository {
  create(data: ICreateCarDTO): Promise<Car>;
  findByLicensePlate(license_plate: string): Promise<Car>;
  findAvailable(dataToFilter: IListCarDTO): Promise<Car[]>;
}
