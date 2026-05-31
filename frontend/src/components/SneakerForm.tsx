import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ImageUp, Save } from "lucide-react";
import type { Categoria } from "../services/api";

type SneakerFormProps = {
  categorias: Categoria[];
  onSubmit: (dados: FormData) => Promise<void>;
};

type Errors = {
  nome?: string;
  marca?: string;
  cor?: string;
  preco?: string;
  tamanho?: string;
  estoque?: string;
  categoriaId?: string;
};

export function SneakerForm({ categorias, onSubmit }: SneakerFormProps) {
  const [nome, setNome] = useState("");
  const [marca, setMarca] = useState("");
  const [cor, setCor] = useState("");
  const [preco, setPreco] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [estoque, setEstoque] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [imagem, setImagem] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDisabled = useMemo(
    () =>
      isSubmitting ||
      !nome.trim() ||
      !marca.trim() ||
      !cor.trim() ||
      !preco ||
      !tamanho ||
      !estoque ||
      !categoriaId,
    [categoriaId, cor, estoque, isSubmitting, marca, nome, preco, tamanho]
  );

  function validate() {
    const nextErrors: Errors = {};

    if (!nome.trim()) nextErrors.nome = "Informe o nome.";
    if (!marca.trim()) nextErrors.marca = "Informe a marca.";
    if (!cor.trim()) nextErrors.cor = "Informe a cor.";
    if (Number(preco) <= 0) nextErrors.preco = "Informe um preço maior que zero.";
    if (!Number.isInteger(Number(tamanho)) || Number(tamanho) <= 0) {
      nextErrors.tamanho = "Informe um tamanho válido.";
    }
    if (!Number.isInteger(Number(estoque)) || Number(estoque) < 0) {
      nextErrors.estoque = "Informe um estoque válido.";
    }
    if (!categoriaId) nextErrors.categoriaId = "Escolha uma categoria.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) return;

    const formData = new FormData();
    formData.append("nome", nome.trim());
    formData.append("marca", marca.trim());
    formData.append("cor", cor.trim());
    formData.append("preco", preco);
    formData.append("tamanho", tamanho);
    formData.append("estoque", estoque);
    formData.append("categoriaId", categoriaId);

    if (imagem) {
      formData.append("imagem", imagem);
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      setNome("");
      setMarca("");
      setCor("");
      setPreco("");
      setTamanho("");
      setEstoque("");
      setCategoriaId("");
      setImagem(null);
      setErrors({});
      event.currentTarget.reset();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="form two-column-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="tenis-nome">Nome</label>
        <input id="tenis-nome" value={nome} onChange={(event) => setNome(event.target.value)} />
        {errors.nome && <span className="field-error">{errors.nome}</span>}
      </div>

      <div className="field">
        <label htmlFor="tenis-marca">Marca</label>
        <input id="tenis-marca" value={marca} onChange={(event) => setMarca(event.target.value)} />
        {errors.marca && <span className="field-error">{errors.marca}</span>}
      </div>

      <div className="field">
        <label htmlFor="tenis-cor">Cor</label>
        <input id="tenis-cor" value={cor} onChange={(event) => setCor(event.target.value)} />
        {errors.cor && <span className="field-error">{errors.cor}</span>}
      </div>

      <div className="field">
        <label htmlFor="tenis-categoria">Categoria</label>
        <select
          id="tenis-categoria"
          value={categoriaId}
          onChange={(event) => setCategoriaId(event.target.value)}
        >
          <option value="">Selecione</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nome}
            </option>
          ))}
        </select>
        {errors.categoriaId && <span className="field-error">{errors.categoriaId}</span>}
      </div>

      <div className="field">
        <label htmlFor="tenis-preco">Preço</label>
        <input
          id="tenis-preco"
          type="number"
          min="0.01"
          step="0.01"
          value={preco}
          onChange={(event) => setPreco(event.target.value)}
        />
        {errors.preco && <span className="field-error">{errors.preco}</span>}
      </div>

      <div className="field">
        <label htmlFor="tenis-tamanho">Tamanho</label>
        <input
          id="tenis-tamanho"
          type="number"
          min="1"
          value={tamanho}
          onChange={(event) => setTamanho(event.target.value)}
        />
        {errors.tamanho && <span className="field-error">{errors.tamanho}</span>}
      </div>

      <div className="field">
        <label htmlFor="tenis-estoque">Estoque</label>
        <input
          id="tenis-estoque"
          type="number"
          min="0"
          value={estoque}
          onChange={(event) => setEstoque(event.target.value)}
        />
        {errors.estoque && <span className="field-error">{errors.estoque}</span>}
      </div>

      <div className="field">
        <label htmlFor="tenis-imagem">Imagem</label>
        <label className="file-input" htmlFor="tenis-imagem">
          <ImageUp size={18} aria-hidden="true" />
          {imagem ? imagem.name : "Selecionar imagem"}
        </label>
        <input
          id="tenis-imagem"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => setImagem(event.target.files?.[0] ?? null)}
        />
      </div>

      <div className="form-actions form-actions-full">
        <button className="primary-button" type="submit" disabled={isDisabled}>
          <Save size={18} aria-hidden="true" />
          {isSubmitting ? "Salvando..." : "Salvar tênis"}
        </button>
      </div>
    </form>
  );
}
