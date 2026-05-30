import { useState } from "react";
import type { FormEvent } from "react";
import { Save } from "lucide-react";

type CategoryFormProps = {
  onSubmit: (dados: { nome: string; descricao: string }) => Promise<void>;
};

export function CategoryForm({ onSubmit }: CategoryFormProps) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({ nome, descricao });
      setNome("");
      setDescricao("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="nome">Nome da categoria</label>
        <input
          id="nome"
          value={nome}
          onChange={(event) => setNome(event.target.value)}
          placeholder="Ex: Corrida"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="descricao">Descrição</label>
        <textarea
          id="descricao"
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
          placeholder="Ex: Modelos leves para treino e competição"
        />
      </div>

      <button className="primary-button" type="submit" disabled={isSubmitting}>
        <Save size={18} aria-hidden="true" />
        {isSubmitting ? "Salvando..." : "Salvar categoria"}
      </button>
    </form>
  );
}
