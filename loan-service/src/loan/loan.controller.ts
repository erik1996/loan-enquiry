import { Controller, Logger, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { LoanService } from './loan.service';
import { RpcExceptionFilter } from '../error-handling/rpc-exception.filter';
import {
  LoanDefaultedPayloadDto,
  LoanDistributionDefaultedPayloadDto,
  LoanIdPayloadDto,
  LoanYearsPayloadDto,
} from './dto/loan.dto';

@Controller('loan')
@UseFilters(RpcExceptionFilter)
export class LoanController {
  private readonly logger = new Logger(LoanController.name);

  constructor(private readonly loanService: LoanService) {}

  // Handler for '/loan' message pattern
  @MessagePattern('/loan')
  async getLoanById(@Payload() payload: LoanIdPayloadDto) {
    const response = await this.loanService.getLoanById(payload.id);

    this.log('/loan', payload, response);

    return response;
  }

  // Handler for '/loan/year' message pattern
  @MessagePattern('/loan/year')
  async getYear(@Payload() payload: LoanYearsPayloadDto) {
    const response = await this.loanService.getYearsByParams(payload);

    this.log('/loan/year', payload, response);

    return response;
  }

  // Handler for '/loan/defaulted' message pattern
  @MessagePattern('/loan/defaulted')
  async getDefaultedLoansByYear(@Payload() payload: LoanDefaultedPayloadDto) {
    const response = await this.loanService.findDefaultedLoansByYear(payload);

    this.log('/loan/defaulted', payload, response);

    return response;
  }

  // Handler for '/loan/distribution' message pattern
  @MessagePattern('/loan/distribution')
  async getDistributionOfDefaults(
    @Payload() payload: LoanDistributionDefaultedPayloadDto,
  ) {
    const response = await this.loanService.getDistributionOfDefaults(payload);

    this.log('/loan/distribution', payload, response);

    return response;
  }

  private log = <Dto, T>(pattern: string, payload: Dto, responseStr: T) => {
    this.logger.log(
      `${pattern} event received a request payload: ${JSON.stringify(
        payload,
      )}, send response: ${JSON.stringify(responseStr)}`,
    );
  };
}
