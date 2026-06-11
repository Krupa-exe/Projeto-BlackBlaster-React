import { Navigate } from "react-router-dom";

// Uso básico (qualquer usuário logado):
//   <PrivateRoute><MeusAlugadosPage /></PrivateRoute>
//
// Uso restrito a admin:
//   <PrivateRoute admin><UsuariosPage /></PrivateRoute>

function PrivateRoute({ children, admin = false }) {
  const token   = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

  if (!token || !usuario) {
    return <Navigate to="/login" replace />;
  }

  if (admin && usuario.tipo !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;