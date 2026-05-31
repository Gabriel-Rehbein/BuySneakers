import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Save, X } from "lucide-react";

type CategoryFormProps = {
  onSubmit: (dados: { nome: string; descricao: string }) => Promise<void>;
  initialValues?: { nome?: string; descricao?: string };
  submitLabel?: string;
  onCancel?: () => void;
};

export function CategoryForm({
  onSubmit,
  initialValues,
  submitLabel = "Salvar categoria",
  onCancel,
}: CategoryFormProps) {
  const [nome, setNome] = useState(initialValues?.nome ?? "");
  const [descricao, setDescricao] = useState(initialValues?.descricao ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ nome: "" });

  const isSubmitDisabled = useMemo(
    () => isSubmitting || !nome.trim(),
    [isSubmitting, nome]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!nome.trim()) {
      setErrors({ nome: "O nome da categoria é obrigatório." });
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({ nome: nome.trim(), descricao: descricao.trim() });
      setNome("");
      setDescricao("");
      setErrors({ nome: "" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="nome">Nome da categoria</label>
        <input
          id="nome"
          value={nome}
          onChange={(event) => {
            setNome(event.target.value);
            if (errors.nome) {
              setErrors({ nome: "" });
            }
          }}
          placeholder="Ex: Corrida"
          required
        />
        {errors.nome && <span className="field-error">{errors.nome}</span>}
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

      <div className="form-actions">
        {onCancel && (
          <button className="secondary-button" type="button" onClick={onCancel}>
            <X size={18} aria-hidden="true" />
            Cancelar
          </button>
        )}
        <button className="primary-button" type="submit" disabled={isSubmitDisabled}>
          <Save size={18} aria-hidden="true" />
          {isSubmitting ? "Salvando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
