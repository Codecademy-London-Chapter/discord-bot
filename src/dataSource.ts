import "reflect-metadata";
import { DataSource } from "typeorm";
import Event from "./entities/Event";
import Resource from "./entities/Resource";
import ResourceCategory from "./entities/ResourceCategory";
import PairProgrammingApplication from "./entities/PairProgrammingApplication";
import path from "node:path";

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: [
    path.resolve(__dirname, 'entities/*{.ts,.js}') // ts required for ts-node and js for tsc build
  ],
  subscribers: [],
  migrations: [],
});
