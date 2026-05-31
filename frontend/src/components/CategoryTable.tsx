import type { Categoria } from "../services/api";

type CategoryTableProps = {
  categorias: Categoria[];
  onEdit?: (categoria: Categoria) => void;
  onDelete?: (categoria: Categoria) => void;
};

export function CategoryTable({ categorias, onEdit, onDelete }: CategoryTableProps) {
  if (categorias.length === 0) {
    return <div className="empty-state">Nenhuma categoria cadastrada ainda.</div>;
  }

  const showActions = Boolean(onEdit || onDelete);

  return (
    <div className="category-table-wrap">
      <table className="category-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
            {showActions && <th>Ações</th>}
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
              {showActions && (
                <td>
                  <div className="table-action-buttons">
                    {onEdit && (
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => onEdit(categoria)}
                      >
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => onDelete(categoria)}
                      >
                        Excluir
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
