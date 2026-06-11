import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MeusAlugadosPage({ usuario }) {
  const [filmes, setFilmes]         = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro]             = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
      return;
    }

    async function carregarAlugados() {
      setErro("");
      setCarregando(true);

      try {
        const token = localStorage.getItem("token");
        const resposta = await fetch("http://localhost:3001/alugados", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!resposta.ok) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const dados = await resposta.json();
        setFilmes(dados.filmes || []);
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar filmes alugados.");
      } finally {
        setCarregando(false);
      }
    }

    carregarAlugados();
  }, [usuario, navigate]);

  if (!usuario) return null;

  if (carregando) return <h1>Carregando seus filmes alugados...</h1>;

  return (
    <div>
      <h1>Meus Filmes Alugados</h1>
      <p>Bem-vindo, {usuario.nome}. Aqui estão os filmes que você já alugou.</p>

      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {filmes.length === 0 ? (
        <p>Você ainda não alugou nenhum filme. Visite o catálogo e escolha um!</p>
      ) : (
        <div className="grade-filmes">
          {filmes.map((filme) => (
            <div key={filme.id_locacao} className="cartao-filme">
              <img src={filme.poster} alt={filme.titulo} />
              <div className="cartao-filme-info">
                <h3>{filme.titulo}</h3>
                <p>{filme.nome_genero}</p>
                <p>{filme.ano_lancamento}</p>
                <p className="preco">R$ {String(filme.preco_diaria).replace(".", ",")}</p>
                <p style={{ color: "var(--cinza)", fontSize: "0.75rem", marginTop: "0.3rem" }}>
                  Devolução: {new Date(filme.data_devolucao).toLocaleDateString("pt-BR")}
                </p>
                <p style={{
                  fontSize: "0.75rem",
                  color: filme.status === "ativo" ? "var(--vermelho)" : "var(--cinza)"
                }}>
                  {filme.status === "ativo" ? "● Ativo" : "○ Devolvido"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}