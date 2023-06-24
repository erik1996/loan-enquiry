import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  IsDate,
  ValidationArguments,
} from 'class-validator';

// Enum representing job types
export enum Job {
  ADMIN = 'admin',
  UNKNOWN = 'unknown',
  UNEMPLOYED = 'unemployed',
  MANAGEMENT = 'management',
  HOUSEMAID = 'housemaid',
  ENTREPRENEUR = 'entrepreneur',
  STUDENT = 'student',
  BLUE_COllAR = 'blue-collar',
  SELF_EMPLOYED = 'self-employed',
  RETIRED = 'retired',
  TECHNICIAN = 'technician',
  SERVICES = 'services',
}

// Enum representing marital statuses
export enum Marital {
  MARRIED = 'married',
  DIVORCED = 'divorced',
  SINGLE = 'single',
}

// Enum representing education levels
export enum Education {
  UNKNOWN = 'unknown',
  SECONDARY = 'secondary',
  PRiMARY = 'primary',
  TERTIARY = 'tertiary',
}

@ValidatorConstraint({ name: 'stringified-int', async: false })
export class StringifiedInt implements ValidatorConstraintInterface {
  validate = (value) =>
    !isNaN(Number(value)) &&
    Number.isInteger(Number(value)) &&
    Number(value) > 0;
  defaultMessage = () => '($value) must be positive integer';
}

@ValidatorConstraint({ name: 'isBefore', async: false })
export class IsBeforeConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    return propertyValue <= args.object[args.constraints[0]];
  }

  defaultMessage(args: ValidationArguments) {
    return `"${args.property}" must be before or equal to "${args.constraints[0]}"`;
  }
}

// DTO for loan ID payload
export class LoanIdPayloadDto {
  @IsString()
  @IsNotEmpty()
  id: string; // ID of the loan
}

// DTO for loan years payload
export class LoanYearsPayloadDto {
  @IsString()
  @IsNotEmpty()
  defaultStatus: boolean; // Default status of the loan

  @IsEnum(Marital)
  @IsNotEmpty()
  gender: Marital; // Marital status of the loan holder

  @IsEnum(Job)
  @IsNotEmpty()
  job: Job; // Job type of the loan holder
}

// DTO for defaulted loans payload
export class LoanDefaultedPayloadDto {
  @Validate(StringifiedInt)
  @IsNotEmpty()
  year: number; // Year of the defaulted loans

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  currency?: string; // Optional currency for exchange rate conversion
}

// DTO for loan distribution of defaults payload
export class LoanDistributionDefaultedPayloadDto {
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @Validate(IsBeforeConstraint, ['endDate'])
  @IsDate()
  startDate: Date; // Start date for loan distribution analysis

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  endDate: Date; // End date for loan distribution analysis
}
