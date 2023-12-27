export type JwtPayload = {
  userId: string;
  exp: number;
  iat: number;
  email: string;
};

export type SignTokens = {
  userId: string;
  email: string;
};

export type GetUserDataResponse = {
  userId: string;
  email: string;
};

export type JwtTokens = {
  accessToken: string;
  refreshToken: string;
};
