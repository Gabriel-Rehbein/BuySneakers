export type Categoria = {
  id: number;
  nome: string;
  descricao?: string | null;
};

type ApiListResponse<T> = {
  quantidade: number;
  dados: T[];
};

type ApiSingleResponse<T> = {
  mensagem?: string;
  dados: T;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(body?.erro ?? "Não foi possível completar a solicitação");
  }

  return body as T;
}

export async function listarCategorias() {
  const response = await request<ApiListResponse<Categoria>>("/categorias");
  return response.dados;
}

export async function criarCategoria(
  token: string,
  dados: { nome: string; descricao?: string }
) {
  const response = await request<ApiSingleResponse<Categoria>>("/categorias", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  });

  return response.dados;
}

export async function registrarUsuario(dados: {
  nome: string;
  email: string;
  senha: string;
}) {
  return request<ApiSingleResponse<{ id: number; nome: string; email: string }>>(
    "/auth/registrar",
    {
      method: "POST",
      body: JSON.stringify(dados),
    }
  );
}

export async function loginUsuario(dados: { email: string; senha: string }) {
  return request<{ mensagem: string; token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}
