import { Link } from "react-router-dom";
import { CategoryForm } from "../components/CategoryForm";
import { StatusMessage } from "../components/StatusMessage";
import { useAuth } from "../context/AuthContext";
import { criarCategoria, isUnauthorizedError } from "../services/api";
import { useState } from "react";

export function CategoryCreatePage() {
  const { token, isAuthenticated, logout } = useAuth();
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function cadastrarCategoria(dados: { nome: string; descricao: string }) {
    setMensagem("");
    setErro("");

    try {
      const categoria = await criarCategoria(token, dados);
      setMensagem(`Categoria "${categoria.nome}" cadastrada com sucesso.`);
    } catch (error) {
      if (isUnauthorizedError(error)) {
        logout();
      }

      setErro(error instanceof Error ? error.message : "Erro ao cadastrar categoria");
    }
  }

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">POST /api/categorias</p>
          <h1>Cadastrar categoria</h1>
          <p className="page-description">
            Formulário React enviando dados para a API. A rota é protegida, então faça login antes de salvar.
          </p>
        </div>
      </section>

      <section className="panel">
        {!isAuthenticated && (
          <div className="form">
            <StatusMessage type="info">Você precisa entrar para cadastrar uma categoria.</StatusMessage>
            <Link className="primary-button" to="/auth">
              Ir para acesso
            </Link>
          </div>
        )}

        {isAuthenticated && (
          <>
            {mensagem && <StatusMessage type="success">{mensagem}</StatusMessage>}
            {erro && <StatusMessage type="error">{erro}</StatusMessage>}
            <CategoryForm onSubmit={cadastrarCategoria} />
          </>
        )}
      </section>
    </main>
  );
}
