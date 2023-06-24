import { Entity, Column, PrimaryColumn } from 'typeorm';

import { Education, Job, Marital } from '../dto/loan.dto';

@Entity('loan')
export class LoanEntity {
  @PrimaryColumn()
  id: string; // Primary key column for the LoanEntity

  @Column({
    type: 'date',
  })
  date: Date; // Column for the date of the loan

  @Column()
  age: number; // Column for the age of the loan holder

  @Column({
    type: 'enum',
    enum: Job,
  })
  job: Job; // Column for the job type of the loan holder

  @Column({
    type: 'enum',
    enum: Marital,
  })
  marital: Marital; // Column for the marital status of the loan holder

  @Column({
    type: 'enum',
    enum: Education,
  })
  education: Education; // Column for the education level of the loan holder

  @Column('bool')
  default: boolean; // Column indicating whether the loan is defaulted or not

  @Column()
  balance: number; // Column for the balance of the loan
}
