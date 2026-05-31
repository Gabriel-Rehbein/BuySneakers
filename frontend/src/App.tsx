import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { AuthProvider } from "./context/AuthContext";
import { AuthPage } from "./pages/AuthPage";
import { CategoryCreatePage } from "./pages/CategoryCreatePage";
import { CategoryEditPage } from "./pages/CategoryEditPage";
import { CategoryListPage } from "./pages/CategoryListPage";
import "./styles.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/categorias" replace />} />
            <Route path="/categorias" element={<CategoryListPage />} />
            <Route path="/categorias/nova" element={<CategoryCreatePage />} />
            <Route path="/categorias/:id/editar" element={<CategoryEditPage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
