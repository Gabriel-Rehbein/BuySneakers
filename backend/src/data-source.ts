import "reflect-metadata";
import dotenv from "dotenv";

dotenv.config();
import bcrypt from "bcrypt";
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

function escaparIdentificadorPostgres(valor: string): string {
  return `"${valor.replace(/"/g, '""')}"`;
}

export async function criarBancoSeNaoExistir(): Promise<void> {
  const conexaoAdministrativa = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    database: "postgres",
    synchronize: false,
    logging: false,
  });

  await conexaoAdministrativa.initialize();

  try {
    const resultado = await conexaoAdministrativa.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [DB_NAME]
    );

    if (resultado.length === 0) {
      await conexaoAdministrativa.query(
        `CREATE DATABASE ${escaparIdentificadorPostgres(DB_NAME)}`
      );
      console.log("Banco criado.");
    }
  } finally {
    await conexaoAdministrativa.destroy();
  }
}

export async function inicializarDadosIniciais(): Promise<void> {
  const categoriaRepository = AppDataSource.getRepository(Categoria);
  const tenisRepository = AppDataSource.getRepository(Tenis);
  const usuarioRepository = AppDataSource.getRepository(Usuario);

  const categoriasIniciais = [
    { nome: "Corrida", descricao: "Tênis para corrida e performance." },
    { nome: "Basquete", descricao: "Tênis com amortecimento para quadra." },
    { nome: "Casual", descricao: "Tênis para o dia a dia e estilo urbano." },
    { nome: "Skate", descricao: "Tênis com solado resistente para skate." },
    { nome: "Treino", descricao: "Tênis para academia e treino funcional." },
    { nome: "Trilha", descricao: "Tênis para terrenos irregulares e trilhas." },
    { nome: "Lifestyle", descricao: "Tênis com visual moderno e conforto." },
    { nome: "Outdoor", descricao: "Tênis para atividades ao ar livre." },
    { nome: "Voleibol", descricao: "Tênis para quadra indoor e controle." },
    { nome: "Futsal", descricao: "Tênis indoor para futebol de salão." },
  ];

  const categoriasSalvas: Categoria[] = [];

  for (const categoriaInicial of categoriasIniciais) {
    let categoria = await categoriaRepository.findOne({
      where: { nome: categoriaInicial.nome },
    });

    if (!categoria) {
      categoria = categoriaRepository.create(categoriaInicial);
      categoria = await categoriaRepository.save(categoria);
    }

    categoriasSalvas.push(categoria);
  }

  const tenisIniciais = [
    {
      nome: "Speed Runner",
      marca: "Nike",
      cor: "Preto",
      preco: 449.9,
      tamanho: 42,
      estoque: 18,
      imagemUrl: "https://via.placeholder.com/450x300?text=Speed+Runner",
      categoriaNome: "Corrida",
    },
    {
      nome: "Air Motion",
      marca: "Adidas",
      cor: "Branco",
      preco: 399.9,
      tamanho: 40,
      estoque: 15,
      imagemUrl: "https://via.placeholder.com/450x300?text=Air+Motion",
      categoriaNome: "Corrida",
    },
    {
      nome: "Court Pro",
      marca: "Puma",
      cor: "Azul",
      preco: 379.9,
      tamanho: 43,
      estoque: 12,
      imagemUrl: "https://via.placeholder.com/450x300?text=Court+Pro",
      categoriaNome: "Basquete",
    },
    {
      nome: "Sky Dunk",
      marca: "Jordan",
      cor: "Vermelho",
      preco: 489.9,
      tamanho: 44,
      estoque: 8,
      imagemUrl: "https://via.placeholder.com/450x300?text=Sky+Dunk",
      categoriaNome: "Basquete",
    },
    {
      nome: "City Walk",
      marca: "Vans",
      cor: "Cinza",
      preco: 259.9,
      tamanho: 41,
      estoque: 22,
      imagemUrl: "https://via.placeholder.com/450x300?text=City+Walk",
      categoriaNome: "Casual",
    },
    {
      nome: "Street Classic",
      marca: "Converse",
      cor: "Branco",
      preco: 219.9,
      tamanho: 40,
      estoque: 19,
      imagemUrl: "https://via.placeholder.com/450x300?text=Street+Classic",
      categoriaNome: "Casual",
    },
    {
      nome: "Ramp Skate",
      marca: "Globe",
      cor: "Preto",
      preco: 299.9,
      tamanho: 42,
      estoque: 10,
      imagemUrl: "https://via.placeholder.com/450x300?text=Ramp+Skate",
      categoriaNome: "Skate",
    },
    {
      nome: "Board Master",
      marca: "Etnies",
      cor: "Azul",
      preco: 329.9,
      tamanho: 43,
      estoque: 9,
      imagemUrl: "https://via.placeholder.com/450x300?text=Board+Master",
      categoriaNome: "Skate",
    },
    {
      nome: "Power Lift",
      marca: "Reebok",
      cor: "Preto",
      preco: 349.9,
      tamanho: 44,
      estoque: 13,
      imagemUrl: "https://via.placeholder.com/450x300?text=Power+Lift",
      categoriaNome: "Treino",
    },
    {
      nome: "Gym Flex",
      marca: "Under Armour",
      cor: "Verde",
      preco: 369.9,
      tamanho: 42,
      estoque: 14,
      imagemUrl: "https://via.placeholder.com/450x300?text=Gym+Flex",
      categoriaNome: "Treino",
    },
    {
      nome: "Trail Blaze",
      marca: "Merrell",
      cor: "Marrom",
      preco: 429.9,
      tamanho: 43,
      estoque: 11,
      imagemUrl: "https://via.placeholder.com/450x300?text=Trail+Blaze",
      categoriaNome: "Trilha",
    },
    {
      nome: "Mountain Track",
      marca: "Salomon",
      cor: "Verde",
      preco: 459.9,
      tamanho: 45,
      estoque: 10,
      imagemUrl: "https://via.placeholder.com/450x300?text=Mountain+Track",
      categoriaNome: "Trilha",
    },
    {
      nome: "Urban Life",
      marca: "New Balance",
      cor: "Cinza",
      preco: 329.9,
      tamanho: 41,
      estoque: 20,
      imagemUrl: "https://via.placeholder.com/450x300?text=Urban+Life",
      categoriaNome: "Lifestyle",
    },
    {
      nome: "City Pulse",
      marca: "Asics",
      cor: "Branco",
      preco: 339.9,
      tamanho: 42,
      estoque: 17,
      imagemUrl: "https://via.placeholder.com/450x300?text=City+Pulse",
      categoriaNome: "Lifestyle",
    },
    {
      nome: "Trail Guard",
      marca: "The North Face",
      cor: "Preto",
      preco: 419.9,
      tamanho: 44,
      estoque: 12,
      imagemUrl: "https://via.placeholder.com/450x300?text=Trail+Guard",
      categoriaNome: "Outdoor",
    },
    {
      nome: "Outdoor Prime",
      marca: "Columbia",
      cor: "Verde",
      preco: 439.9,
      tamanho: 43,
      estoque: 11,
      imagemUrl: "https://via.placeholder.com/450x300?text=Outdoor+Prime",
      categoriaNome: "Outdoor",
    },
    {
      nome: "Net Spike",
      marca: "Mizuno",
      cor: "Branco",
      preco: 389.9,
      tamanho: 42,
      estoque: 16,
      imagemUrl: "https://via.placeholder.com/450x300?text=Net+Spike",
      categoriaNome: "Voleibol",
    },
    {
      nome: "Volley Speed",
      marca: "Adidas",
      cor: "Azul",
      preco: 399.9,
      tamanho: 44,
      estoque: 15,
      imagemUrl: "https://via.placeholder.com/450x300?text=Volley+Speed",
      categoriaNome: "Voleibol",
    },
    {
      nome: "Futsal Pro",
      marca: "Puma",
      cor: "Preto",
      preco: 319.9,
      tamanho: 41,
      estoque: 18,
      imagemUrl: "https://via.placeholder.com/450x300?text=Futsal+Pro",
      categoriaNome: "Futsal",
    },
    {
      nome: "Indoor Turbo",
      marca: "Nike",
      cor: "Branco",
      preco: 349.9,
      tamanho: 42,
      estoque: 14,
      imagemUrl: "https://via.placeholder.com/450x300?text=Indoor+Turbo",
      categoriaNome: "Futsal",
    },
  ];

  for (const tenisData of tenisIniciais) {
    const tenisExistente = await tenisRepository.findOne({
      where: { nome: tenisData.nome },
    });

    if (!tenisExistente) {
      const categoria = categoriasSalvas.find(
        (categoriaSalva) => categoriaSalva.nome === tenisData.categoriaNome
      );

      if (!categoria) {
        continue;
      }

      const tenis = tenisRepository.create({
        nome: tenisData.nome,
        marca: tenisData.marca,
        cor: tenisData.cor,
        preco: tenisData.preco,
        tamanho: tenisData.tamanho,
        estoque: tenisData.estoque,
        imagemUrl: tenisData.imagemUrl,
        categoria,
      });

      await tenisRepository.save(tenis);
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@buysneakers.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  const adminNome = process.env.ADMIN_NAME ?? "Administrador BuySneakers";

  const usuarioExistente = await usuarioRepository.findOne({
    where: { email: adminEmail },
  });

  if (!usuarioExistente) {
    const usuario = usuarioRepository.create({
      nome: adminNome,
      email: adminEmail,
      senha: await bcrypt.hash(adminPassword, 10),
    });

    await usuarioRepository.save(usuario);
    console.log(`Usuário padrão criado: ${adminEmail} / ${adminPassword}`);
  }
}

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [Categoria, Tenis, Usuario, Pedido, ItemPedido],
  synchronize: true,
  logging: false,
});
