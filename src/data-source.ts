import "reflect-metadata";
import dotenv from "dotenv";

dotenv.config();
import { DataSource } from "typeorm";
import { Categoria } from "./model/categoria";
import { Tenis } from "./model/tenis";
import { Usuario } from "./model/usuario";
import { Pedido } from "./model/pedido";
import { ItemPedido } from "./model/item-pedido";

const DB_HOST = process.env.DB_HOST ?? "localhost";
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;
const DB_USER = process.env.DB_USER ?? "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD ?? "senacrs";
const DB_NAME = process.env.DB_NAME ?? "buysneakers";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [Categoria, Tenis, Usuario, Pedido, ItemPedido],
  synchronize: true,
  logging: true,
});
