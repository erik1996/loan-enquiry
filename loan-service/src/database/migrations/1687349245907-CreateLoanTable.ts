import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLoanTable1687349245907 implements MigrationInterface {
  name = 'CreateLoanTable1687349245907';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`loan\` (\`id\` varchar(255) NOT NULL, \`date\` date NOT NULL, \`age\` int NOT NULL, \`job\` enum ('admin', 'unknown', 'unemployed', 'management', 'housemaid', 'entrepreneur', 'student', 'blue-collar', 'self-employed', 'retired', 'technician', 'services') NOT NULL, \`marital\` enum ('married', 'divorced', 'single') NOT NULL, \`education\` enum ('unknown', 'secondary', 'primary', 'tertiary') NOT NULL, \`default\` tinyint NOT NULL, \`balance\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`loan\``);
  }
}
