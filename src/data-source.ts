import "reflect-metadata";
import { DataSource } from "typeorm";
import { Categoria } from "./model/categoria";
import { Tenis } from "./model/tenis";
import { Usuario } from "./model/usuario";
import { Pedido } from "./model/pedido";
import { ItemPedido } from "./model/item-pedido";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "senacrs",
  database: "buysneakers",
  entities: [Categoria, Tenis, Usuario, Pedido, ItemPedido],
  synchronize: true,
  logging: false,
});