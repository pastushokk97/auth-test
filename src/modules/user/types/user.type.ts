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
  accessToken: string;
  refreshToken: string;
};

export type UserGetOneResponse = {
  userId: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
};
