import { BarChart3, Layers } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { listarTenis } from "../services/api";
import { StatusMessage } from "../components/StatusMessage";
import type { Tenis } from "../services/api";

function formatarMoeda(valor: number | string) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function DashboardPage() {
  const [tenis, setTenis] = useState<Tenis[]>([]);
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      setIsLoading(true);
      setErro("");

      try {
        const dados = await listarTenis();
        setTenis(dados);
      } catch (error) {
        setErro(error instanceof Error ? error.message : "Erro ao carregar dados");
      } finally {
        setIsLoading(false);
      }
    }

    carregar();
  }, []);

  const totalEstoque = useMemo(() => tenis.reduce((total, item) => total + item.estoque, 0), [tenis]);
  const totalValorEstoque = useMemo(
    () => tenis.reduce((total, item) => total + Number(item.preco) * item.estoque, 0),
    [tenis]
  );
  const totalCategorias = useMemo(
    () => new Set(tenis.map((item) => item.categoria?.nome ?? "Sem categoria")).size,
    [tenis]
  );

  const categoriasPorEstoque = useMemo(() => {
    const agrupamento = new Map<string, { quantidade: number; estoque: number }>();

    for (const item of tenis) {
      const nomeCategoria = item.categoria?.nome ?? "Sem categoria";
      const atual = agrupamento.get(nomeCategoria) ?? { quantidade: 0, estoque: 0 };
      atual.quantidade += 1;
      atual.estoque += item.estoque;
      agrupamento.set(nomeCategoria, atual);
    }

    return Array.from(agrupamento.entries()).map(([nome, dados]) => ({
      nome,
      ...dados,
    })).sort((a, b) => b.estoque - a.estoque);
  }, [tenis]);

  const produtosBaixoEstoque = useMemo(
    () => [...tenis].sort((a, b) => a.estoque - b.estoque).slice(0, 5),
    [tenis]
  );

  const maiorEstoque = Math.max(...categoriasPorEstoque.map((item) => item.estoque), 1);

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Relatórios</p>
          <h1>Visão de estoque e categorias</h1>
          <p className="page-description">
            Painel de gestão com gráficos rápidos, estoque por categoria e produtos em falta.
          </p>
        </div>
      </section>

      <section className="metrics-grid" aria-label="Resumo do estoque">
        <div className="metric">
          <span>Total de produtos</span>
          <strong>{tenis.length}</strong>
        </div>
        <div className="metric">
          <span>Total de categorias</span>
          <strong>{totalCategorias}</strong>
        </div>
        <div className="metric">
          <span>Total em estoque</span>
          <strong>{totalEstoque}</strong>
        </div>
        <div className="metric">
          <span>Valor estimado</span>
          <strong>{formatarMoeda(totalValorEstoque)}</strong>
        </div>
      </section>

      {erro && <StatusMessage type="error">{erro}</StatusMessage>}
      {isLoading && <StatusMessage type="info">Carregando indicadores...</StatusMessage>}

      {!isLoading && (
        <section className="panel graph-panel">
          <div className="panel-header">
            <h2 className="panel-title">Estoque por categoria</h2>
            <div className="panel-meta">
              <Layers size={18} aria-hidden="true" />
              {categoriasPorEstoque.length} categorias
            </div>
          </div>

          <div className="bar-graph">
            {categoriasPorEstoque.map((categoria) => (
              <div className="bar-row" key={categoria.nome}>
                <div className="bar-row-label">
                  <strong>{categoria.nome}</strong>
                  <span>{categoria.quantidade} produto(s)</span>
                </div>
                <div className="bar-row-track">
                  <div
                    className="bar-row-fill"
                    style={{ width: `${(categoria.estoque / maiorEstoque) * 100}%` }}
                  />
                </div>
                <span className="bar-row-value">{categoria.estoque} un.</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {!isLoading && (
        <section className="panel chart-panel">
          <div className="panel-header">
            <h2 className="panel-title">Produtos com menor estoque</h2>
            <div className="panel-meta">
              <BarChart3 size={18} aria-hidden="true" />
              {produtosBaixoEstoque.length} itens
            </div>
          </div>

          <div className="low-stock-list">
            {produtosBaixoEstoque.map((item) => (
              <article key={item.id} className="low-stock-item">
                <div>
                  <strong>{item.nome}</strong>
                  <p className="muted">{item.categoria?.nome ?? "Sem categoria"}</p>
                </div>
                <span className={item.estoque <= 3 ? "stock danger" : "stock"}>
                  {item.estoque} em estoque
                </span>
              </article>
            ))}
          </div>
        </section>
      )}

      {!isLoading && tenis.length === 0 && (
        <section className="panel">
          <div className="empty-state">Nenhum tênis encontrado para mostrar gráficos.</div>
        </section>
      )}
    </main>
  );
}
