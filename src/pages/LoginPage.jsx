import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ onLogin }) {
  const [login, setLogin]         = useState("");
  const [senha, setSenha]         = useState("");
  const [erro, setErro]           = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  async function fazerLogin(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const resposta = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, senha }),
      });

      const dados = await resposta.json();

      if (resposta.ok && dados.token) {
        localStorage.setItem("token", dados.token);
        localStorage.setItem("usuario", JSON.stringify(dados.usuario));
        onLogin(dados.usuario);
        navigate("/meus-alugados");
      } else {
        setErro(dados.detail || "Erro no login");
      }
    } catch (err) {
      console.error(err);
      setErro("Erro de conexão com o servidor");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="form-login">
      <h1>🔐 Login</h1>

      {erro && <p style={{ color: "red" }}>{erro}</p>}

      <form onSubmit={fazerLogin}>

        <div className="campo">
          <label htmlFor="login">Login</label>
          <input
            type="text"
            id="login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="seu usuário"
          />
        </div>

        <div className="campo">
          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="sua senha"
          />
        </div>

        <button type="submit" disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </button>

      </form>
    </div>
  );
}