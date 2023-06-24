import { Test, TestingModule } from '@nestjs/testing';
import { LoanService } from './loan.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

describe('LoanService', () => {
  let loanService: LoanService;
  let clientProxyMock: any;

  beforeEach(async () => {
    clientProxyMock = {
      send: jest.fn(),
    };
    jest.spyOn(ClientProxyFactory, 'create').mockReturnValue(clientProxyMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [LoanService],
    }).compile();

    loanService = module.get<LoanService>(LoanService);
  });

  it('should create a client proxy with the correct transport and options', () => {
    expect(ClientProxyFactory.create).toHaveBeenCalledWith({
      transport: Transport.TCP,
      options: {
        host: process.env.LOAN_SERVICE_HOST,
        port: Number(process.env.LOAN_SERVICE_PORT),
      },
    });
  });

  describe('handleEvents', () => {
    it('should send the event and data to the client proxy', () => {
      const url = '/loan?id=123';
      const data = { id: '123' };

      loanService.handleEvents(url, data);

      expect(clientProxyMock.send).toHaveBeenCalledWith('/loan', data);
    });
  });
});
