import type { Categoria } from "../services/api";

type CategoryTableProps = {
  categorias: Categoria[];
};

export function CategoryTable({ categorias }: CategoryTableProps) {
  if (categorias.length === 0) {
    return <div className="empty-state">Nenhuma categoria cadastrada ainda.</div>;
  }

  return (
    <div className="category-table-wrap">
      <table className="category-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.id}>
              <td>{categoria.id}</td>
              <td>
                <strong>{categoria.nome}</strong>
              </td>
              <td className="muted">{categoria.descricao || "Sem descrição"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
