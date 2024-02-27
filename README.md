# Node.js CRUD API

## Overview

This project implements a simple CRUD API using an in-memory database underneath. It allows for the creation, retrieval, updating, and deletion of user records.

## Technical Requirements

Please, [download](https://nodejs.org/en/download/) and install 20 LTS version of Node.js to run the API.

Or install and use [nvm](https://github.com/nvm-sh/nvm) to use the 20 LTS version.

To check your version, run

```bash
node -v
```

## Running the API

Clone this repo

By HTTPS:

```bash
https://github.com/haslie22/node-crud-api.git
```

By SSH:

```bash
git@github.com:haslie22/node-crud-api.git
```

Go to the repo folder:

```bash
cd node-crup-api
```

Change branch to `dev`:

```bash
git switch dev
```

Install dependencies:

```bash
npm i
```

Run in development mode:

```bash
npm run start:dev
```

Run in production mode:

```bash
npm run start:prod
```

Start multi instances with a load balancer for development:

```bash
npm run start:dev-multi
```

Start multi instances with a load balancer for production:

```bash
npm run start:multi
```

#### Environmental Variables

You can specify what port to use in `.env` file, which is stored in root directory.  
The port `4000` is stored there by default.

## Using the API

You can use this Postman collection to test the API:

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://god.gw.postman.com/run-collection/24383003-88170aa0-6348-4ef8-aba4-f276e1493b92?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D24383003-88170aa0-6348-4ef8-aba4-f276e1493b92%26entityType%3Dcollection%26workspaceId%3Da7f2203f-5b3a-4a0a-a08b-a798ec838960)

_Don't forget to adjust some data like `id` according to your needs_

## API Endpoints

| Method | Endpoint              | Description                           |
| ------ | --------------------- | ------------------------------------- |
| GET    | `/api/users`          | Retrieve all user records             |
| GET    | `/api/users/{userId}` | Retrieve a specific user record by ID |
| POST   | `/api/users`          | Create a new user record              |
| PUT    | `/api/users/{userId}` | Update an existing user record        |
| DELETE | `/api/users/{userId}` | Delete an existing user record        |

## User Data Structure

Users are stored as objects that have the following properties:

| Property   | Description                                                       |
| ---------- | ----------------------------------------------------------------- |
| `id`       | Unique identifier (string, uuid) generated **on the server side** |
| `username` | User's name (string, **required**)                                |
| `age`      | User's age (number, **required**)                                 |
| `hobbies`  | User's hobbies (array of strings or empty array, **required**)    |
