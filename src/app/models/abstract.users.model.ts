import { User } from '../utils/types/types';

abstract class AbstractUsersModel {
  abstract getUsers(): Promise<User[]>;
  abstract getUser(id: string): Promise<User | null>;
  abstract addUser(user: User): Promise<User>;
  abstract updateUser(id: string, updatedUser: Partial<User>): Promise<User | undefined>;
  abstract deleteUser(id: string): Promise<boolean>;
}

export default AbstractUsersModel;
