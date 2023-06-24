import { Test, TestingModule } from '@nestjs/testing';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { Education, Job, Marital } from '../loan/dto/loan.dto';

const loan = {
  id: '00330EDA',
  date: new Date('2021-10-16'),
  age: 46,
  job: Job.ADMIN,
  marital: Marital.DIVORCED,
  education: Education.PRiMARY,
  default: false,
  balance: 538,
};

describe('AppController', () => {
  let controller: LoanController;
  const getLoanById = jest.fn();
  const getYearsByParams = jest.fn();
  const findDefaultedLoansByYear = jest.fn();
  const getDistributionOfDefaults = jest.fn();

  const serviceMock = {
    provide: LoanService,
    useValue: {
      getLoanById: getLoanById,
      getYearsByParams: getYearsByParams,
      findDefaultedLoansByYear: findDefaultedLoansByYear,
      getDistributionOfDefaults: getDistributionOfDefaults,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoanController],
      providers: [serviceMock],
    }).compile();

    controller = module.get<LoanController>(LoanController);
  });

  describe('getLoanById', () => {
    it('should call getLoanById method of LoanService with the provided id', async () => {
      const id = 'loan_id';
      getLoanById.mockResolvedValue(loan);

      const result = await controller.getLoanById({ id });

      expect(getLoanById).toHaveBeenCalledWith(id);
      expect(result).toBe(loan);
    });
  });

  describe('getYear', () => {
    it('should return the years by query params', async () => {
      const query = {
        defaultStatus: true,
        gender: Marital.DIVORCED,
        job: Job.ADMIN,
      };
      const expectedYears = [2019, 2020, 2021];

      getYearsByParams.mockResolvedValue(expectedYears);

      const result = await controller.getYear(query);

      expect(getYearsByParams).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedYears);
    });
  });

  describe('getDefaultedLoansByYear', () => {
    it('should return the defaulted loans by year', async () => {
      const query = { year: 2021 };
      findDefaultedLoansByYear.mockResolvedValue([loan]);

      const result = await controller.getDefaultedLoansByYear(query);

      expect(findDefaultedLoansByYear).toHaveBeenCalledWith(query);
      expect(result).toEqual([loan]);
    });
  });

  describe('getDistributionOfDefaults', () => {
    it('should return the distribution of defaults', async () => {
      const query = { startDate: new Date(2019), endDate: new Date(2021) };
      const expectedDistribution = {
        defaulted: 28,
        nonDefaulted: 1639,
      };
      getDistributionOfDefaults.mockResolvedValue(expectedDistribution);

      const result = await controller.getDistributionOfDefaults(query);

      expect(getDistributionOfDefaults).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedDistribution);
    });
  });
});
