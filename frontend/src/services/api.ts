export type Categoria = {
  id: number;
  nome: string;
  descricao?: string | null;
};

export type Tenis = {
  id: number;
  nome: string;
  marca: string;
  cor: string;
  preco: number | string;
  tamanho: number;
  estoque: number;
  imagemUrl?: string | null;
  categoria: Categoria;
};

export type ItemPedido = {
  id: number;
  quantidade: number;
  precoUnitario: number | string;
  subtotal: number | string;
  tenis: Tenis;
};

export type Pedido = {
  id: number;
  total: number | string;
  dataCriacao: string;
  itens?: ItemPedido[];
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
export const API_BASE_URL = API_URL.replace(/\/api\/?$/, "");

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function isUnauthorizedError(error: unknown) {
  return error instanceof ApiError && error.status === 401;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const headers = new Headers(options.headers);

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new ApiError(
      body?.erro ?? "Não foi possível completar a solicitação",
      response.status
    );
  }

  return body as T;
}

export async function listarCategorias() {
  const response = await request<ApiListResponse<Categoria>>("/categorias");
  return response.dados;
}

export async function buscarCategoriaPorId(id: number) {
  const response = await request<ApiSingleResponse<Categoria>>(`/categorias/${id}`);
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

export async function atualizarCategoria(
  token: string,
  id: number,
  dados: { nome: string; descricao?: string }
) {
  const response = await request<ApiSingleResponse<Categoria>>(`/categorias/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  });

  return response.dados;
}

export async function deletarCategoria(token: string, id: number) {
  await request<void>(`/categorias/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function listarTenis() {
  const response = await request<ApiListResponse<Tenis>>("/tenis");
  return response.dados;
}

export async function criarTenis(token: string, dados: FormData) {
  const response = await request<ApiSingleResponse<Tenis>>("/tenis", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: dados,
  });

  return response.dados;
}

export async function criarPedido(
  token: string,
  itens: Array<{ tenisId: number; quantidade: number }>
) {
  const response = await request<ApiSingleResponse<Pedido>>("/pedidos", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ itens }),
  });

  return response.dados;
}

export async function listarMeusPedidos(token: string) {
  const response = await request<ApiListResponse<Pedido>>("/pedidos/meus", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.dados;
}

export async function atualizarQuantidadeItemPedido(
  token: string,
  pedidoId: number,
  itemId: number,
  quantidade: number
) {
  const response = await request<ApiSingleResponse<Pedido>>(
    `/pedidos/${pedidoId}/itens/${itemId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantidade }),
    }
  );

  return response.dados;
}

export async function deletarPedido(token: string, id: number) {
  await request<void>(`/pedidos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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
