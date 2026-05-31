import { RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SneakerCard } from "../components/SneakerCard";
import { StatusMessage } from "../components/StatusMessage";
import { useAuth } from "../context/AuthContext";
import { criarPedido, listarMeusPedidos, listarTenis } from "../services/api";
import type { Pedido, Tenis } from "../services/api";

function formatarMoeda(valor: number | string) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function StorePage() {
  const { token, isAuthenticated } = useAuth();
  const [tenis, setTenis] = useState<Tenis[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [quantidades, setQuantidades] = useState<Record<number, number>>({});
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const totalEstoque = useMemo(
    () => tenis.reduce((total, item) => total + item.estoque, 0),
    [tenis]
  );

  async function carregarDados() {
    setIsLoading(true);
    setErro("");

    try {
      const [tenisCarregados, pedidosCarregados] = await Promise.all([
        listarTenis(),
        isAuthenticated ? listarMeusPedidos(token) : Promise.resolve([]),
      ]);

      setTenis(tenisCarregados);
      setPedidos(pedidosCarregados);
      setQuantidades((atual) => {
        const next = { ...atual };
        for (const item of tenisCarregados) {
          if (!next[item.id]) next[item.id] = 1;
        }
        return next;
      });
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao carregar a loja");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, [isAuthenticated, token]);

  function alterarQuantidade(tenisId: number, quantidade: number) {
    const item = tenis.find((produto) => produto.id === tenisId);
    const estoque = item?.estoque ?? 1;
    const quantidadeSegura = Math.min(Math.max(1, quantidade), estoque);

    setQuantidades((atual) => ({
      ...atual,
      [tenisId]: quantidadeSegura,
    }));
  }

  async function comprar(produto: Tenis) {
    setMensagem("");
    setErro("");

    if (!isAuthenticated) {
      setErro("Entre no sistema para finalizar um pedido.");
      return;
    }

    try {
      const quantidade = quantidades[produto.id] ?? 1;
      const pedido = await criarPedido(token, [{ tenisId: produto.id, quantidade }]);
      setMensagem(`Pedido #${pedido.id} criado com sucesso.`);
      await carregarDados();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao criar pedido");
    }
  }

  return (
    <main className="page">
      <section className="store-hero">
        <div>
          <p className="eyebrow">MVP BuySneakers</p>
          <h1>Vitrine e pedidos</h1>
          <p className="page-description">
            Escolha um tênis em estoque e finalize a compra. A API valida token, estoque, itens e atualiza o saldo do produto.
          </p>
        </div>
        <div className="hero-actions">
          <Link className="secondary-button" to="/dashboard">
            Relatórios
          </Link>
          <Link className="secondary-button" to="/tenis/novo">
            Cadastrar tênis
          </Link>
          <button className="primary-button" type="button" onClick={carregarDados}>
            <RefreshCw size={18} aria-hidden="true" />
            Atualizar
          </button>
        </div>
      </section>

      <section className="metrics-grid" aria-label="Resumo da loja">
        <div className="metric">
          <span>Produtos</span>
          <strong>{tenis.length}</strong>
        </div>
        <div className="metric">
          <span>Estoque</span>
          <strong>{totalEstoque}</strong>
        </div>
        <div className="metric">
          <span>Meus pedidos</span>
          <strong>{pedidos.length}</strong>
        </div>
      </section>

      {!isAuthenticated && (
        <StatusMessage type="info">A listagem é pública; para comprar, faça login em Acesso.</StatusMessage>
      )}
      {mensagem && <StatusMessage type="success">{mensagem}</StatusMessage>}
      {erro && <StatusMessage type="error">{erro}</StatusMessage>}

      {isLoading && <StatusMessage type="info">Carregando produtos...</StatusMessage>}

      {!isLoading && tenis.length === 0 && (
        <section className="panel">
          <div className="empty-state">
            Nenhum tênis cadastrado. Cadastre categorias e produtos para testar a venda.
          </div>
        </section>
      )}

      <div className="sneaker-grid">
        {tenis.map((produto) => (
          <SneakerCard
            key={produto.id}
            tenis={produto}
            quantidade={quantidades[produto.id] ?? 1}
            onChangeQuantidade={alterarQuantidade}
            onComprar={comprar}
          />
        ))}
      </div>

      {isAuthenticated && pedidos.length > 0 && (
        <section className="panel orders-panel">
          <div className="panel-header">
            <h2 className="panel-title">Últimos pedidos</h2>
          </div>
          <div className="orders-list">
            {pedidos.slice(0, 4).map((pedido) => (
              <article className="order-item" key={pedido.id}>
                <div>
                  <strong>Pedido #{pedido.id}</strong>
                  <p className="muted">
                    {(pedido.itens ?? []).map((item) => item.tenis.nome).join(", ") || "Sem itens"}
                  </p>
                </div>
                <strong>{formatarMoeda(pedido.total)}</strong>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
