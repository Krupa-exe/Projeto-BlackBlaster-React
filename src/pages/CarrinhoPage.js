import { useState } from "react";
import ItemCarrinho from "../components/ItemCarrinho";

export default function CarrinhoPage({ carrinho, setCarrinho }) {

  const [pedidoFinalizado, setPedidoFinalizado] = useState(false);

  // Verificar qual é para remover
  function removerFilme(titulo) {
    setCarrinho(carrinho.filter(filme => filme.titulo !== titulo));
  }

  function calcularTotal() {
    // Percorre o array inteiro e transforma
    return carrinho.reduce((total, filme) => {
      const preco = parseFloat(filme.preco.replace(",", "."));
      return total + preco;
    }, 0).toFixed(2).replace(".", ",");
  }

  function finalizarPedido() {
    setPedidoFinalizado(true);
    setCarrinho([]);
  }

  if (pedidoFinalizado) {
    return (
      <div className="mensagem-sucesso">
        <h2>Pedido finalizado com sucesso! ✓ </h2>
        <p>Seus filmes estão prontos para assistir. Boa sessão!</p>
        <button onClick={() => setPedidoFinalizado(false)}>Novo Pedido</button>
      </div>
    );
  }

  if (carrinho.length === 0) {
    return (
      <div className="mensagem-vazia">
        <h1>🛒 Carrinho</h1>
        <p>Seu carrinho está vazio. Adicione filmes no catálogo!</p>
      </div>
    );
  }

  return (
    <div>

      <h1>🛒 Carrinho</h1>

      <div className="carrinho-lista">
        {carrinho.map((filme) => (
          <ItemCarrinho
            key={filme.titulo}
            filme={filme}
            onRemover={removerFilme}
          />
        ))}
      </div>

      <hr />

      <div className="carrinho-total">
        <p>Total: <span>R$ {calcularTotal()}</span></p>
        <button onClick={finalizarPedido}>Finalizar Pedido</button>
      </div>

    </div>
  );
}