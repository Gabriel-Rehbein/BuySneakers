import { Tenis } from "../model/tenis";
import { CategoriaRepository } from "../repository/categoria-repository";
import { TenisRepository } from "../repository/tenis-repository";

type TenisInput = {
  nome: string;
  marca: string;
  cor: string;
  preco: number;
  tamanho: number;
  estoque: number;
  categoriaId: number;
};

export class TenisService {
  constructor(
    private tenisRepository: TenisRepository,
    private categoriaRepository: CategoriaRepository
  ) {}

  async inserir(dados: TenisInput): Promise<Tenis> {
    if (!dados?.nome?.trim()) throw { id: 400, msg: "Nome do tênis é obrigatório" };
    if (!dados?.marca?.trim()) throw { id: 400, msg: "Marca é obrigatória" };
    if (!dados?.cor?.trim()) throw { id: 400, msg: "Cor é obrigatória" };
    if (dados.preco === undefined || dados.preco < 0) throw { id: 400, msg: "Preço inválido" };
    if (dados.tamanho === undefined || dados.tamanho <= 0) throw { id: 400, msg: "Tamanho inválido" };
    if (dados.estoque === undefined || dados.estoque < 0) throw { id: 400, msg: "Estoque inválido" };
    if (!dados.categoriaId) throw { id: 400, msg: "Categoria é obrigatória" };

    const categoria = await this.categoriaRepository.buscarPorId(dados.categoriaId);
    if (!categoria) throw { id: 404, msg: "Categoria não encontrada" };

    const tenis = new Tenis();
    tenis.nome = dados.nome.trim();
    tenis.marca = dados.marca.trim();
    tenis.cor = dados.cor.trim();
    tenis.preco = dados.preco;
    tenis.tamanho = dados.tamanho;
    tenis.estoque = dados.estoque;
    tenis.categoria = categoria;

    return await this.tenisRepository.inserir(tenis);
  }

  async listar(): Promise<Tenis[]> {
    return await this.tenisRepository.listar();
  }

  async buscarPorId(id: number): Promise<Tenis> {
    const tenis = await this.tenisRepository.buscarPorId(id);
    if (!tenis) throw { id: 404, msg: "Tênis não encontrado" };
    return tenis;
  }

  async atualizar(id: number, dados: Partial<TenisInput>): Promise<Tenis> {
    const tenis = await this.tenisRepository.buscarPorId(id);
    if (!tenis) throw { id: 404, msg: "Tênis não encontrado" };

    if (dados.nome !== undefined) {
      if (!dados.nome.trim()) throw { id: 400, msg: "Nome inválido" };
      tenis.nome = dados.nome.trim();
    }

    if (dados.marca !== undefined) {
      if (!dados.marca.trim()) throw { id: 400, msg: "Marca inválida" };
      tenis.marca = dados.marca.trim();
    }

    if (dados.cor !== undefined) {
      if (!dados.cor.trim()) throw { id: 400, msg: "Cor inválida" };
      tenis.cor = dados.cor.trim();
    }

    if (dados.preco !== undefined) {
      if (dados.preco < 0) throw { id: 400, msg: "Preço inválido" };
      tenis.preco = dados.preco;
    }

    if (dados.tamanho !== undefined) {
      if (dados.tamanho <= 0) throw { id: 400, msg: "Tamanho inválido" };
      tenis.tamanho = dados.tamanho;
    }

    if (dados.estoque !== undefined) {
      if (dados.estoque < 0) throw { id: 400, msg: "Estoque inválido" };
      tenis.estoque = dados.estoque;
    }

    if (dados.categoriaId !== undefined) {
      const categoria = await this.categoriaRepository.buscarPorId(dados.categoriaId);
      if (!categoria) throw { id: 404, msg: "Categoria não encontrada" };
      tenis.categoria = categoria;
    }

    const atualizado = await this.tenisRepository.atualizar(id, tenis);
    if (!atualizado) throw { id: 404, msg: "Tênis não encontrado" };

    return atualizado;
  }

  async deletar(id: number): Promise<void> {
    const removido = await this.tenisRepository.deletar(id);
    if (!removido) throw { id: 404, msg: "Tênis não encontrado" };
  }
}