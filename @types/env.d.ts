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
    AWS_REGION: string;
    AWS_USER_POOL_ID: string;
    AWS_CLIENT_ID: string;
    HASH_SALT: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
  }
}
