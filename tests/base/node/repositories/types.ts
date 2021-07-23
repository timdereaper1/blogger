import { UsersRepositoryInterface } from 'src/base/node/repositories/usersRepository';

export type MockUsersRepository = Record<keyof UsersRepositoryInterface, jest.Mock<any, any>>;
