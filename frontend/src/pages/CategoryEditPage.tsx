import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CategoryForm } from "../components/CategoryForm";
import { StatusMessage } from "../components/StatusMessage";
import { buscarCategoriaPorId, atualizarCategoria, isUnauthorizedError } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { Categoria } from "../services/api";

export function CategoryEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, isAuthenticated, logout } = useAuth();
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function carregarCategoria() {
      if (!id) {
        setErro("ID da categoria não informado.");
        setIsLoading(false);
        return;
      }

      setErro("");
      setIsLoading(true);

      try {
        const categoriaCarregada = await buscarCategoriaPorId(Number(id));
        setCategoria(categoriaCarregada);
      } catch (error) {
        setErro(error instanceof Error ? error.message : "Erro ao carregar categoria");
      } finally {
        setIsLoading(false);
      }
    }

    carregarCategoria();
  }, [id]);

  async function handleUpdate(dados: { nome: string; descricao: string }) {
    if (!id) {
      setErro("ID da categoria não informado.");
      return;
    }

    try {
      setErro("");
      await atualizarCategoria(token, Number(id), dados);
      navigate("/categorias");
    } catch (error) {
      if (isUnauthorizedError(error)) {
        logout();
      }

      setErro(error instanceof Error ? error.message : "Erro ao atualizar categoria");
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="page">
        <section className="page-header">
          <div>
            <p className="eyebrow">Editar categoria</p>
            <h1>Acesso necessário</h1>
            <p className="page-description">
              Você precisa estar autenticado para editar uma categoria.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">PUT /api/categorias/:id</p>
          <h1>Editar categoria</h1>
          <p className="page-description">
            Atualize os dados da categoria e salve para manter o CRUD completo funcional.
          </p>
        </div>
      </section>

      <section className="panel">
        {erro && <StatusMessage type="error">{erro}</StatusMessage>}
        {isLoading && <StatusMessage type="info">Carregando dados da categoria...</StatusMessage>}
        {!isLoading && categoria && (
          <CategoryForm
            initialValues={{ nome: categoria.nome, descricao: categoria.descricao ?? "" }}
            onSubmit={handleUpdate}
            submitLabel="Atualizar categoria"
            onCancel={() => navigate("/categorias")}
          />
        )}
      </section>
    </main>
  );
}
