export default function ItemCarrinho({ filme, onRemover }) {

  const precoFormatado = typeof filme.preco_diaria === "number"
    ? filme.preco_diaria.toFixed(2).replace(".", ",")
    : filme.preco_diaria;

  return (
    <div className="item-carrinho">

      <img
        src={filme.poster}
        alt={filme.titulo}
        onError={(e) => { e.target.style.display = "none"; }}
      />

      <div className="item-carrinho-info">
        <p className="titulo">{filme.titulo}</p>
        <p className="preco">R$ {precoFormatado}</p>
      </div>

      <button onClick={() => onRemover(filme.titulo)}>Remover</button>

    </div>
  );
}