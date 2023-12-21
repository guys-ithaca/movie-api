import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {
  swaggerPath,
  swaggerDocumentOptions,
  swaggerSetupOptions,
  // @ts-ignore
  // eslint-disable-next-line
} from "./swagger";

console.log('going to listen to 3103 this time...');
const { API_PORT = 3000 } = process.env;

async function main() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const document = SwaggerModule.createDocument(app, swaggerDocumentOptions);

  SwaggerModule.setup(swaggerPath, app, document, swaggerSetupOptions);

  void app.listen(API_PORT);

  Logger.log(`🚀 Movie APIs is running on: http://localhost:${API_PORT}`);
  return app;
}

module.exports = main();
