import { useState } from "react";
import type { FormEvent } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { StatusMessage } from "../components/StatusMessage";
import { useAuth } from "../context/AuthContext";
import { loginUsuario, registrarUsuario } from "../services/api";

export function AuthPage() {
  const { isAuthenticated, saveToken } = useAuth();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMensagem("");
    setErro("");

    try {
      const resposta = await loginUsuario({ email: loginEmail, senha: loginSenha });
      saveToken(resposta.token);
      setMensagem("Login realizado. O cadastro de categorias está liberado.");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao fazer login");
    }
  }

  async function handleRegistro(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMensagem("");
    setErro("");

    try {
      await registrarUsuario({ nome, email, senha });
      setMensagem("Usuário cadastrado. Agora entre com o e-mail e senha.");
      setLoginEmail(email);
      setLoginSenha(senha);
      setNome("");
      setEmail("");
      setSenha("");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao cadastrar usuário");
    }
  }

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">JWT</p>
          <h1>Acesso ao painel</h1>
          <p className="page-description">
            O backend protege o cadastro de categorias com token. Esta tela registra usuário e faz login pela própria API.
          </p>
        </div>
      </section>

      {isAuthenticated && <StatusMessage type="success">Você está autenticado.</StatusMessage>}
      {mensagem && <StatusMessage type="success">{mensagem}</StatusMessage>}
      {erro && <StatusMessage type="error">{erro}</StatusMessage>}

      <div className="auth-grid">
        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Entrar</h2>
          </div>
          <form className="form" onSubmit={handleLogin}>
            <div className="field">
              <label htmlFor="login-email">E-mail</label>
              <input
                id="login-email"
                type="email"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="login-senha">Senha</label>
              <input
                id="login-senha"
                type="password"
                value={loginSenha}
                onChange={(event) => setLoginSenha(event.target.value)}
                minLength={6}
                required
              />
            </div>
            <button className="primary-button" type="submit">
              <LogIn size={18} aria-hidden="true" />
              Entrar
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Criar usuário</h2>
          </div>
          <form className="form" onSubmit={handleRegistro}>
            <div className="field">
              <label htmlFor="nome">Nome</label>
              <input id="nome" value={nome} onChange={(event) => setNome(event.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                minLength={6}
                required
              />
            </div>
            <button className="secondary-button" type="submit">
              <UserPlus size={18} aria-hidden="true" />
              Cadastrar
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
