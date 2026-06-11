import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Layout           from "./components/Layout";
import Home             from "./pages/Home";
import EquipePage       from "./pages/EquipePage";
import FilmesPage       from "./pages/FilmesPage";
import CarrinhoPage     from "./pages/CarrinhoPage";
import CadastroPage     from "./pages/CadastroPage";
import UsuariosPage     from "./pages/UsuariosPage";
import LoginPage        from "./pages/LoginPage";
import MeusAlugadosPage from "./pages/MeusAlugadosPage";
import PrivateRoute     from "./components/PrivateRoute";

export default function App() {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem("usuario");
    return salvo ? JSON.parse(salvo) : null;
  });
  const [carrinho, setCarrinho] = useState([]);

  function handleLogin(usuario) {
    setUsuario(usuario);
    localStorage.setItem("usuario", JSON.stringify(usuario));
  }

  function handleLogout() {
    setUsuario(null);
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setCarrinho([]);
  }

  // Chamada pelo AvatarMenu após upload bem-sucedido
  function handleAtualizarUsuario(usuarioAtualizado) {
    setUsuario(usuarioAtualizado);
    localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Layout
            carrinho={carrinho}
            usuario={usuario}
            onLogout={handleLogout}
            onAtualizarUsuario={handleAtualizarUsuario}
          />
        }>
          <Route index element={<Home />} />
          <Route path="equipe"   element={<EquipePage />} />
          <Route path="filmes"   element={<FilmesPage carrinho={carrinho} setCarrinho={setCarrinho} />} />
          <Route path="carrinho" element={<CarrinhoPage carrinho={carrinho} setCarrinho={setCarrinho} usuario={usuario} />} />
          <Route path="cadastro" element={<CadastroPage />} />
          <Route path="login"    element={<LoginPage onLogin={handleLogin} />} />

          <Route path="meus-alugados" element={
            <PrivateRoute>
              <MeusAlugadosPage usuario={usuario} />
            </PrivateRoute>
          } />

          <Route path="usuarios" element={
            <PrivateRoute admin>
              <UsuariosPage usuario={usuario} />
            </PrivateRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}