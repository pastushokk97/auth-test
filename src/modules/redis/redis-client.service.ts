import { Injectable, Logger } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisClient {
  private readonly logger = new Logger(RedisClient.name);

  client: RedisClientType;

  async getClient() {
    if (!this.client) {
      await this.init();
    } else if (!this.client.isOpen) {
      await this.client.connect();
    }

    return this.client;
  }

  async closeConnection() {
    await this.client.quit();
  }

  private async init() {
    this.logger.log(`Redis init`);
    this.client = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
      password: process.env.REDIS_PASSWORD,
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis Client Error', err);
      process.exit(1);
    });
    this.client.on('ready', () => this.logger.log('Redis connected'));

    await this.client.connect();
  }
}
