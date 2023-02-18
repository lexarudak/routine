export enum ConfirmationDays {
  today = 'today',
  yesterday = 'yesterday',
}

export enum Constants {
  tokenDescription = 'rs-clone-user-token',
  defaultConfirmationDay = 'yesterday',
  defaultConfirmationTime = 660,
}

export enum StatusCodes {
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  InternalServerError = 500,
}

export enum ErrorMessages {
  e1001 = 'Invalid password',
  e1002 = 'No authorization data',
  e1003 = 'Invalid JWT token',
  e1004 = 'No user ID in JWT token',
  e1005 = 'No user with received authorization data',
  e1006 = 'The user is unauthorized',

  e2001 = 'ID not specified',
  e2002 = 'Incorrect value of parameter',
  e2003 = 'Incorrect value of period',
}
