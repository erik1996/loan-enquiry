import { Injectable } from '@nestjs/common';
import { LoanEntity } from 'src/loan/entity/loan.entity';
import { EntityManager } from 'typeorm';
import { parse } from 'csv-parse';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class LoanSeed {
  constructor(private readonly entityManager: EntityManager) {}

  async seed(): Promise<void> {
    const listPromise = [];

    const headers = [
      'date',
      'id',
      'age',
      'job',
      'marital',
      'education',
      'default',
      'balance',
    ];
    const filepath = path.join(__dirname, '../../../public/test.csv');
    const fileContent = fs.readFileSync(filepath, { encoding: 'utf-8' });
    parse(
      fileContent,
      {
        delimiter: ',',
        columns: headers,
        on_record: (line) => {
          line = {
            ...line,
            date: new Date(line.date),
            age: Number(line.age),
            default: Number(line.default),
          };
          listPromise.push(this.entityManager.save(LoanEntity, line));
        },
      },
      async () => {
        await Promise.all(listPromise);
      },
    );
  }
}
