import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';

import {
  ICreateSpecificationDTO,
  ISpecificationRepository,
} from '../ISpecificationsRepository';

export class SpecificationsRepositoryInMemory
  implements ISpecificationRepository
{
  specifications: Specification[] = [];

  async create({
    name,
    description,
  }: ICreateSpecificationDTO): Promise<Specification> {
    const specification = new Specification();

    const newSpecification = Object.assign(specification, {
      name,
      description,
    });

    this.specifications.push(newSpecification);

    return newSpecification;
  }

  async findByName(name: string): Promise<Specification> {
    const specification = this.specifications.find(spec => spec.name === name);

    return specification;
  }

  async findByIds(ids: string[]): Promise<Specification[]> {
    const specifications = this.specifications.filter(spec => {
      const matched = ids.includes(spec.id);

      if (matched) {
        return true;
      }

      return false;
    });

    return specifications;
  }
}
