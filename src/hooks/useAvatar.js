import { useState } from "react";

// Hook customizado responsável por toda a lógica de avatar
// Separar em hook mantém o componente limpo e a lógica reutilizável
export function useAvatar(usuario, onAtualizarUsuario) {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro]             = useState("");

  async function enviarAvatar(arquivo) {
    if (!arquivo) return;

    // Validação no front antes de enviar (o backend também valida)
    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!tiposPermitidos.includes(arquivo.type)) {
      setErro("Apenas imagens sao permitidas (jpeg, png, webp, gif)");
      return;
    }
    if (arquivo.size > 5 * 1024 * 1024) {
      setErro("Imagem muito grande. Maximo 5MB.");
      return;
    }

    setErro("");
    setCarregando(true);

    try {
      // FormData é necessário para enviar arquivos via fetch
      const formData = new FormData();
      formData.append("avatar", arquivo);

      const token = localStorage.getItem("token");
      const resposta = await fetch("http://localhost:3001/avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        // Não definir Content-Type — o browser define automaticamente com o boundary do FormData
        body: formData,
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.detail || "Erro ao enviar avatar");
        return;
      }

      // Atualiza o usuario no App.js e no localStorage com o novo avatar
      const usuarioAtualizado = { ...usuario, avatar: dados.avatar };
      localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
      onAtualizarUsuario(usuarioAtualizado);
    } catch (err) {
      console.error(err);
      setErro("Erro de conexao com o servidor");
    } finally {
      setCarregando(false);
    }
  }

  return { enviarAvatar, carregando, erro };
}