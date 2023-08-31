import { validateErrorContexts } from '../utils/validate-error-contexts';

export const DATABASE_ERROR_CONTEXT = {
  // Default
  DEFAULT_DATABASE_ERROR: {
    errorCode: 20000,
    message: 'Database error happened',
  },

  // User
  USER_INSERT_ONE_ERROR: {
    errorCode: 20001,
    message: 'User insert one error',
  },
  USER_DELETE_ONE_ERROR: {
    errorCode: 20002,
    message: 'User delete one error',
  },

  // Identity
  IDENTITY_INSERT_ONE_ERROR: {
    errorCode: 21001,
    message: 'Identity insert one error',
  },
  IDENTITY_DELETE_ONE_ERROR: {
    errorCode: 21002,
    message: 'Identity delete one error',
  },
};

validateErrorContexts(DATABASE_ERROR_CONTEXT, 'Database');
