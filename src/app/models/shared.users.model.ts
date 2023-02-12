import waitForMasterRes from '../utils/helpers/waitForMasterRes';
import { Commands, User } from '../utils/types/types';
import AbstractUsersModel from './abstract.users.model';

class SharedUsersModel extends AbstractUsersModel {
  async getUsers(): Promise<User[]> {
    if (process.send) {
      process.send({ command: Commands.getUsers });
    }

    return waitForMasterRes() as Promise<User[]>;
  }

  async getUser(id: string): Promise<User | null> {
    if (process.send) {
      process.send({ command: Commands.getUser, id });
    }
    return waitForMasterRes() as Promise<User | null>;
  }

  async addUser(user: User): Promise<User> {
    if (process.send) {
      process.send({ command: Commands.addUser, user });
    }
    return waitForMasterRes() as Promise<User>;
  }

  async updateUser(id: string, updatedUser: Partial<User>): Promise<User | undefined> {
    const user = { ...updatedUser };
    user.id = id;

    if (process.send) {
      process.send({ command: Commands.updateUser, user });
    }
    return waitForMasterRes() as Promise<User>;
  }

  async deleteUser(id: string): Promise<boolean> {
    if (process.send) {
      process.send({ command: Commands.deleteUser, id });
    }
    return waitForMasterRes() as Promise<boolean>;
  }
}

export default SharedUsersModel;
