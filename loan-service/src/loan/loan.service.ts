import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOperator,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import { LoanEntity } from './entity/loan.entity';
import {
  LoanDefaultedPayloadDto,
  LoanDistributionDefaultedPayloadDto,
  LoanYearsPayloadDto,
} from './dto/loan.dto';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(LoanEntity)
    private readonly loanRepository: Repository<LoanEntity>,
  ) {}

  // Retrieves a loan by ID
  async getLoanById(id: string): Promise<LoanEntity> {
    const loan = await this.loanRepository.findOne({ where: { id } });

    if (!loan) {
      throw new Error('Not Found');
    }

    return loan;
  }

  // Finds defaulted loans by year and optional currency conversion
  async findDefaultedLoansByYear({
    year,
    currency,
  }: LoanDefaultedPayloadDto): Promise<LoanEntity[]> {
    const dateRange = this.getDateRange(
      new Date(year, 0, 1),
      new Date(year, 11, 31),
    );

    const query: SelectQueryBuilder<LoanEntity> = this.loanRepository
      .createQueryBuilder('loan')
      .select('*')
      .where({ date: dateRange, default: true });

    if (currency) {
      const rate = await this.getRateByCurrency(currency);

      query.select(`*, REPLACE(loan.balance / ${rate}, 'loan', '')`, 'balance');
    }

    return query.getRawMany();
  }

  // Retrieves the distribution of defaulted and non-defaulted loans within a specified date range
  async getDistributionOfDefaults({
    startDate,
    endDate,
  }: LoanDistributionDefaultedPayloadDto) {
    const initialWhere = {
      date: this.getDateRange(startDate, endDate),
    };

    const [defaulted, nonDefaulted] = await Promise.all([
      this.getLoanCount({ ...initialWhere, default: true }),
      this.getLoanCount({ ...initialWhere, default: false }),
    ]);

    return { defaulted, nonDefaulted };
  }

  // Retrieves the distinct years based on filter parameters
  async getYearsByParams({
    defaultStatus,
    gender,
    job,
  }: LoanYearsPayloadDto): Promise<number[]> {
    const query = this.loanRepository.createQueryBuilder('loan');

    if (defaultStatus) {
      query.where({ default: defaultStatus });
    }

    if (gender) {
      query.andWhere({ marital: gender });
    }

    if (job) {
      query.andWhere({ job });
    }

    const years = await query
      .select('DISTINCT YEAR(loan.date)', 'year')
      .orderBy('year', 'DESC')
      .getRawMany();

    return years.map((result) => result.year);
  }

  private getDateRange(sd: Date, ed: Date): FindOperator<Date> {
    const formatedStartDate = new Date(sd);
    formatedStartDate.setHours(0, 0, 0, 0);

    const formatedEndDate = new Date(ed);
    formatedEndDate.setHours(23, 59, 59, 999);

    return Between(formatedStartDate, formatedEndDate);
  }

  private async getRateByCurrency(currency: string) {
    try {
      const currencyKey = currency.toUpperCase();

      const { data } = await axios.get(
        `${process.env.EXCHANGE_SERVICE_URL}?apikey=${process.env.EXCHANGE_SERVICE_API_KEY}&currencies=${currencyKey}&base_currency=${process.env.EXCHANGE_BASE_CURRENCY}`,
      );

      return data.data[currencyKey];
    } catch (err) {
      throw new Error('Cannot find exchange rate for requested currency');
    }
  }

  private getLoanCount(where: FindOptionsWhere<LoanEntity>) {
    return this.loanRepository.count({ where });
  }
}
