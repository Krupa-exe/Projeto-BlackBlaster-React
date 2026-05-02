import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-hero">

      <h1>Bem-vindo à</h1>
      <img src="/imagens/imagem1.png" alt="Banner" />
      <p>O melhor lugar para alugar filmes online.</p>
      <p>Confira nosso catálogo e monte seu carrinho!</p>

      <Link to="/filmes" className="btn">🎥 Ver Catálogo de Filmes</Link>

      <section className="como-funciona">
        <h2>Como Funciona</h2>
        <p>Simples, rápido e sem complicação.</p>

        <div className="passos-grid">

          <div className="passo">
            <span className="passo-numero">1</span>
            <h3>Crie sua conta</h3>
            <p>Cadastre-se gratuitamente e escolha o plano ideal para você.</p>
          </div>

          <div className="passo">
            <span className="passo-numero">2</span>
            <h3>Escolha um filme</h3>
            <p>Navegue pelo catálogo e adicione seus filmes favoritos ao carrinho.</p>
          </div>

          <div className="passo">
            <span className="passo-numero">3</span>
            <h3>Assista quando quiser</h3>
            <p>Acesse seus filmes a qualquer hora, em qualquer lugar.</p>
          </div>

        </div>
      </section>

      <section className="planos">
        <h2>Escolha seu Plano</h2>
        <p>Assine e aproveite o melhor do cinema.</p>

        <div className="planos-grid">

          <div className="cartao-plano">
            <h3>Básico</h3>
            <p>Acesso a filmes selecionados com qualidade padrão.</p>
            <span className="preco">R$ 9,90/mês</span>
            <Link to="/cadastro" className="btn">Assinar</Link>
          </div>

          <div className="cartao-plano">
            <h3>Padrão</h3>
            <p>Catálogo completo com qualidade Full HD.</p>
            <span className="preco">R$ 19,90/mês</span>
            <Link to="/cadastro" className="btn">Assinar</Link>
          </div>

          <div className="cartao-plano">
            <h3>Premium</h3>
            <p>Tudo do Padrão + lançamentos exclusivos em 4K.</p>
            <span className="preco">R$ 29,90/mês</span>
            <Link to="/cadastro" className="btn">Assinar</Link>
          </div>

        </div>
      </section>

    </div>

  ); 
}