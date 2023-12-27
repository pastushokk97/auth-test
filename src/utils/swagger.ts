import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { SWAGGER_API } from '../constants/routes';

export function applySwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('Impulse testing auth API')
    .setVersion('0.0.1')
    .addBearerAuth(
      {
        description: `Please enter token in following format: Bearer JWT`,
        name: 'Authorization',
        bearerFormat: 'JWT',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'JWT',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(SWAGGER_API, app, document);
}
