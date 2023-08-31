import { validateErrorContexts } from '../utils/validate-error-contexts';

export const VALIDATION_ERROR_CONTEXT = {
  // Default
  DEFAULT_VALIDATION_ERROR: {
    errorCode: 10000,
    message: 'Validation error happened',
  },

  // User
  USER_IS_ALREADY_EXISTS: {
    errorCode: 10001,
    message: 'User is already exists',
  },
  USER_FIRST_NAME: {
    errorCode: 10002,
    message:
      'User first name is not string or length is less than 2 or bigger than 255',
  },
  USER_LAST_NAME: {
    errorCode: 10003,
    message:
      'User last name is not string or length is less than 2 or bigger than 255',
  },
  USER_EMAIL: {
    errorCode: 10004,
    message: 'User email is not email or length is bigger than 96',
  },
  USER_PHONE: {
    errorCode: 10005,
    message: 'User phone is not string bigger than 15',
  },
  USER_PASSWORD: {
    errorCode: 10006,
    message: 'User password is not string or length is bigger than 255',
  },
  USER_NOT_FOUND: {
    errorCode: 10007,
    message: 'User is not found',
  },
  USER_IS_NOT_UUID: {
    errorCode: 10008,
    message: 'User id is not uuid',
  },
  USER_EXPIRED_CODE: {
    errorCode: 10009,
    message: 'Invalid code provided, please request a code again',
  },
  USER_VERIFICATION_CODE: {
    errorCode: 10010,
    message: 'Verification code should be a string with 6 digits',
  },

  // Auth
  AUTH_JWT_AUTH_HEADER_REQUIRED: {
    errorCode: 11001,
    message: 'Auth header required',
  },
  AUTH_JWT_UNAUTHORIZED: {
    errorCode: 11002,
    message: 'User is not authorized',
  },
};

validateErrorContexts(VALIDATION_ERROR_CONTEXT, 'Validation');
