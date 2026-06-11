import { useState, useEffect } from "react";
import CartaoFilme from "../components/CartaoFilme";

const API_KEY = "94bb8ba437d9fafc1516cc92e73b1ca4"; // mesma chave do tmdbServices.js

export default function FilmesPage({ carrinho, setCarrinho }) {
  const [filmes, setFilmes]             = useState([]);
  const [generos, setGeneros]           = useState([]);
  const [filtro, setFiltro]             = useState("Todos");
  const [carregando, setCarregando]     = useState(true);
  const [erro, setErro]                 = useState("");

  // Estados da busca TMDB
  const [busca, setBusca]               = useState("");
  const [resultadosTMDB, setResultados] = useState([]);
  const [buscando, setBuscando]         = useState(false);
  const [modoTMDB, setModoTMDB]         = useState(false);

  // Carrega filmes do banco normalmente
  useEffect(() => {
    async function carregarDados() {
      try {
        const [resFilmes, resGeneros] = await Promise.all([
          fetch("http://localhost:3001/filmes"),
          fetch("http://localhost:3001/generos"),
        ]);

        const dadosFilmes  = await resFilmes.json();
        const dadosGeneros = await resGeneros.json();

        setFilmes(dadosFilmes.filmes   || []);
        setGeneros(dadosGeneros.generos || []);
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar catálogo. Verifique se o servidor está rodando.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  // Busca no TMDB ao submeter o formulário
  async function handleBusca(e) {
  e.preventDefault();
  if (!busca.trim()) {
    setModoTMDB(false);
    setResultados([]);
    return;
  }

  setBuscando(true);
  setModoTMDB(true);

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(busca)}`
    );
    const data = await res.json();

    const filmesMapeados = (data.results || []).map((f) => {
      // Procura se o título existe no banco (ignora maiúsculas/minúsculas)
      const filmeNoBanco = filmes.find(
        (fb) => fb.titulo.toLowerCase() === f.title.toLowerCase()
      );

      // Se encontrou no banco, usa os dados reais
      if (filmeNoBanco) {
        return {
          id_filme:       filmeNoBanco.id_filme,
          titulo:         filmeNoBanco.titulo,
          nome_genero:    filmeNoBanco.nome_genero,
          ano_lancamento: filmeNoBanco.ano_lancamento,
          preco_diaria:   filmeNoBanco.preco_diaria,
          poster:         filmeNoBanco.poster || `https://image.tmdb.org/t/p/w500${f.poster_path}`,
        };
      }

      // Se não encontrou, retorna como indisponível (comportamento atual)
      return {
        id_filme:       `tmdb-${f.id}`,
        titulo:         f.title,
        nome_genero:    "—",
        ano_lancamento: f.release_date?.split("-")[0] || "—",
        preco_diaria:   null,
        poster:         f.poster_path
                          ? `https://image.tmdb.org/t/p/w500${f.poster_path}`
                          : null,
      };
    });

    setResultados(filmesMapeados);
  } catch {
    setErro("Erro ao buscar no TMDB.");
  } finally {
    setBuscando(false);
  }
}

  // Limpa a busca e volta ao catálogo
  function limparBusca() {
    setBusca("");
    setModoTMDB(false);
    setResultados([]);
  }

  const filmesFiltrados = (
    filtro === "Todos"
      ? filmes
      : filmes.filter((f) => f.nome_genero === filtro)
  ).sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR"));

  if (carregando) return <h1>Carregando catálogo...</h1>;

  return (
    <div>
      <div className="filmes-header">
        <h1>🎥 Catálogo de Filmes</h1>

        {/* Barra de pesquisa TMDB */}
        <form onSubmit={handleBusca} className="barra-busca">
          <input
            type="text"
            placeholder="🔍 Pesquisar filme..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <button type="submit">Buscar</button>
          {modoTMDB && (
            <button type="button" onClick={limparBusca}>
              ✕ Voltar ao catálogo
            </button>
          )}
        </form>

        {/* Filtro de gênero — só aparece no modo catálogo */}
        {!modoTMDB && (
          <div className="filtro-genero">
            <label>Filtrar por gênero:</label>
            <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
              <option value="Todos">Todos</option>
              {generos.map((g) => (
                <option key={g.id_genero} value={g.nome_genero}>
                  {g.nome_genero}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {/* Modo TMDB */}
      {modoTMDB ? (
        <>
          {buscando ? (
            <h2>Buscando "{busca}"...</h2>
          ) : (
            <>
              <p className="contagem-filmes">
                {resultadosTMDB.length} resultado(s) encontrado(s) para "{busca}"
              </p>
              <div className="grade-filmes">
                {resultadosTMDB.map((filme) => (
                  <CartaoFilme
                    key={filme.id_filme}
                    id_filme={filme.id_filme}
                    titulo={filme.titulo}
                    genero={filme.nome_genero}
                    ano={filme.ano_lancamento}
                    preco={filme.preco_diaria}
                    capa={filme.poster}
                    carrinho={carrinho}
                    setCarrinho={setCarrinho}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        // Modo catálogo normal
        <>
          <p className="contagem-filmes">{filmesFiltrados.length} filme(s) encontrado(s)</p>
          <div className="grade-filmes">
            {filmesFiltrados.map((filme) => (
              <CartaoFilme
                key={filme.id_filme}
                id_filme={filme.id_filme}
                titulo={filme.titulo}
                genero={filme.nome_genero}
                ano={filme.ano_lancamento}
                preco={filme.preco_diaria}
                capa={filme.poster}
                carrinho={carrinho}
                setCarrinho={setCarrinho}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}