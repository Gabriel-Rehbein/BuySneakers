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
  imagemUrl?: string | null;
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

  private validarTexto(valor: unknown, nomeCampo: string): string {
    if (typeof valor !== "string" || !valor.trim()) {
      throw new Error(`400|${nomeCampo} obrigatório(a)`);
    }

    return valor.trim();
  }

  private validarPreco(preco: number): void {
    if (preco === undefined || preco === null || isNaN(preco) || preco < 0) {
      throw new Error("400|Preço inválido");
    }
  }

  private validarTamanho(tamanho: number): void {
    if (tamanho === undefined || tamanho === null || isNaN(tamanho) || tamanho <= 0) {
      throw new Error("400|Tamanho inválido");
    }
  }

  private validarEstoque(estoque: number): void {
    if (estoque === undefined || estoque === null || isNaN(estoque) || estoque < 0) {
      throw new Error("400|Estoque inválido");
    }
  }

  private validarCategoriaId(categoriaId: number): void {
    if (
      categoriaId === undefined ||
      categoriaId === null ||
      !Number.isInteger(categoriaId) ||
      categoriaId <= 0
    ) {
      throw new Error("400|Categoria obrigatória ou inválida");
    }
  }

  private tratarImagemUrl(imagemUrl?: string | null): string | undefined {
    if (imagemUrl === undefined) return undefined;
    if (imagemUrl === null) return undefined;
    if (typeof imagemUrl !== "string") {
      throw new Error("400|Imagem inválida");
    }

    const valor = imagemUrl.trim();
    return valor ? valor : undefined;
  }

  async inserir(dados: TenisInput): Promise<Tenis> {
    const nome = this.validarTexto(dados?.nome, "Nome");
    const marca = this.validarTexto(dados?.marca, "Marca");
    const cor = this.validarTexto(dados?.cor, "Cor");

    this.validarPreco(dados.preco);
    this.validarTamanho(dados.tamanho);
    this.validarEstoque(dados.estoque);
    this.validarCategoriaId(dados.categoriaId);

    const categoria = await this.categoriaRepository.buscarPorId(dados.categoriaId);
    if (!categoria) {
      throw new Error("404|Categoria não encontrada");
    }

    const tenis = new Tenis();
    tenis.nome = nome;
    tenis.marca = marca;
    tenis.cor = cor;
    tenis.preco = Number(dados.preco);
    tenis.tamanho = Number(dados.tamanho);
    tenis.estoque = Number(dados.estoque);
    tenis.imagemUrl = this.tratarImagemUrl(dados.imagemUrl);
    tenis.categoria = categoria;

    return this.tenisRepository.inserir(tenis);
  }

  async listar(): Promise<Tenis[]> {
    return this.tenisRepository.listar();
  }

  async buscarPorId(id: number): Promise<Tenis> {
    this.validarId(id);

    const tenis = await this.tenisRepository.buscarPorId(id);
    if (!tenis) {
      throw new Error("404|Tênis não encontrado");
    }

    return tenis;
  }

  async atualizar(id: number, dados: Partial<TenisInput>): Promise<Tenis> {
    this.validarId(id);

    const tenis = await this.tenisRepository.buscarPorId(id);
    if (!tenis) {
      throw new Error("404|Tênis não encontrado");
    }

    if (dados.nome !== undefined) {
      tenis.nome = this.validarTexto(dados.nome, "Nome");
    }

    if (dados.marca !== undefined) {
      tenis.marca = this.validarTexto(dados.marca, "Marca");
    }

    if (dados.cor !== undefined) {
      tenis.cor = this.validarTexto(dados.cor, "Cor");
    }

    if (dados.preco !== undefined) {
      this.validarPreco(dados.preco);
      tenis.preco = Number(dados.preco);
    }

    if (dados.tamanho !== undefined) {
      this.validarTamanho(dados.tamanho);
      tenis.tamanho = Number(dados.tamanho);
    }

    if (dados.estoque !== undefined) {
      this.validarEstoque(dados.estoque);
      tenis.estoque = Number(dados.estoque);
    }

    if (dados.imagemUrl !== undefined) {
      tenis.imagemUrl = this.tratarImagemUrl(dados.imagemUrl);
    }

    if (dados.categoriaId !== undefined) {
      this.validarCategoriaId(dados.categoriaId);

      const categoria = await this.categoriaRepository.buscarPorId(dados.categoriaId);
      if (!categoria) {
        throw new Error("404|Categoria não encontrada");
      }

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
    if (!removido) {
      throw new Error("404|Tênis não encontrado");
    }
  }
}