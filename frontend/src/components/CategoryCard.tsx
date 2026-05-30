import type { Categoria } from "../services/api";

type CategoryCardProps = {
  categoria: Categoria;
};

export function CategoryCard({ categoria }: CategoryCardProps) {
  return (
    <article className="category-card">
      <h3>{categoria.nome}</h3>
      <p>{categoria.descricao || "Sem descrição cadastrada."}</p>
    </article>
  );
}
