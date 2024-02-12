import { createServer, Server, IncomingMessage, ServerResponse } from 'http';

import { validate } from 'uuid';

import UsersModel from './models/users.model';

import { StatusCodes } from './utils/constants/constants';
import parseUrl from './utils/helpers/parseUrl';

enum httpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

enum Routes {
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
        [httpMethods.GET]: this.handleGetUserOrUsers.bind(this),
        [httpMethods.POST]: this.handleAddUser.bind(this),
        [httpMethods.PUT]: this.handleUpdateUser.bind(this),
        [httpMethods.DELETE]: this.handleDeleteUser.bind(this),
      },
    };
  }

  private mapRoutes(): void {
    this.server.on('request', async (req: IncomingMessage, res: ServerResponse) => {
      try {
        const method = req?.method ?? '';
        const { route, idParam } = parseUrl(req?.url ?? '');

        const routeHandlers = this.routes[route];
        if (routeHandlers && routeHandlers[method]) {
          await routeHandlers[method](req, res, this.usersModel, idParam);
        } else {
          this.serverError(StatusCodes.NOT_FOUND, res, 'Page not found');
        }
      } catch (err) {
        console.error('Error handling request:', err);
        this.serverError(StatusCodes.INTERNAL_SERVER_ERROR, res, 'Internal Server Error');
      }
    });
  }

  private async handleGetUserOrUsers(
    req: IncomingMessage,
    res: ServerResponse,
    usersModel: UsersModel,
    id?: string,
  ): Promise<void> {
    if (id) {
      await this.handleGetUser(req, res, usersModel, id);
    } else {
      await this.handleGetUsers(req, res, usersModel);
    }
  }

  private async handleGetUsers(req: IncomingMessage, res: ServerResponse, usersModel: UsersModel): Promise<void> {
    const users = await usersModel.getUsers();
    res.writeHead(StatusCodes.OK, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  }

  private async handleGetUser(
    req: IncomingMessage,
    res: ServerResponse,
    usersModel: UsersModel,
    idParam: string,
  ): Promise<void> {
    if (!validate(idParam)) {
      this.serverError(StatusCodes.BAD_REQUEST, res, 'Invalid user ID');
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

  private async handleAddUser(req: IncomingMessage, res: ServerResponse, usersModel: UsersModel): Promise<void> {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const userData = JSON.parse(body);
      if (!userData.username || !userData.age || !userData.hobbies) {
        this.serverError(StatusCodes.BAD_REQUEST, res, 'Missing required fields');
        return;
      }

      const newUser = await usersModel.addUser(userData);
      res.writeHead(StatusCodes.CREATED, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
    });
  }

  private async handleUpdateUser(
    req: IncomingMessage,
    res: ServerResponse,
    usersModel: UsersModel,
    idParam: string,
  ): Promise<void> {
    if (!validate(idParam)) {
      this.serverError(StatusCodes.BAD_REQUEST, res, 'Invalid user ID');
      return;
    }

    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const userData = JSON.parse(body);
      if (!userData.username || !userData.age || !userData.hobbies) {
        this.serverError(StatusCodes.BAD_REQUEST, res, 'Missing required fields');
        return;
      }

      const updatedUser = await usersModel.updateUser(idParam, userData);
      if (!updatedUser) {
        res.writeHead(StatusCodes.NOT_FOUND, { 'Content-Type': 'text/plain' });
        res.end('User not found');
        return;
      }
      res.writeHead(StatusCodes.OK, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updatedUser));
    });
  }

  private async handleDeleteUser(
    req: IncomingMessage,
    res: ServerResponse,
    usersModel: UsersModel,
    idParam: string,
  ): Promise<void> {
    if (!validate(idParam)) {
      this.serverError(StatusCodes.BAD_REQUEST, res, 'Invalid user ID');
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

  private serverError(statusCode: StatusCodes, res: ServerResponse, message: string): void {
    res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
    res.end(message);
  }

  public start(): void {
    this.server.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

export default App;
