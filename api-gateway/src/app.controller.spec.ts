import { HttpException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { of } from 'rxjs';

import { AppController } from './app.controller';
import { LoanService } from './loan/loan.service';

describe('AppController', () => {
  let appController: AppController;
  let loanService: LoanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [LoanService],
    }).compile();

    appController = module.get<AppController>(AppController);
    loanService = module.get<LoanService>(LoanService);
  });

  describe('handleRequest', () => {
    it('should return the response from loanService', async () => {
      const req = { originalUrl: '/loans', query: {} } as Request;
      const expectedResponse = { data: 'Loan data' };
      const handleEventsSpy = jest
        .spyOn(loanService, 'handleEvents')
        .mockReturnValue(of(expectedResponse));
      const result = await appController.handleRequest(req);

      expect(result).toStrictEqual({ data: expectedResponse });
      expect(handleEventsSpy).toHaveBeenCalledWith(req.originalUrl, req.query);
    });

    it('should throw NotFoundException if loanService returns error with "Not Found" message', async () => {
      const req = { originalUrl: '/loans', query: {} } as Request;
      const errorResponse = { error: true, message: 'Not Found' };
      const handleEventsSpy = jest
        .spyOn(loanService, 'handleEvents')
        .mockReturnValue(of(errorResponse));

      await expect(appController.handleRequest(req)).rejects.toThrowError(
        NotFoundException,
      );
      expect(handleEventsSpy).toHaveBeenCalledWith(req.originalUrl, req.query);
    });

    it('should throw BadRequestException if loanService returns error with other message', async () => {
      const errorMessage = 'Some error message';
      const errorResponse = {
        error: { response: { message: [errorMessage] }, status: 400 },
      };
      const handleEventsSpy = jest
        .spyOn(loanService, 'handleEvents')
        .mockReturnValue(of(errorResponse));

      const req = { originalUrl: '/loan', query: {} } as Request; // Mock the Express request object

      await expect(appController.handleRequest(req)).rejects.toThrow(
        HttpException,
      );
      expect(handleEventsSpy).toHaveBeenCalledWith(req.originalUrl, req.query);
      // await expect(appController.handleRequest(req)).rejects.toThrow(
      //   errorMessage,
      // );
    });

    it('should throw InternalServerError if loanService returns error with unknown code', async () => {
      const errorMessage = 'Some error message';
      const errorResponse = {
        error: { response: { message: [errorMessage] } },
      };
      const handleEventsSpy = jest
        .spyOn(loanService, 'handleEvents')
        .mockReturnValue(of(errorResponse));

      const req = { originalUrl: '/loan', query: {} } as Request;

      await expect(appController.handleRequest(req)).rejects.toThrow(
        HttpException,
      );
      expect(handleEventsSpy).toHaveBeenCalledWith(req.originalUrl, req.query);
    });
  });
});
