import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { dataSourceOptions } from '../data-source';
import { LoanModule } from './loan/loan.module';
import { LoanSeed } from './database/seed/loan.seed';

@Module({
  // Import required modules for the application
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions), // Configure TypeORM with data source options
    ConfigModule.forRoot(), // Configure the application with environment variables
    LoanModule, // Import the LoanModule
  ],
  controllers: [], // No controllers defined in this module
  providers: [LoanSeed], // Provide the LoanSeed service
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly loanSeed: LoanSeed) {}

  // Method executed when the application has fully started
  async onApplicationBootstrap(): Promise<void> {
    // Seed the database with loan data
    await this.loanSeed.seed();
  }
}
