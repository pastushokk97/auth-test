import { Logger } from 'nestjs-pino';

export const mockLogger: jest.MockedObject<Partial<Logger>> = {
  log: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
  verbose: jest.fn(),
  warn: jest.fn(),
  fatal: jest.fn(),
};
