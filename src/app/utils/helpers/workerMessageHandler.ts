import UsersModel from '../../models/users.model';
import { Commands, User } from '../types/types';

interface Message {
  command: Commands;
  user?: User;
  id?: string;
}

const usersModel = new UsersModel();

const workerMessageHandler = (message: Message): Promise<User[] | User | object | boolean> => {
  switch (message.command) {
    case Commands.getUsers: {
      return usersModel.getUsers();
    }
    case Commands.getUser: {
      if (!message.id) {
        throw new Error('Id is required');
      }

      return usersModel.getUser(message.id);
    }
    case Commands.addUser: {
      if (!message.user) {
        throw new Error('User info is required');
      }

      return usersModel.addUser(message.user);
    }
    case Commands.updateUser: {
      if (!message.user) {
        throw new Error('User info is required');
      }

      return usersModel.updateUser(message.user.id, message.user);
    }
    case Commands.deleteUser: {
      if (!message.id) {
        throw new Error('Id is required');
      }

      return usersModel.deleteUser(message.id);
    }
  }
};

export default workerMessageHandler;
