import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Layout         from "./components/Layout";
import Home           from "./pages/Home";
import EquipePage     from "./pages/EquipePage";
import FilmesPage     from "./pages/FilmesPage";
import CarrinhoPage   from "./pages/CarrinhoPage";
import CadastroPage   from "./pages/CadastroPage";

export default function App() {
  // Estado global do carrinho: lista de filmes alugados
  const [carrinho, setCarrinho] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout carrinho={carrinho} />}>
          <Route index                element={<Home />} />
          <Route path="equipe"        element={<EquipePage /> } />
          <Route path="filmes"        element={<FilmesPage carrinho={carrinho} setCarrinho={setCarrinho} />} />
          <Route path="carrinho"      element={<CarrinhoPage carrinho={carrinho} setCarrinho={setCarrinho} />} />
          <Route path="cadastro"      element={<CadastroPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}