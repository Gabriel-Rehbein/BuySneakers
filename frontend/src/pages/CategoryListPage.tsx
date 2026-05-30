import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { CategoryCard } from "../components/CategoryCard";
import { CategoryTable } from "../components/CategoryTable";
import { StatusMessage } from "../components/StatusMessage";
import { listarCategorias } from "../services/api";
import type { Categoria } from "../services/api";

export function CategoryListPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function carregarCategorias() {
    setIsLoading(true);
    setErro("");

    try {
      const dados = await listarCategorias();
      setCategorias(dados);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao listar categorias");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let ativo = true;

    listarCategorias()
      .then((dados) => {
        if (ativo) {
          setCategorias(dados);
        }
      })
      .catch((error) => {
        if (ativo) {
          setErro(error instanceof Error ? error.message : "Erro ao listar categorias");
        }
      })
      .finally(() => {
        if (ativo) {
          setIsLoading(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">GET /api/categorias</p>
          <h1>Categorias cadastradas</h1>
          <p className="page-description">
            Dados buscados da API e apresentados em tabela e cards, cobrindo a parte de listagem do Conceito C.
          </p>
        </div>

        <button className="secondary-button" type="button" onClick={carregarCategorias}>
          <RefreshCw size={18} aria-hidden="true" />
          Atualizar
        </button>
      </section>

      <div className="split-grid">
        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Tabela</h2>
            <span className="muted">{isLoading ? "Carregando..." : `${categorias.length} itens`}</span>
          </div>

          {erro ? <StatusMessage type="error">{erro}</StatusMessage> : <CategoryTable categorias={categorias} />}
        </section>

        <aside>
          <div className="category-grid">
            {categorias.map((categoria) => (
              <CategoryCard key={categoria.id} categoria={categoria} />
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
