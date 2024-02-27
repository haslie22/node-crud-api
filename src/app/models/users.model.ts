import { v4 as uuidv4 } from 'uuid';

import AbstractUsersModel from './abstract.users.model';
import { User } from '../utils/types/types';

class UsersModel extends AbstractUsersModel {
  private users: User[] = [];

  async getUsers(): Promise<User[]> {
    return this.users;
  }

  async getUser(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async addUser(user: User): Promise<User> {
    const newUser = { ...user, id: uuidv4() };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string, updatedUser: Partial<User>): Promise<User | undefined> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return undefined;
    this.users[index] = { ...this.users[index], ...updatedUser };
    return this.users[index];
  }

  async deleteUser(id: string): Promise<boolean> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
}

export default UsersModel;
