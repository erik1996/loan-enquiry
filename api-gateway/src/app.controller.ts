import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { LoanService } from './loan/loan.service';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(private loanService: LoanService) {}

  /**
   * Handles requests for '/loan*' routes.
   * @param req The Express request object.
   * @returns The response from the loan service.
   */
  @Get('/loan*')
  async handleRequest(@Req() req: Request) {
    const res = await lastValueFrom(
      this.loanService.handleEvents(req.originalUrl, req.query),
    );

    if (res.error) {
      if (res.message === 'Not Found') {
        // If the response indicates 'Not Found', throw a NotFoundException.
        throw new NotFoundException(res.message);
      } else {
        // If there is an error, create an HttpException with the error message.
        throw new HttpException(
          res.error.response.message.join(','),
          res.error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    return {
      data: res,
    };
  }
}
