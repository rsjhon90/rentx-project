import csvParse from 'csv-parse';
import fs from 'fs';
import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../errors/AppError';
import { ICategoriesRepository } from '../../repositories/ICategoriesRepository';

interface IImportCategory {
  name: string;
  description: string;
}

@injectable()
export class ImportCategoryUseCase {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  private loadCategories(
    file: Express.Multer.File,
  ): Promise<IImportCategory[]> {
    const categories: Promise<IImportCategory[]> = new Promise(
      (resolve, reject) => {
        const stream = fs.createReadStream(file.path);
        const categories: IImportCategory[] = [];

        const parseFile = csvParse({
          columns: [
            {
              name: 'name',
            },
            {
              name: 'description',
            },
          ],
        });
        stream.pipe(parseFile);

        parseFile
          .on('data', line => {
            // const [name, description] = line;
            categories.push(line);
          })
          .on('end', () => {
            fs.promises.unlink(file.path);
            resolve(categories);
          })
          .on('error', err => {
            reject(err);
          });
      },
    );

    return categories;
  }

  async execute(file: Express.Multer.File): Promise<IImportCategory[]> {
    const categories = await this.loadCategories(file);

    const errors: string[] = [];

    categories.map(async category => {
      const { name, description } = category;

      const existCategory = await this.categoriesRepository.findByName(name);
      if (!existCategory) {
        await this.categoriesRepository.create({
          name,
          description,
        });
      }
      if (existCategory) {
        errors.push(name);
      }
    });

    if (errors.length > 0) {
      throw new AppError(
        `${errors.join(', ')} have not been registered in the database.`,
      );
    }

    return categories;
  }
}
