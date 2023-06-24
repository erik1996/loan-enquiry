import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToRpc().getContext();
    // Get the name of the method that caused the exception
    const methodName = context.args[context.args.length - 1];
    // Log the error message with the method name
    this.logger.error(
      `${methodName} failed with message: ${exception?.message}`,
    );
    // Create a new RpcException with the original exception or a generic message
    return new RpcException(exception || 'Something Went Wrong');
  }
}
