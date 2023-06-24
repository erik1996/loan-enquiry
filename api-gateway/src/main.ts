import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';

import { AppModule } from './app.module';
import { join } from 'path';

export async function bootstrap() {
  // Create a Nest application instance
  const app = await NestFactory.create(AppModule);

  // Read the Swagger JSON file and parse its contents
  const document = JSON.parse(
    (await readFile(join(__dirname, '../swagger/swagger.json'))).toString(
      'utf-8',
    ),
  );
  // Set up Swagger UI with the parsed Swagger document
  SwaggerModule.setup('api', app, document);

  // Start listening on the specified port from the environment variables
  await app.listen(process.env.PORT);
}

// Call the bootstrap function to start the application
bootstrap();
