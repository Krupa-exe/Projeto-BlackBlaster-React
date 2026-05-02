import { useState } from "react";
import CartaoFilme from "../components/CartaoFilme";

const catalogo = [
  // Drama
  {
    titulo: "O Poderoso Chefão",
    genero: "Drama",
    ano: 1972,
    preco: "9,90",
    capa: "https://www.themoviedb.org/t/p/w1280/oJagOzBu9Rdd9BrciseCm3U3MCU.jpg",
  },
  {
    titulo: "Coringa",
    genero: "Drama",
    ano: 2019,
    preco: "10,90",
    capa: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
  },
  {
    titulo: "Forrest Gump",
    genero: "Drama",
    ano: 1994,
    preco: "9,90",
    capa: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
  },

  // Ficção Científica
  {
    titulo: "Interestelar",
    genero: "Ficção Científica",
    ano: 2014,
    preco: "12,90",
    capa: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  },
  {
    titulo: "Matrix",
    genero: "Ficção Científica",
    ano: 1999,
    preco: "11,90",
    capa: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
  },

  // Suspense
  {
    titulo: "Parasita",
    genero: "Suspense",
    ano: 2019,
    preco: "11,90",
    capa: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
  },
  {
    titulo: "Corra!",
    genero: "Suspense",
    ano: 2017,
    preco: "10,90",
    capa: "https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg",
  },
  {
    titulo: "O Silêncio dos Inocentes",
    genero: "Suspense",
    ano: 1991,
    preco: "10,90",
    capa: "https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg",
  },

  // Animação
  {
    titulo: "Toy Story",
    genero: "Animação",
    ano: 1995,
    preco: "7,90",
    capa: "https://www.themoviedb.org/t/p/w1280/6AafgfifXkFS4g2xGJZIwsPQK6P.jpg",
  },
  {
    titulo: "Espirited Away",
    genero: "Animação",
    ano: 2001,
    preco: "8,90",
    capa: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
  },

  // Fantasia
  {
    titulo: "O Senhor dos Anéis",
    genero: "Fantasia",
    ano: 2001,
    preco: "13,90",
    capa: "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
  },
  {
    titulo: "Harry Potter e a Pedra Filosofal",
    genero: "Fantasia",
    ano: 2001,
    preco: "11,90",
    capa: "https://image.tmdb.org/t/p/w500/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg",
  },

  // Ação
  {
    titulo: "Mad Max: Estrada da Fúria",
    genero: "Ação",
    ano: 2015,
    preco: "10,90",
    capa: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
  },
  {
    titulo: "John Wick",
    genero: "Ação",
    ano: 2014,
    preco: "9,90",
    capa: "https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
  },
  {
    titulo: "Oppenheimer",
    genero: "Ação",
    ano: 2023,
    preco: "14,90",
    capa: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
  },
];

export default function FilmesPage({ carrinho, setCarrinho }) {

  const [filtro, setFiltro] = useState("Todos");

  const filmesFiltrados = (filtro === "Todos"
    ? catalogo
    : catalogo.filter(filme => filme.genero === filtro)
  ).sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR"));

  return (
    <div>

      <div className="filmes-header">
        <h1>🎥 Catálogo de Filmes</h1>
        <div className="filtro-genero">
          <label>Filtrar por gênero:</label>
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="Ação">Ação</option>
            <option value="Drama">Drama</option>
            <option value="Ficção Científica">Ficção Científica</option>
            <option value="Suspense">Suspense</option>
            <option value="Animação">Animação</option>
            <option value="Fantasia">Fantasia</option>
          </select>
        </div>
      </div>

      <p className="contagem-filmes">{filmesFiltrados.length} filme(s) encontrado(s)</p>

      <div className="grade-filmes">
        {filmesFiltrados.map((filme) => (
          <CartaoFilme
            key=          {filme.titulo}
            titulo=       {filme.titulo}
            genero=       {filme.genero}
            ano=          {filme.ano}
            preco=        {filme.preco}
            capa=         {filme.capa}
            carrinho=     {carrinho}
            setCarrinho=  {setCarrinho}
          />
        ))}
      </div>

    </div>
  );
}