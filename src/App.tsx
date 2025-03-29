import { JSX } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { LoginForm } from "./components/LoginForm";
import DashboardLayout from "./components/dashboard-layout";
import { useAuthStore } from "./store/AuthStore";
import UsuariosPage from "@/pages/UsuariosPage";
import ProductosPage from "@/pages/ProductosPage";
import CrearProductoPage from "./pages/CrearProductoPage";
import RolesPage from "@/pages/RolesPage";
import DocumentosPage from "@/pages/DocumentosPage";
import { SidebarProvider } from "@/components/ui/sidebar";
import CaracteristicasPage from "@/pages/CaracteristicasPage";
import ValoresPage from "@/pages/ValoresPage";
import { Toaster } from "@/components/ui/sonner"

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" />;
}

function App() {
  
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-6xl">
              <LoginForm />
              
            </div>
          </div>
          
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <SidebarProvider>
              <DashboardLayout>
                <Outlet />
                <Toaster />
              </DashboardLayout>
            </SidebarProvider>
          </ProtectedRoute>
        }
      >
        <Route index element={<p>Bienvenido al Dashboard</p>} />
        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="documentos" element={<DocumentosPage />} /> 
        <Route path="productos" element={<ProductosPage />} />
        <Route path="productos/crear" element={<CrearProductoPage />} />
        <Route path="caracteristicas" element={<CaracteristicasPage />} />
        <Route path="valores" element={<ValoresPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
    
  );
}

export default App;
