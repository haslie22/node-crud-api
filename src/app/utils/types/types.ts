interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

enum Commands {
  getUsers = 'getUsers',
  getUser = 'getUser',
  addUser = 'addUser',
  updateUser = 'updateUser',
  deleteUser = 'deleteUser',
}

export { User, Commands };
