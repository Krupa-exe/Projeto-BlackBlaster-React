import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UsuariosPage({ usuario }) {
  const [usuarios, setUsuarios]     = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro]             = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona se não for admin
    if (!usuario || usuario.tipo !== "admin") {
      navigate("/");
      return;
    }

    async function buscarUsuarios() {
      try {
        const token = localStorage.getItem("token");
        const resposta = await fetch("http://localhost:3001/usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!resposta.ok) {
          setErro("Sem permissão ou sessão expirada.");
          return;
        }

        const dados = await resposta.json();
        setUsuarios(dados.usuarios || []);
      } catch (err) {
        console.error(err);
        setErro("Erro ao buscar usuários.");
      } finally {
        setCarregando(false);
      }
    }

    buscarUsuarios();
  }, [usuario, navigate]);

  if (carregando) return <h1>Carregando...</h1>;

  return (
    <div>
      <h1>Usuários Cadastrados</h1>

      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {usuarios.length === 0 ? (
        <p style={{ color: "var(--cinza)", marginTop: "1rem" }}>
          Nenhum usuário cadastrado ainda.
        </p>
      ) : (
        usuarios.map((u) => (
          <div key={u.id_usuario} className="usuario-card">
            <h3>{u.nome}</h3>
            <p>{u.email}</p>
            <p style={{ color: "var(--cinza)", fontSize: "0.8rem" }}>
              {u.login} · {u.plano} · {u.tipo}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default UsuariosPage;