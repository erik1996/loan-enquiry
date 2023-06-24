import { RpcExceptionFilter } from './rpc-exception.filter';
import { ArgumentsHost, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

describe('RpcExceptionFilter', () => {
  let rpcExceptionFilter: RpcExceptionFilter;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    rpcExceptionFilter = new RpcExceptionFilter();
    loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('catch', () => {
    it('should log the error message with the method name and return a new RpcException', () => {
      const exception = new Error('Test error');
      const methodName = 'testMethod';
      const host: any = {
        switchToRpc: jest.fn(() => ({
          getContext: jest.fn().mockReturnValue({
            args: [methodName],
          }),
        })),
      };

      const result = rpcExceptionFilter.catch(exception, host);

      expect(loggerSpy).toHaveBeenCalledWith(
        `${methodName} failed with message: ${exception?.message}`,
      );
      expect(result).toBeInstanceOf(RpcException);
      expect(result).toEqual(new RpcException(exception));
    });

    it('should log a generic error message and return a new RpcException when exception is not provided', () => {
      const host: any = {
        switchToRpc: jest.fn(() => ({
          getContext: jest.fn().mockReturnValue({
            args: ['testMethod'],
          }),
        })),
      };

      const result = rpcExceptionFilter.catch(null, host);

      expect(result).toBeInstanceOf(RpcException);
      expect(result).toEqual(new RpcException('Something Went Wrong'));
    });
  });
});
