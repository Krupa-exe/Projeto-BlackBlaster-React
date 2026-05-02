import { useState } from "react";
import { cadastrarUsuarios } from "../services/cadastroServices";

export default function CadastroPage() {

  const [formData, setFormData] = useState({
    nome:   "",
    email:  "",
    cpf:    "",
    plano:  "",
    aceitaTermos: false,
  });

  const [enviado, setEnviado]       = useState(false);
  const [erro, setErro]             = useState("");
  const [carregando, setCarregando] = useState(false);

  // Essa função formata o CPF enquanto o usuário digita
  // Ex: o usuário digita "12345678901" e vira "123.456.789-01"
  function mascaraCPF(valor) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 3) return numeros;
    if (numeros.length <= 6) return `${numeros.slice(0,3)}.${numeros.slice(3)}`;
    if (numeros.length <= 9) return `${numeros.slice(0,3)}.${numeros.slice(3,6)}.${numeros.slice(6)}`;
    return `${numeros.slice(0,3)}.${numeros.slice(3,6)}.${numeros.slice(6,9)}-${numeros.slice(9)}`;
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    let newValue = value;

    if (name === "cpf") {
      newValue = mascaraCPF(value);
    }

    if (type === "checkbox") {
      newValue = checked;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
        await cadastrarUsuarios(formData);
        setEnviado(true);
    } catch(err) {
        setErro(err.message);
    // em relação ao "finally", independentemente do resultado das etapas anteriores, ele sempre será executado
    } finally {
        setCarregando(false);
    }
  }

  function handleReset() {
    setFormData({ 
      nome: "", 
      email: "", 
      cpf: "", 
      plano: "", 
      aceitaTermos: false 
    });
    setEnviado(false);
    setErro("");

  }

  if (enviado) {
    return (
      <div className="mensagem-sucesso">
        <h2>Cadastro realizado com sucesso!</h2>
        <p>Olá, {formData.nome}! Seja bem-vindo(a) ao BlackBlaster!</p>
        <p>Seu e-mail <strong>{formData.email}</strong> foi registrado no plano <strong>{formData.plano}</strong>.</p>
        <button onClick={handleReset}>Novo Cadastro</button>
      </div>
    );
  }

  return (
    <div className="form-cadastro">

      <h1>📝 Criar Conta</h1>

      {erro && <p style={{ color: "red", whiteSpace: "pre-wrap" }}>{erro}</p>}

      <form onSubmit={handleSubmit}>

        <div className="campo">
          <label htmlFor="nome">Nome completo</label>
          <input 
            type="text" 
            id="nome" 
            name="nome" 
            value={formData.nome}
            onChange={handleChange} 
            placeholder="Seu nome completo"
            />
        </div>

        <div className="campo">
          <label htmlFor="email">E-mail</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange} 
            placeholder="seu@email.com"
            />
        </div>

        <div className="campo">
          <label htmlFor="cpf">CPF</label>
          <input 
            type="text" 
            id="cpf" 
            name="cpf" 
            value={formData.cpf}
            onChange={handleChange} 
            placeholder="000.000.000-00"
            />
        </div>

        <div className="campo">
          <label htmlFor="plano">Plano</label>
          <select 
            id="plano" 
            name="plano" 
            value={formData.plano} 
            onChange={handleChange} >
              <option value="">Selecione um plano...</option>
              <option value="Básico">Básico — R$ 9,90/mês</option>
              <option value="Padrão">Padrão — R$ 19,90/mês</option>
              <option value="Premium">Premium — R$ 29,90/mês</option>
          </select>
        </div>

        <div className="campo campo-checkbox">
          <input 
            type="checkbox" 
            id="aceitaTermos" 
            name="aceitaTermos"
            checked={formData.aceitaTermos} 
            onChange={handleChange}
            />
          <label htmlFor="aceitaTermos">Aceito os termos de uso</label>
        </div>

        <button type="submit" disabled={carregando}>
                {carregando ? "Salvando..." : "Criar conta"}
        </button>

      </form>

    </div>
  );
}