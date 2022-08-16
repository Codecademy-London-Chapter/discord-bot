import "reflect-metadata";
import { DataSource } from "typeorm";
import Resource from "./entities/Resource";
import ResourceCategory from "./entities/ResourceCategory";

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: [ Resource, ResourceCategory ],
  subscribers: [],
  migrations: [],
});
