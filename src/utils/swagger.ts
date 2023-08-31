import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function applySwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('TMH API')
    .setDescription('Take me home API')
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

  SwaggerModule.setup('api/swagger', app, document);
}
