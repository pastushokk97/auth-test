// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ProcessEnv {
    NODE_ENV: 'dev' | 'prod' | 'test' | undefined;
    DATABASE_PORT: number;
    DATABASE_NAME: string;
    DATABASE_HOST: string;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
    DATABASE_TYPE: 'postgres' | undefined;
    APP_CONTAINER_NAME: string;
    APPLICATION_PORT: string;
    POSTGRES_CONTAINER_NAME: string;
    HASH_SALT: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN_ACCESS_TOKEN: string;
    JWT_EXPIRES_IN_REFRESH_TOKEN: string;
    JWT_PRIVATE_KEY: string;
  }
}
