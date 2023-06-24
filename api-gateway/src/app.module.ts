import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { LoanService } from './loan/loan.service';

@Module({
  // Import the ConfigModule to enable configuration management
  imports: [ConfigModule.forRoot()],

  // Specify the controllers used in this module
  controllers: [AppController],

  // Specify the services (providers) used in this module
  providers: [LoanService],
})
export class AppModule {}
