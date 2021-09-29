import { User } from '../infra/typeorm/entities/User';

export type IUserResponseDTO = Pick<
  User,
  'id' | 'name' | 'email' | 'driver_license' | 'avatar' | 'avatar_url'
>;
