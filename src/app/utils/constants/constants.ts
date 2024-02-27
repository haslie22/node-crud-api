const DEFAULT_PORT: string = '3000';

enum StatusCodes {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export { DEFAULT_PORT, StatusCodes };
