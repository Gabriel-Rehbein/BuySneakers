import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SneakerForm } from "../components/SneakerForm";
import { StatusMessage } from "../components/StatusMessage";
import { useAuth } from "../context/AuthContext";
import { criarTenis, listarCategorias } from "../services/api";
import type { Categoria } from "../services/api";

export function SneakerCreatePage() {
  const { token, isAuthenticated } = useAuth();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    listarCategorias()
      .then(setCategorias)
      .catch((error) =>
        setErro(error instanceof Error ? error.message : "Erro ao carregar categorias")
      );
  }, []);

  async function handleSubmit(dados: FormData) {
    setMensagem("");
    setErro("");

    try {
      const tenis = await criarTenis(token, dados);
      setMensagem(`Tênis "${tenis.nome}" cadastrado com sucesso.`);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao cadastrar tênis");
    }
  }

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">POST /api/tenis + upload</p>
          <h1>Cadastrar tênis</h1>
          <p className="page-description">
            Cadastro de produto ligado a uma categoria, com validações e imagem enviada por multipart/form-data.
          </p>
        </div>
      </section>

      <section className="panel">
        {!isAuthenticated && (
          <div className="form">
            <StatusMessage type="info">Entre com token para cadastrar produtos.</StatusMessage>
            <Link className="primary-button" to="/auth">
              Ir para acesso
            </Link>
          </div>
        )}

        {isAuthenticated && (
          <>
            {mensagem && <StatusMessage type="success">{mensagem}</StatusMessage>}
            {erro && <StatusMessage type="error">{erro}</StatusMessage>}
            <SneakerForm categorias={categorias} onSubmit={handleSubmit} />
          </>
        )}
      </section>
    </main>
  );
}
