import { Request } from 'express';

import { GetUserDataResponse } from '../modules/auth/types/auth.types';

export type RequestWithUser = Request & { user: GetUserDataResponse };
