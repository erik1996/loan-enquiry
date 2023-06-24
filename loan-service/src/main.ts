import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

const logger = new Logger('Main');

// Configuration for the microservice
const microServiceOptions = {
  transport: Transport.TCP, // Use TCP transport for communication
  options: {
    host: process.env.HOST, // Set the host from environment variables
    port: process.env.PORT, // Set the port from environment variables
  },
};

export async function bootstrap() {
  // Create a Nest application instance
  const app = await NestFactory.createMicroservice(
    AppModule, // Root module of the application
    microServiceOptions, // Configuration for the microservice
  );

  // Enable global validation pipe for input validation
  app.useGlobalPipes(new ValidationPipe());
  // Start the microservice
  app.listen();

  // Log a message indicating that the microservice is running
  logger.log('Loan microservice up and running');
}

// Call the bootstrap function to start the application
bootstrap();
