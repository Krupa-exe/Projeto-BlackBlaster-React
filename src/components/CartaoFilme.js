import { useState, useEffect } from "react";
import { buscarPosterPorTitulo } from "../services/tmdbServices";

export default function CartaoFilme({ id_filme, titulo, genero, ano, preco, capa, carrinho, setCarrinho }) {
  const [posterTMDB, setPosterTMDB] = useState(null);

  // Se não tiver capa no banco, busca automaticamente pelo TMDB
  useEffect(() => {
    if (!capa) {
      buscarPosterPorTitulo(titulo).then(setPosterTMDB);
    }
  }, [titulo, capa]);

  // Prioridade: capa do banco → poster do TMDB → imagem padrão
  const imagemFinal = capa || posterTMDB || "/sem-capa.jpg";

  function jaNoCarrinho() {
    return carrinho.some((filme) => filme.id_filme === id_filme);
  }

  function alugar() {
    if (!jaNoCarrinho()) {
      setCarrinho([...carrinho, { id_filme, titulo, genero, ano, preco_diaria: preco, poster: imagemFinal }]);
    }
  }

  const precoFormatado = typeof preco === "number"
    ? preco.toFixed(2).replace(".", ",")
    : preco;

  return (
    <div className={`cartao-filme${String(id_filme).startsWith("tmdb-") ? " tmdb" : ""}`}>
      <img src={imagemFinal} alt={titulo} />

      <div className="cartao-filme-info">
        <h3>{titulo}</h3>
        <p>{genero}</p>
        <p>{ano}</p>
        <p className="preco">{preco ? `R$ ${precoFormatado}` : "Não disponível para aluguel"}</p>
      </div>

      {String(id_filme).startsWith("tmdb-")
        ? <button disabled title="Filme não disponível no catálogo">Indisponível</button>
        : jaNoCarrinho()
          ? <button disabled>Já no carrinho</button>
          : <button onClick={alugar}>🛒 Alugar</button>
      }
  </div>
  );
}