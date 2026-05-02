export default function CartaoFilme({ titulo, genero, ano, preco, capa, carrinho, setCarrinho }) {

  function jaNoCarrinho() {
    return carrinho.some(filme => filme.titulo === titulo);
  }

  function alugar() {
    if (!jaNoCarrinho()) {
      // Spread Operator para manter os filmes alugados
      setCarrinho([...carrinho, { titulo, genero, ano, preco, capa }]);
    }
  }

  return (
    <div className="cartao-filme">

      <img src={capa} alt={titulo} />

      <div className="cartao-filme-info">
        <h3>{titulo}</h3>
        <p> {genero}</p>
        <p> {ano}</p>
        <p className="preco">R$ {preco}</p>
      </div>

      {jaNoCarrinho()
        ? <button disabled>Já no carrinho</button>
        : <button onClick={alugar}>🛒 Alugar</button>
      }

    </div>
  );
}