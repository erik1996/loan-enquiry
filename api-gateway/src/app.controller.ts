import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
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
      throw new HttpException(
        res.error.response.message,
        res.error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      data: res,
    };
  }
}
