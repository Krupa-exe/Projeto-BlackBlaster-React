import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ItemCarrinho from "../components/ItemCarrinho";

export default function CarrinhoPage({ carrinho, setCarrinho, usuario }) {

  const [pedidoFinalizado, setPedidoFinalizado] = useState(false);
  const [erro, setErro]                         = useState("");
  const [carregando, setCarregando]             = useState(false);
  const navigate = useNavigate();

  function removerFilme(titulo) {
    setCarrinho(carrinho.filter((filme) => filme.titulo !== titulo));
  }

  function calcularTotal() {
    return carrinho
      .reduce((total, filme) => {
        const preco = parseFloat(String(filme.preco_diaria).replace(",", "."));
        return total + (isNaN(preco) ? 0 : preco);
      }, 0)
      .toFixed(2)
      .replace(".", ",");
  }

  async function finalizarPedido() {
    setErro("");

    if (!usuario) {
      const resultado = await Swal.fire({
        title: "Acesso necessário",
        text: "Você precisa estar logado ou criar uma conta!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Fazer Login",
        cancelButtonText: "Criar Conta",
        confirmButtonColor: "#e63946",
        cancelButtonColor: "#555",
      });

      if (resultado.isConfirmed) {
        navigate("/login");
      } else if (resultado.dismiss === Swal.DismissReason.cancel) {
        navigate("/cadastro");
      }

      return;
    }

  // Bloqueia filmes do TMDB (sem preço e sem ID real no banco)
  const filmesForaDoBanco = carrinho.filter((f) =>
    String(f.id_filme).startsWith("tmdb-")
  );
  if (filmesForaDoBanco.length > 0) {
    setErro(
      `Estes filmes não estão disponíveis para aluguel: ${filmesForaDoBanco.map((f) => f.titulo).join(", ")}`
    );
    return;
  }

  setCarregando(true);
  try {
    const token = localStorage.getItem("token");
    const resposta = await fetch("http://localhost:3001/alugados", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        filmes: carrinho.map((filme) => ({ id_filme: filme.id_filme })),
      }),
    });

    const dados = await resposta.json();
    if (!resposta.ok) {
      setErro(dados.detail || "Erro ao finalizar pedido");
      return;
    }

    setPedidoFinalizado(true);
    setCarrinho([]);
  } catch (err) {
    console.error(err);
    setErro("Erro de conexão com o servidor");
  } finally {
    setCarregando(false);
  }
}

  if (pedidoFinalizado) {
    return (
      <div className="mensagem-sucesso">
        <h2>Pedido finalizado com sucesso! ✓</h2>
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

      {erro && <p style={{ color: "red", marginBottom: "1rem" }}>{erro}</p>}

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
        <button onClick={finalizarPedido} disabled={carregando}>
          {carregando ? "Finalizando..." : "Finalizar Pedido"}
        </button>
      </div>
    </div>
  );
}