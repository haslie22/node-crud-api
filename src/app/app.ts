import { createServer, Server, IncomingMessage, ServerResponse } from 'http';

import UsersModel from './models/users.model';

import { StatusCodes } from './utils/constants/constants';

enum httpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

enum Routes {
  USER = '/api/user',
  USERS = '/api/users',
}

type RequestHandler = (
  req: IncomingMessage,
  res: ServerResponse,
  usersModel: UsersModel,
  idParam?: string,
) => Promise<void>;

class App {
  private port: number;
  private server: Server;
  private usersModel: UsersModel;
  private routes: { [key: string]: { [key: string]: RequestHandler } };

  constructor(port: number, usersModel: UsersModel) {
    this.port = port;
    this.usersModel = usersModel;
    this.server = createServer();
    this.routes = this.createRoutes();
    this.mapRoutes();
  }

  private createRoutes(): { [key: string]: { [key: string]: RequestHandler } } {
    return {
      [Routes.USERS]: {
        [httpMethods.GET]: this.handleGetUsers.bind(this),
        [httpMethods.POST]: this.handleAddUser.bind(this),
      },
      [Routes.USER]: {
        [httpMethods.GET]: this.handleGetUser.bind(this),
        [httpMethods.PUT]: this.handleUpdateUser.bind(this),
        [httpMethods.DELETE]: this.handleDeleteUser.bind(this),
      },
    };
  }

  private mapRoutes(): void {
    this.server.on('request', async (req: IncomingMessage, res: ServerResponse) => {
      const method = req?.method ?? '';
      const url = req?.url ?? '';
      const idParam = url?.split('/')[3];

      const routeHandlers = this.routes[url];
      if (routeHandlers && routeHandlers[method]) {
        try {
          await routeHandlers[method](req, res, this.usersModel, idParam);
        } catch (err) {
          console.error('Error handling request:', err);
          this.serverError(res, 'Internal Server Error');
        }
      } else {
        this.serverError(res, 'Page not found');
      }
    });
  }

  private async handleGetUsers(req: IncomingMessage, res: ServerResponse, usersModel: UsersModel): Promise<void> {
    const users = await usersModel.getUsers();
    res.writeHead(StatusCodes.OK, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  }

  private async handleAddUser(req: IncomingMessage, res: ServerResponse, usersModel: UsersModel): Promise<void> {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const userData = JSON.parse(body);
        const newUser = await usersModel.addUser(userData);
        res.writeHead(StatusCodes.CREATED, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser));
      } catch (error) {
        console.error('Error adding user:', error);
        this.serverError(res, 'Error adding user');
      }
    });
  }

  private async handleGetUser(
    req: IncomingMessage,
    res: ServerResponse,
    usersModel: UsersModel,
    idParam?: string,
  ): Promise<void> {
    if (!idParam) {
      this.serverError(res, 'Invalid user ID');
      return;
    }
    const user = await usersModel.getUser(idParam);
    if (!user) {
      res.writeHead(StatusCodes.NOT_FOUND, { 'Content-Type': 'text/plain' });
      res.end('User not found');
      return;
    }
    res.writeHead(StatusCodes.OK, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  }

  private async handleUpdateUser(
    req: IncomingMessage,
    res: ServerResponse,
    usersModel: UsersModel,
    idParam?: string,
  ): Promise<void> {
    if (!idParam) {
      this.serverError(res, 'Invalid user ID');
      return;
    }
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const userData = JSON.parse(body);
        const updatedUser = await usersModel.updateUser(idParam, userData);
        if (!updatedUser) {
          res.writeHead(StatusCodes.NOT_FOUND, { 'Content-Type': 'text/plain' });
          res.end('User not found');
          return;
        }
        res.writeHead(StatusCodes.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error updating user:', error);
        this.serverError(res, 'Error updating user');
      }
    });
  }

  private async handleDeleteUser(
    req: IncomingMessage,
    res: ServerResponse,
    usersModel: UsersModel,
    idParam?: string,
  ): Promise<void> {
    if (!idParam) {
      this.serverError(res, 'Invalid user ID');
      return;
    }
    const deleted = await usersModel.deleteUser(idParam);
    if (!deleted) {
      res.writeHead(StatusCodes.NOT_FOUND, { 'Content-Type': 'text/plain' });
      res.end('User not found');
      return;
    }
    res.writeHead(StatusCodes.NO_CONTENT);
    res.end();
  }

  private serverError(res: ServerResponse, message: string): void {
    res.writeHead(StatusCodes.INTERNAL_SERVER_ERROR, { 'Content-Type': 'text/plain' });
    res.end(message);
  }

  public start(): void {
    this.server.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

export default App;
