import { Params } from 'nestjs-pino';
import { v4 as uuidV4 } from 'uuid';

export const loggerOptions: Params = {
  pinoHttp: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
    genReqId: () => uuidV4(),
  },
};
