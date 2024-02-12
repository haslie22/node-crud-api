import { config } from 'dotenv';

import App from './app/app';
import UsersModel from './app/models/users.model';

import { DEFAULT_PORT } from './app/utils/constants/constants';

config();

const PORT = parseInt(process.env.PORT || DEFAULT_PORT, 10);

const usersModel = new UsersModel();

const app = new App(PORT, usersModel);

app.start();
