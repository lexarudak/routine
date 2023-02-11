import * as Enum from './enums';

export class ServerError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = Enum.StatusCodes.InternalServerError) {
    super(message);
    this.name = 'ServerError';
    this.statusCode = statusCode;
  }
}

export class ClientError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = Enum.StatusCodes.BadRequest) {
    super(message);
    this.name = 'ClientError';
    this.statusCode = statusCode;
  }
}
