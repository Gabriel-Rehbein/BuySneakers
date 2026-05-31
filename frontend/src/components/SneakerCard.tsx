import { Minus, Plus, ShoppingCart } from "lucide-react";
import { API_BASE_URL } from "../services/api";
import type { Tenis } from "../services/api";

type SneakerCardProps = {
  tenis: Tenis;
  quantidade: number;
  onChangeQuantidade: (tenisId: number, quantidade: number) => void;
  onComprar: (tenis: Tenis) => void;
};

const fallbackImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 420'%3E%3Crect width='640' height='420' fill='%23eef2f7'/%3E%3Cpath d='M126 275c52 16 146 15 218 6 59-7 93-37 132-70 11-10 27-7 35 6l29 45c8 13 3 31-12 36-87 30-293 41-410 20-21-4-33-25-25-44 5-11 20-10 33 1Z' fill='%23246b5f'/%3E%3Cpath d='M208 219c39 19 83 22 130 17 33-4 61-19 86-44l31 31c-35 31-72 51-119 57-59 8-111 1-158-22l30-39Z' fill='%2318212f'/%3E%3C/svg%3E";

function getImageUrl(imagemUrl?: string | null) {
  if (!imagemUrl) return fallbackImage;
  if (imagemUrl.startsWith("http")) return imagemUrl;
  return `${API_BASE_URL}${imagemUrl}`;
}

function formatarMoeda(valor: number | string) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function SneakerCard({
  tenis,
  quantidade,
  onChangeQuantidade,
  onComprar,
}: SneakerCardProps) {
  const indisponivel = tenis.estoque <= 0;

  return (
    <article className="sneaker-card">
      <img
        className="sneaker-image"
        src={getImageUrl(tenis.imagemUrl)}
        alt={tenis.nome}
        onError={(event) => {
          event.currentTarget.src = fallbackImage;
        }}
      />
      <div className="sneaker-body">
        <div>
          <p className="eyebrow">{tenis.categoria?.nome ?? "Sem categoria"}</p>
          <h3>{tenis.nome}</h3>
          <p className="muted">
            {tenis.marca} | {tenis.cor} | Tam. {tenis.tamanho}
          </p>
        </div>

        <div className="sneaker-footer">
          <div>
            <strong className="price">{formatarMoeda(tenis.preco)}</strong>
            <span className={indisponivel ? "stock danger" : "stock"}>
              {indisponivel ? "Sem estoque" : `${tenis.estoque} em estoque`}
            </span>
          </div>

          <div className="quantity-control" aria-label={`Quantidade de ${tenis.nome}`}>
            <button
              className="icon-button"
              type="button"
              title="Diminuir"
              onClick={() => onChangeQuantidade(tenis.id, quantidade - 1)}
              disabled={quantidade <= 1}
            >
              <Minus size={16} aria-hidden="true" />
            </button>
            <span>{quantidade}</span>
            <button
              className="icon-button"
              type="button"
              title="Aumentar"
              onClick={() => onChangeQuantidade(tenis.id, quantidade + 1)}
              disabled={quantidade >= tenis.estoque}
            >
              <Plus size={16} aria-hidden="true" />
            </button>
          </div>

          <button
            className="primary-button"
            type="button"
            onClick={() => onComprar(tenis)}
            disabled={indisponivel}
          >
            <ShoppingCart size={18} aria-hidden="true" />
            Comprar
          </button>
        </div>
      </div>
    </article>
  );
}
