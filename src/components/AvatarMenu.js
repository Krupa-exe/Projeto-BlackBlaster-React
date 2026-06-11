import { useState, useRef, useEffect } from "react";
import { useAvatar } from "../hooks/useAvatar";

export default function AvatarMenu({ usuario, onAtualizarUsuario, onLogout }) {
  const [aberto, setAberto]       = useState(false);
  const [arrastando, setArrastando] = useState(false);
  const menuRef                   = useRef(null);
  const inputRef                  = useRef(null);

  const { enviarAvatar, carregando, erro } = useAvatar(usuario, onAtualizarUsuario);

  // Fecha o menu ao clicar fora dele
  useEffect(() => {
    function handleClickFora(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  // ── Drag and Drop ──────────────────────────────────────────────────────────

  function handleDragOver(e) {
    e.preventDefault();
    setArrastando(true);
  }

  function handleDragLeave() {
    setArrastando(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setArrastando(false);
    const arquivo = e.dataTransfer.files[0];
    if (arquivo) enviarAvatar(arquivo);
  }

  function handleInputChange(e) {
    const arquivo = e.target.files[0];
    if (arquivo) enviarAvatar(arquivo);
  }

  // ── Iniciais do nome (fallback quando não há avatar) ──────────────────────

  const iniciais = usuario?.nome
    ? usuario.nome.split(" ").slice(0, 2).map((p) => p[0].toUpperCase()).join("")
    : "?";

  return (
    <div className="avatar-wrapper" ref={menuRef}>

      {/* Bolinha clicável */}
      <button
        className="avatar-btn"
        onClick={() => setAberto((prev) => !prev)}
        title={usuario?.nome}
      >
        {usuario?.avatar ? (
          <img src={usuario.avatar} alt="Avatar" className="avatar-img" />
        ) : (
          <span className="avatar-iniciais">{iniciais}</span>
        )}
      </button>

      {/* Menu dropdown */}
      {aberto && (
        <div className="avatar-menu">
          <p className="avatar-nome">{usuario?.nome}</p>
          <p className="avatar-login">@{usuario?.login}</p>

          <hr style={{ borderColor: "var(--preto-borda)", margin: "0.75rem 0" }} />

          {/* Área de drag and drop */}
          <div
            className={`avatar-drop-area ${arrastando ? "arrastando" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            {carregando ? (
              <p>Enviando...</p>
            ) : (
              <>
                <p>Arraste uma foto</p>
                <p>ou clique para selecionar</p>
                <span className="avatar-drop-hint">JPG, PNG, WEBP — max 5MB</span>
              </>
            )}
          </div>

          {/* Input file oculto — acionado pelo clique na área acima */}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            style={{ display: "none" }}
            onChange={handleInputChange}
          />

          {erro && <p className="avatar-erro">{erro}</p>}

          <hr style={{ borderColor: "var(--preto-borda)", margin: "0.75rem 0" }} />

          <button className="btn-logout" onClick={onLogout} style={{ width: "100%" }}>
            Sair
          </button>
        </div>
      )}
    </div>
  );
}