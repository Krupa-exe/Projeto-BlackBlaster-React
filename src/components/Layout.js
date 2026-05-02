import { Link, Outlet } from "react-router-dom";

export default function Layout({ carrinho }) {
  return (
    <div>

      <nav>
        <span className="logo">BlackBlaster</span>
        <Link to="/">Home</Link>
        <Link to="/equipe">Equipe</Link>
        <Link to="/filmes">Filmes</Link>
        <Link to="/cadastro">Cadastro</Link>
        <Link to="/carrinho">
          🛒 Carrinho
          {carrinho.length > 0 && (
            <span className="nav-carrinho-badge">{carrinho.length}</span>
          )}
        </Link>
      </nav>

      <main>
        <Outlet />
      </main>

    </div>
  );
}