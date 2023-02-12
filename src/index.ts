import 'dotenv/config';
import cluster from 'cluster';
import { cpus } from 'os';
import { createServer, request, IncomingMessage, ServerResponse } from 'http';
import App from './app/app';
import UsersModel from './app/models/users.model';
import { DEFAULT_PORT } from './app/utils/constants/constants';
import SharedUsersModel from './app/models/shared.users.model';
import workerMessageHandler from './app/utils/helpers/workerMessageHandler';

const BASE_PORT = parseInt(process.env.PORT || DEFAULT_PORT, 10);

const isCluster = process.argv.includes('--multi');

if (isCluster && cluster.isPrimary) {
  const workersCount = cpus().length - 1;
  for (let i = 0; i < workersCount; i++) {
    const port = BASE_PORT + i + 1;
    const child = cluster.fork({ PORT: port.toString() });
    child.on('message', async (message) => {
      child.send(await workerMessageHandler(message));
    });
  }

  let nextWorkerIndex = 0;

  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const workerRequest = request(
      {
        hostname: 'localhost',
        port: BASE_PORT + nextWorkerIndex + 1,
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      (workerRes) => {
        const workerRequestData: Buffer[] = [];
        workerRes.on('data', (chunk) => {
          workerRequestData.push(chunk);
        });

        workerRes.on('end', () => {
          res.statusCode = workerRes.statusCode || 500;
          res.statusMessage = workerRes.statusMessage || 'Internal server error';
          res.setHeader('Content-Type', workerRes.headers['content-type'] || 'text/plain');
          res.end(workerRequestData.join().toString());
        });
      },
    );

    const requestData: Buffer[] = [];

    req.on('data', (chunk: Buffer) => {
      requestData.push(chunk);
    });

    req.on('end', () => {
      workerRequest.end(requestData.join().toString());
      nextWorkerIndex = (nextWorkerIndex + 1) % workersCount;
    });

    req.on('error', () => {
      // TODO: process error
      res.end('error');
    });
  });

  server.listen(BASE_PORT, () => {
    console.log(`Load balancer is listening on port ${BASE_PORT}`);
  });
} else {
  const app = new App(BASE_PORT, isCluster ? new SharedUsersModel() : new UsersModel());
  app.start();
}
