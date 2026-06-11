import { NavLink, Outlet } from "react-router-dom";
import AvatarMenu from "./AvatarMenu";

export default function Layout({ carrinho, usuario, onLogout, onAtualizarUsuario }) {
  return (
    <div>
      <nav>
        <span className="logo">BlackBlaster</span>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/equipe">Equipe</NavLink>
        <NavLink to="/filmes">Filmes</NavLink>
        {usuario?.tipo === "admin" && <NavLink to="/usuarios">Usuarios</NavLink>}
        {usuario && <NavLink to="/meus-alugados">Meus Alugados</NavLink>}

        {/* Cadastro some quando logado */}
        {!usuario && <NavLink to="/cadastro">Cadastro</NavLink>}

        {/* Login some quando logado — substituido pelo AvatarMenu */}
        {usuario ? (
          <AvatarMenu
            usuario={usuario}
            onAtualizarUsuario={onAtualizarUsuario}
            onLogout={onLogout}
          />
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}

        <NavLink to="/carrinho">
          Carrinho
          {carrinho.length > 0 && (
            <span className="nav-carrinho-badge">{carrinho.length}</span>
          )}
        </NavLink>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}