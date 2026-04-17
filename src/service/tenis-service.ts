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

  private validarId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("400|ID do tênis inválido");
    }
  }

  async inserir(dados: TenisInput): Promise<Tenis> {
    if (!dados?.nome?.trim()) throw new Error("400|Nome obrigatório");
    if (!dados?.marca?.trim()) throw new Error("400|Marca obrigatória");
    if (!dados?.cor?.trim()) throw new Error("400|Cor obrigatória");
    if (dados.preco === undefined || dados.preco < 0) throw new Error("400|Preço inválido");
    if (dados.tamanho === undefined || dados.tamanho <= 0) throw new Error("400|Tamanho inválido");
    if (dados.estoque === undefined || dados.estoque < 0) throw new Error("400|Estoque inválido");
    if (dados.categoriaId === undefined || dados.categoriaId <= 0) {
      throw new Error("400|Categoria obrigatória");
    }

    const categoria = await this.categoriaRepository.buscarPorId(dados.categoriaId);
    if (!categoria) throw new Error("404|Categoria não encontrada");

    const tenis = Object.assign(new Tenis(), {
      nome: dados.nome.trim(),
      marca: dados.marca.trim(),
      cor: dados.cor.trim(),
      preco: dados.preco,
      tamanho: dados.tamanho,
      estoque: dados.estoque,
      categoria
    });

    return this.tenisRepository.inserir(tenis);
  }

  async listar(): Promise<Tenis[]> {
    return this.tenisRepository.listar();
  }

  async buscarPorId(id: number): Promise<Tenis> {
    this.validarId(id);

    const tenis = await this.tenisRepository.buscarPorId(id);
    if (!tenis) throw new Error("404|Tênis não encontrado");

    return tenis;
  }

  async atualizar(id: number, dados: Partial<TenisInput>): Promise<Tenis> {
    this.validarId(id);

    const tenis = await this.tenisRepository.buscarPorId(id);
    if (!tenis) throw new Error("404|Tênis não encontrado");

    if (dados.nome !== undefined) {
      if (!dados.nome.trim()) throw new Error("400|Nome inválido");
      tenis.nome = dados.nome.trim();
    }

    if (dados.marca !== undefined) {
      if (!dados.marca.trim()) throw new Error("400|Marca inválida");
      tenis.marca = dados.marca.trim();
    }

    if (dados.cor !== undefined) {
      if (!dados.cor.trim()) throw new Error("400|Cor inválida");
      tenis.cor = dados.cor.trim();
    }

    if (dados.preco !== undefined) {
      if (dados.preco < 0) throw new Error("400|Preço inválido");
      tenis.preco = dados.preco;
    }

    if (dados.tamanho !== undefined) {
      if (dados.tamanho <= 0) throw new Error("400|Tamanho inválido");
      tenis.tamanho = dados.tamanho;
    }

    if (dados.estoque !== undefined) {
      if (dados.estoque < 0) throw new Error("400|Estoque inválido");
      tenis.estoque = dados.estoque;
    }

    if (dados.categoriaId !== undefined) {
      if (dados.categoriaId <= 0) throw new Error("400|Categoria inválida");

      const categoria = await this.categoriaRepository.buscarPorId(dados.categoriaId);
      if (!categoria) throw new Error("404|Categoria não encontrada");

      tenis.categoria = categoria;
    }

    const tenisAtualizado = await this.tenisRepository.atualizar(id, tenis);

    if (!tenisAtualizado) {
      throw new Error("404|Tênis não encontrado");
    }

    return tenisAtualizado;
  }

  async deletar(id: number): Promise<void> {
    this.validarId(id);

    const removido = await this.tenisRepository.deletar(id);
    if (!removido) throw new Error("404|Tênis não encontrado");
  }
}