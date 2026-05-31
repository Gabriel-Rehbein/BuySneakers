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

  const criarImagemTenis = (photoId: string) =>
    `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=640&q=80`;

  const tenisIniciais = [
    {
      nome: "Speed Runner",
      marca: "Nike",
      cor: "Preto",
      preco: 449.9,
      tamanho: 42,
      estoque: 18,
      imagemUrl: criarImagemTenis("1542291026-7eec264c27ff"),
      categoriaNome: "Corrida",
    },
    {
      nome: "Air Motion",
      marca: "Adidas",
      cor: "Branco",
      preco: 399.9,
      tamanho: 40,
      estoque: 15,
      imagemUrl: criarImagemTenis("1549298916-b41d501d3772"),
      categoriaNome: "Corrida",
    },
    {
      nome: "Court Pro",
      marca: "Puma",
      cor: "Azul",
      preco: 379.9,
      tamanho: 43,
      estoque: 12,
      imagemUrl: criarImagemTenis("1608231387042-66d1773070a5"),
      categoriaNome: "Basquete",
    },
    {
      nome: "Sky Dunk",
      marca: "Jordan",
      cor: "Vermelho",
      preco: 489.9,
      tamanho: 44,
      estoque: 8,
      imagemUrl: criarImagemTenis("1606107557195-0e29a4b5b4aa"),
      categoriaNome: "Basquete",
    },
    {
      nome: "City Walk",
      marca: "Vans",
      cor: "Cinza",
      preco: 259.9,
      tamanho: 41,
      estoque: 22,
      imagemUrl: criarImagemTenis("1525966222134-fcfa99b8ae77"),
      categoriaNome: "Casual",
    },
    {
      nome: "Street Classic",
      marca: "Converse",
      cor: "Branco",
      preco: 219.9,
      tamanho: 40,
      estoque: 19,
      imagemUrl: criarImagemTenis("1491553895911-0055eca6402d"),
      categoriaNome: "Casual",
    },
    {
      nome: "Ramp Skate",
      marca: "Globe",
      cor: "Preto",
      preco: 299.9,
      tamanho: 42,
      estoque: 10,
      imagemUrl: criarImagemTenis("1460353581641-37baddab0fa2"),
      categoriaNome: "Skate",
    },
    {
      nome: "Board Master",
      marca: "Etnies",
      cor: "Azul",
      preco: 329.9,
      tamanho: 43,
      estoque: 9,
      imagemUrl: criarImagemTenis("1520256862855-398228c41684"),
      categoriaNome: "Skate",
    },
    {
      nome: "Power Lift",
      marca: "Reebok",
      cor: "Preto",
      preco: 349.9,
      tamanho: 44,
      estoque: 13,
      imagemUrl: criarImagemTenis("1515955656352-a1fa3ffcd111"),
      categoriaNome: "Treino",
    },
    {
      nome: "Gym Flex",
      marca: "Under Armour",
      cor: "Verde",
      preco: 369.9,
      tamanho: 42,
      estoque: 14,
      imagemUrl: criarImagemTenis("1556906781-9a412961c28c"),
      categoriaNome: "Treino",
    },
    {
      nome: "Trail Blaze",
      marca: "Merrell",
      cor: "Marrom",
      preco: 429.9,
      tamanho: 43,
      estoque: 11,
      imagemUrl: criarImagemTenis("1539185441755-769473a23570"),
      categoriaNome: "Trilha",
    },
    {
      nome: "Mountain Track",
      marca: "Salomon",
      cor: "Verde",
      preco: 459.9,
      tamanho: 45,
      estoque: 10,
      imagemUrl: criarImagemTenis("1521093470119-a3acdc43374a"),
      categoriaNome: "Trilha",
    },
    {
      nome: "Urban Life",
      marca: "New Balance",
      cor: "Cinza",
      preco: 329.9,
      tamanho: 41,
      estoque: 20,
      imagemUrl: criarImagemTenis("1543508282-6319a3e2621f"),
      categoriaNome: "Lifestyle",
    },
    {
      nome: "City Pulse",
      marca: "Asics",
      cor: "Branco",
      preco: 339.9,
      tamanho: 42,
      estoque: 17,
      imagemUrl: criarImagemTenis("1595950653106-6c9ebd614d3a"),
      categoriaNome: "Lifestyle",
    },
    {
      nome: "Trail Guard",
      marca: "The North Face",
      cor: "Preto",
      preco: 419.9,
      tamanho: 44,
      estoque: 12,
      imagemUrl: criarImagemTenis("1600185365483-26d7a4cc7519"),
      categoriaNome: "Outdoor",
    },
    {
      nome: "Outdoor Prime",
      marca: "Columbia",
      cor: "Verde",
      preco: 439.9,
      tamanho: 43,
      estoque: 11,
      imagemUrl: criarImagemTenis("1529810313688-44ea1c2d81d3"),
      categoriaNome: "Outdoor",
    },
    {
      nome: "Net Spike",
      marca: "Mizuno",
      cor: "Branco",
      preco: 389.9,
      tamanho: 42,
      estoque: 16,
      imagemUrl: criarImagemTenis("1543163521-1bf539c55dd2"),
      categoriaNome: "Voleibol",
    },
    {
      nome: "Volley Speed",
      marca: "Adidas",
      cor: "Azul",
      preco: 399.9,
      tamanho: 44,
      estoque: 15,
      imagemUrl: criarImagemTenis("1514989940723-e8e51635b782"),
      categoriaNome: "Voleibol",
    },
    {
      nome: "Futsal Pro",
      marca: "Puma",
      cor: "Preto",
      preco: 319.9,
      tamanho: 41,
      estoque: 18,
      imagemUrl: criarImagemTenis("1551107696-a4b0c5a0d9a2"),
      categoriaNome: "Futsal",
    },
    {
      nome: "Indoor Turbo",
      marca: "Nike",
      cor: "Branco",
      preco: 349.9,
      tamanho: 42,
      estoque: 14,
      imagemUrl: criarImagemTenis("1587563871167-1ee9c731aefb"),
      categoriaNome: "Futsal",
    },
  ];

  for (const tenisData of tenisIniciais) {
    const tenisExistente = await tenisRepository.findOne({
      where: { nome: tenisData.nome },
    });

    const categoria = categoriasSalvas.find(
      (categoriaSalva) => categoriaSalva.nome === tenisData.categoriaNome
    );

    if (!categoria) {
      continue;
    }

    if (!tenisExistente) {
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
      continue;
    }

    if (
      !tenisExistente.imagemUrl ||
      tenisExistente.imagemUrl.includes("via.placeholder.com")
    ) {
      tenisExistente.imagemUrl = tenisData.imagemUrl;
      tenisExistente.categoria = categoria;
      await tenisRepository.save(tenisExistente);
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
