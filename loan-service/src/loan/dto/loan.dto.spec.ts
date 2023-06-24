import { validate } from 'class-validator';
import {
  LoanIdPayloadDto,
  LoanYearsPayloadDto,
  LoanDefaultedPayloadDto,
  LoanDistributionDefaultedPayloadDto,
  Marital,
} from './loan.dto';
import { plainToClass } from 'class-transformer';

describe('LoanIdPayloadDto', () => {
  it('should validate id is not empty', async () => {
    const dto = new LoanIdPayloadDto();
    dto.id = '';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should validate id is a string', async () => {
    const dto = new LoanIdPayloadDto();
    dto.id = 123 as any; // testing with number, should fail
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('LoanYearsPayloadDto', () => {
  it('should validate gender enum value', async () => {
    const dto = new LoanYearsPayloadDto();
    dto.gender = 'alien' as any;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should validate job enum value', async () => {
    const dto = new LoanYearsPayloadDto();
    dto.gender = Marital.MARRIED;
    dto.job = 'engineer' as any;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('LoanDefaultedPayloadDto', () => {
  it('should validate year is a positive integer', async () => {
    const dto = new LoanDefaultedPayloadDto();
    dto.year = -1 as any;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should validate year is an integer', async () => {
    const dto = new LoanDefaultedPayloadDto();
    dto.year = 'abc' as any;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('LoanDistributionDefaultedPayloadDto', () => {
  it('should validate startDate and endDate', async () => {
    const dto = new LoanDistributionDefaultedPayloadDto();
    dto.startDate = new Date('2023-07-01');
    dto.endDate = new Date('2023-06-01');
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should pass for correct startDate and endDate', async () => {
    const dto = new LoanDistributionDefaultedPayloadDto();
    dto.startDate = new Date('2023-06-01');
    dto.endDate = new Date('2023-07-01');
    const errors = await validate(dto);
    expect(errors.length).toEqual(0);
  });

  it('should transform startDate string to Date', async () => {
    const dto = plainToClass(LoanDistributionDefaultedPayloadDto, {
      startDate: '2023-06-01T00:00:00.000Z',
      endDate: new Date('2023-07-01'),
    });
    expect(dto.startDate).toBeInstanceOf(Date);
    const errors = await validate(dto);
    expect(errors.length).toEqual(0);
  });

  it('should transform endDate string to Date', async () => {
    const dto = plainToClass(LoanDistributionDefaultedPayloadDto, {
      startDate: new Date('2023-06-01'),
      endDate: '2023-07-01T00:00:00.000Z',
    });
    expect(dto.endDate).toBeInstanceOf(Date);
    const errors = await validate(dto);
    expect(errors.length).toEqual(0);
  });
});
