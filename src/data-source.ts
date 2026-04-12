import "reflect-metadata";
import { DataSource } from "typeorm";
import { Categoria } from "./model/categoria";
import { Tenis } from "./model/tenis";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "senacrs",
  database: "buysneakers",
  entities: [Categoria, Tenis],
  synchronize: true,
  logging: false,
});