import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + 'dist/db/migrations/*{.ts,.js}'],
  synchronize: true,
};

export default new DataSource(dataSourceOptions);
