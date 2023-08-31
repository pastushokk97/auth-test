export type JwtPayload = {
  sub: string;
  iss: string;
  client_id: string;
  origin_jti: string;
  event_id: string;
  token_use: string;
  scope: string;
  auth_time: number;
  exp: number;
  iat: number;
  jti: string;
  username: string;
};

export type GetUserDataResponse = {
  identityId: string;
  userId: string;
  email: string;
};
