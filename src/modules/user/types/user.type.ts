import { GetUserDataResponse } from '../../auth/types/auth.types';

export type UserCreateOptions = {
  email: string;
  password: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
};

export type UserLoginOptions = {
  email: string;
  password: string;
};

export type UserLoginResponse = {
  userId: string;
  email: string;
  firstname: string;
  lastname: string;
  jwtToken: string;
  refreshToken: string;
};

export type UserGetOneResponse = {
  userId: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  createdDate: string;
  updatedDate?: string;
};

export type UserVerifyOptions = {
  email: string;
  verificationCode: string;
};

export type UserDeleteOptions = GetUserDataResponse;

export type IdentityCreateOptions = {
  cognitoUserId: string;
};

export type UserCreateOptionsDB = UserCreateOptions & {
  identityId: string;
};
