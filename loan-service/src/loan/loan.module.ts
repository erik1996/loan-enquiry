import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { LoanEntity } from './entity/loan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LoanEntity])], // Import the TypeOrmModule and specify the entities to be used
  controllers: [LoanController], // Declare the LoanController as a controller within this module
  providers: [LoanService], // Provide the LoanService as a dependency within this module
})
export class LoanModule {}
