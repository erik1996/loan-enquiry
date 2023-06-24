import { Test, TestingModule } from '@nestjs/testing';
import { LoanService } from './loan.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoanEntity } from './entity/loan.entity';
import { SelectQueryBuilder } from 'typeorm';
import axios from 'axios';
import { Job, Marital } from './dto/loan.dto';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LoanService', () => {
  let loanService: LoanService;
  let mockRepository: any;

  const queryBuilder: Partial<SelectQueryBuilder<LoanEntity>> = {
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(() => queryBuilder),
      count: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanService,
        {
          provide: getRepositoryToken(LoanEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    loanService = module.get<LoanService>(LoanService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getLoanById', () => {
    it('should get loan by id', async () => {
      const testLoan = new LoanEntity();
      testLoan.id = '1';
      mockRepository.findOne.mockReturnValue(Promise.resolve(testLoan));

      expect(await loanService.getLoanById('1')).toBe(testLoan);
    });

    it('should throw error if loan not found', async () => {
      mockRepository.findOne.mockReturnValue(Promise.resolve(null));

      await expect(loanService.getLoanById('1')).rejects.toThrow('Not Found');
    });
  });

  describe('findDefaultedLoansByYear', () => {
    it('should find defaulted loans by year', async () => {
      const testLoan = new LoanEntity();
      testLoan.id = '1';
      mockedAxios.get.mockResolvedValue({ data: { data: { USD: 1 } } });
      (queryBuilder.getRawMany as jest.Mock).mockResolvedValue([testLoan]);

      const result = await loanService.findDefaultedLoansByYear({
        year: 2023,
        currency: 'usd',
      });
      expect(result).toEqual([testLoan]);
    });

    it('should throw error if cannot find exchange rate for requested currency', async () => {
      mockedAxios.get.mockImplementation(() => {
        throw new Error();
      });

      await expect(
        loanService.findDefaultedLoansByYear({ year: 2023, currency: 'usd' }),
      ).rejects.toThrow('Cannot find exchange rate for requested currency');
    });
  });

  describe('getDistributionOfDefaults', () => {
    it('should get distribution of defaults', async () => {
      mockRepository.count.mockImplementation((options) =>
        options.default ? 5 : 10,
      );

      const result = await loanService.getDistributionOfDefaults({
        startDate: new Date(2023, 0, 1),
        endDate: new Date(2023, 11, 31),
      });
      expect(result).toEqual({ defaulted: 10, nonDefaulted: 10 });
    });
  });

  describe('getYearsByParams', () => {
    it('should get years by params', async () => {
      (queryBuilder.getRawMany as jest.Mock).mockResolvedValue([
        { year: 2023 },
        { year: 2024 },
      ]);

      const result = await loanService.getYearsByParams({
        defaultStatus: true,
        gender: Marital.SINGLE,
        job: Job.TECHNICIAN,
      });
      expect(result).toEqual([2023, 2024]);
    });
  });
});
