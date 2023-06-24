import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class LoanService {
  private client: ClientProxy;

  constructor() {
    // Create a TCP-based ClientProxy instance
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        // Retrieve the host and port from environment variables
        host: process.env.LOAN_SERVICE_HOST,
        port: Number(process.env.LOAN_SERVICE_PORT),
      },
    });
  }

  public handleEvents(url: string, data) {
    // Extract the event name from the URL by removing the query string
    const event = url.split('?')[0];

    // Send the event and data to the Loan microservice using the ClientProxy
    return this.client.send(event, data);
  }
}
