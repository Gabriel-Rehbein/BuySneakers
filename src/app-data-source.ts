import { DataSource } from "typeorm"
import { Produto } from "./model/produto"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "senacrs",
    database: "crud-produtos",
    entities: [Produto],
    logging: true,
    synchronize: true,
})