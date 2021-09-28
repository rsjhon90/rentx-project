import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUsersDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { CreateUserUseCase } from '@modules/accounts/useCases/createUser/CreateUserUseCase';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('Should be able to authenticate an user', async () => {
    const user: ICreateUserDTO = {
      driver_license: '002123',
      email: 'user@test.com',
      password: '1234',
      name: 'User Test',
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty('token');
  });

  it('Should not be able to authenticate an non-existent user', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'false@test.com',
        password: '1234',
      }),
    ).rejects.toEqual(new AppError('Incorrect email or password', 401));
  });

  it('Should not be able to authenticate with a password non-matched', async () => {
    const user: ICreateUserDTO = {
      driver_license: '002100',
      email: 'user@test.com',
      password: '1234',
      name: 'User Test Error',
    };

    await createUserUseCase.execute(user);
    await expect(
      authenticateUserUseCase.execute({
        email: 'false@test.com',
        password: 'incorrectPassword',
      }),
    ).rejects.toEqual(new AppError('Incorrect email or password', 401));
  });
});
