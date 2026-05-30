import { LogOut, Plus, ShieldCheck, ShoppingBag, Tags } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function AppLayout() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/categorias" className="brand" title="BuySneakers">
          <span className="brand-mark">
            <ShoppingBag size={20} aria-hidden="true" />
          </span>
          <span>
            <p className="brand-title">BuySneakers</p>
            <p className="brand-subtitle">Painel de categorias</p>
          </span>
        </NavLink>

        <nav className="nav-links" aria-label="Navegação principal">
          <NavLink to="/categorias" className="nav-link">
            <Tags size={18} aria-hidden="true" />
            Categorias
          </NavLink>
          <NavLink to="/categorias/nova" className="nav-link">
            <Plus size={18} aria-hidden="true" />
            Cadastrar
          </NavLink>
          <NavLink to="/auth" className="nav-link">
            <ShieldCheck size={18} aria-hidden="true" />
            Acesso
          </NavLink>
          {isAuthenticated && (
            <button className="icon-button" type="button" onClick={logout} title="Sair">
              <LogOut size={18} aria-hidden="true" />
            </button>
          )}
        </nav>
      </header>

      <Outlet />
    </div>
  );
}
