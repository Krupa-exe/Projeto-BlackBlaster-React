export default function ItemCarrinho({ filme, onRemover }) {
  return (
    <div className="item-carrinho">
      
      <img src={filme.capa} alt={filme.titulo} />

      <div className="item-carrinho-info">
        <p className="titulo">{filme.titulo}</p>
        <p className="preco">R$ {filme.preco}</p>
      </div>

      <button onClick={() => onRemover(filme.titulo)}>Remover</button>
      
    </div>
  );
}