import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryCard } from "../components/CategoryCard";
import { CategoryTable } from "../components/CategoryTable";
import { StatusMessage } from "../components/StatusMessage";
import { deletarCategoria, listarCategorias } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { Categoria } from "../services/api";

export function CategoryListPage() {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
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

  async function handleDeleteCategoria(categoria: Categoria) {
    if (!window.confirm(`Deseja excluir a categoria “${categoria.nome}”?`)) {
      return;
    }

    setIsLoading(true);
    setErro("");

    try {
      await deletarCategoria(token, categoria.id);
      await carregarCategorias();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao excluir categoria");
      setIsLoading(false);
    }
  }

  useEffect(() => {
    carregarCategorias();
  }, []);

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">GET /api/categorias</p>
          <h1>Categorias cadastradas</h1>
          <p className="page-description">
            Dados buscados da API e apresentados em tabela e cards. A lista agora suporta edição e exclusão de categorias.
          </p>
        </div>

        <button className="secondary-button" type="button" onClick={carregarCategorias}>
          <RefreshCw size={18} aria-hidden="true" />
          Atualizar
        </button>
      </section>

      {erro && <StatusMessage type="error">{erro}</StatusMessage>}

      <div className="split-grid">
        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Tabela</h2>
            <span className="muted">{isLoading ? "Carregando..." : `${categorias.length} itens`}</span>
          </div>

          <CategoryTable
            categorias={categorias}
            onEdit={(categoria) => navigate(`/categorias/${categoria.id}/editar`)}
            onDelete={isAuthenticated ? handleDeleteCategoria : undefined}
          />
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
