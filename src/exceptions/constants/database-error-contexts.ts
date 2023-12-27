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
  USER_UPDATE_ONE_ERROR: {
    errorCode: 20002,
    message: 'User insert one error',
  },
};

validateErrorContexts(DATABASE_ERROR_CONTEXT, 'Database');
