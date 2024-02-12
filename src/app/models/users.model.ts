import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

class UsersModel {
  private users: User[] = [];

  async getUsers(): Promise<User[]> {
    return this.users;
  }

  async getUser(id: string): Promise<User | undefined> {
    console.log('🚀 ~ UsersModel ~ getUser ~ id:', id);
    return this.users.find((user) => user.id === id);
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
