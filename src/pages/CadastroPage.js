import { useState } from "react";
import { Link } from "react-router-dom";

function validarCPF(cpf) {
  const n = cpf.replace(/\D/g, "");
  if (n.length !== 11 || /^(\d)\1+$/.test(n)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(n[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(n[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(n[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(n[10]);
}

function validarDados(dados) {
  const erros = {};

  if (!dados.nome.trim() || dados.nome.trim().length < 3)
    erros.nome = "Nome deve ter pelo menos 3 caracteres";
  else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(dados.nome.trim()))
    erros.nome = "Nome deve conter apenas letras";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email))
    erros.email = "E-mail inválido";

  if (!validarCPF(dados.cpf))
    erros.cpf = "CPF inválido";

  if (dados.telefone && dados.telefone.replace(/\D/g, "").length < 10)
    erros.telefone = "Telefone inválido";

  if (dados.data_nascimento) {
  const nascimento = new Date(dados.data_nascimento);
  const hoje       = new Date();
  const idade      = hoje.getFullYear() - nascimento.getFullYear();
  
  if (nascimento >= hoje)
    erros.data_nascimento = "Data de nascimento invalida";
  else if (idade < 16)
    erros.data_nascimento = "Voce deve ter pelo menos 16 anos";
  else if (idade > 120) // <--- Nova validação de idade máxima
    erros.data_nascimento = "Data de nascimento incorreta (idade máxima excedida)";
  }

  if (!dados.login.trim() || dados.login.trim().length < 3)
    erros.login = "Login deve ter pelo menos 3 caracteres";
  else if (/\s/.test(dados.login))
    erros.login = "Login nao pode conter espacos";
  else if (!/^[a-zA-Z0-9._]+$/.test(dados.login))
    erros.login = "Login so pode ter letras, numeros, ponto e underscore";

  // Nova validação de senha forte
  if (!dados.senha || dados.senha.length < 8) {
    erros.senha = "Senha deve ter pelo menos 8 caracteres";
  } else if (!/[A-Z]/.test(dados.senha)) {
    erros.senha = "Senha deve conter pelo menos uma letra maiúscula";
  } else if (!/[a-z]/.test(dados.senha)) {
    erros.senha = "Senha deve conter pelo menos uma letra minúscula";
  } else if (!/[0-9]/.test(dados.senha)) {
    erros.senha = "Senha deve conter pelo menos um número";
  } else if (!/[!@#$%^&*(),.?":{}|<>_]/.test(dados.senha)) {
    erros.senha = "Senha deve conter pelo menos um caractere especial (ex: @, #, $, _)";
  }

  if (!dados.plano)
    erros.plano = "Selecione um plano";

  if (!dados.aceitaTermos)
    erros.aceitaTermos = "Voce deve aceitar os termos de uso";

  return erros;
}

export default function CadastroPage() {

  const [formData, setFormData] = useState({
    nome:            "",
    email:           "",
    cpf:             "",
    login:           "",
    senha:           "",
    telefone:        "",
    data_nascimento: "",
    plano:           "",
    aceitaTermos:    false,
  });

  const [erros, setErros]               = useState({});
  const [enviado, setEnviado]           = useState(false);
  const [erroServidor, setErroServidor] = useState("");
  const [carregando, setCarregando]     = useState(false);

  function mascaraCPF(valor) {
    const n = valor.replace(/\D/g, "").slice(0, 11);
    if (n.length <= 3) return n;
    if (n.length <= 6) return n.slice(0,3) + "." + n.slice(3);
    if (n.length <= 9) return n.slice(0,3) + "." + n.slice(3,6) + "." + n.slice(6);
    return n.slice(0,3) + "." + n.slice(3,6) + "." + n.slice(6,9) + "-" + n.slice(9);
  }

  function mascaraTelefone(valor) {
    const n = valor.replace(/\D/g, "").slice(0, 11);
    if (n.length <= 2)  return "(" + n;
    if (n.length <= 7)  return "(" + n.slice(0,2) + ") " + n.slice(2);
    if (n.length <= 10) return "(" + n.slice(0,2) + ") " + n.slice(2,6) + "-" + n.slice(6);
    return "(" + n.slice(0,2) + ") " + n.slice(2,7) + "-" + n.slice(7);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    let newValue = value;
    if (name === "cpf")      newValue = mascaraCPF(value);
    if (name === "telefone") newValue = mascaraTelefone(value);
    if (type === "checkbox") newValue = checked;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    if (erros[name]) {
      setErros((prev) => ({ ...prev, [name]: "" }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErroServidor("");

    const errosEncontrados = validarDados(formData);
    if (Object.keys(errosEncontrados).length > 0) {
      setErros(errosEncontrados);
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch("http://localhost:3001/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome:            formData.nome,
          email:           formData.email,
          cpf:             formData.cpf,
          login:           formData.login,
          senha:           formData.senha,
          plano:           formData.plano,
          telefone:        formData.telefone || null,
          data_nascimento: formData.data_nascimento || null,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErroServidor(dados.detail || "Erro ao cadastrar");
        return;
      }

      setEnviado(true);
    } catch (err) {
      setErroServidor("Erro de conexao com o servidor");
    } finally {
      setCarregando(false);
    }
  }

  function handleReset() {
    setFormData({
      nome: "", email: "", cpf: "", login: "", senha: "",
      telefone: "", data_nascimento: "", plano: "", aceitaTermos: false,
    });
    setErros({});
    setEnviado(false);
    setErroServidor("");
  }

  if (enviado) {
    return (
      <div className="mensagem-sucesso">
        <h2>Cadastro realizado com sucesso!</h2>
        <p>Ola, {formData.nome}! Seja bem-vindo(a) ao BlackBlaster!</p>
        <p>Use o login <strong>{formData.login}</strong> para entrar.</p>
        <div className="botoes-sucesso">
          <button onClick={handleReset}>Novo Cadastro</button>
          <Link to="/login" className="btn">Ir para Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="form-cadastro">
      <h1>Criar Conta</h1>

      {erroServidor && (
        <p style={{ color: "red", marginBottom: "1rem" }}>{erroServidor}</p>
      )}

      <form onSubmit={handleSubmit}>

        <div className="campo">
          <label htmlFor="nome">Nome completo</label>
          <input type="text" id="nome" name="nome"
            value={formData.nome} onChange={handleChange}
            placeholder="Seu nome completo" />
          {erros.nome && <span className="campo-erro">{erros.nome}</span>}
        </div>

        <div className="campo">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" name="email"
            value={formData.email} onChange={handleChange}
            placeholder="seu@email.com" />
          {erros.email && <span className="campo-erro">{erros.email}</span>}
        </div>

        <div className="campo">
          <label htmlFor="cpf">CPF</label>
          <input type="text" id="cpf" name="cpf"
            value={formData.cpf} onChange={handleChange}
            placeholder="000.000.000-00" />
          {erros.cpf && <span className="campo-erro">{erros.cpf}</span>}
        </div>

        <div className="campo">
          <label htmlFor="telefone">Telefone</label>
          <input type="text" id="telefone" name="telefone"
            value={formData.telefone} onChange={handleChange}
            placeholder="(00) 00000-0000" />
          {erros.telefone && <span className="campo-erro">{erros.telefone}</span>}
        </div>

        <div className="campo">
          <label htmlFor="data_nascimento">Data de nascimento</label>
          <input type="date" id="data_nascimento" name="data_nascimento"
            value={formData.data_nascimento} onChange={handleChange} />
          {erros.data_nascimento && <span className="campo-erro">{erros.data_nascimento}</span>}
        </div>

        <div className="campo">
          <label htmlFor="login">Login</label>
          <input type="text" id="login" name="login"
            value={formData.login} onChange={handleChange}
            placeholder="nome de usuario unico" />
          {erros.login && <span className="campo-erro">{erros.login}</span>}
        </div>

        <div className="campo">
          <label htmlFor="senha">Senha</label>
          <input type="password" id="senha" name="senha"
            value={formData.senha} onChange={handleChange}
            placeholder="Mínimo 8 caracteres, maiúsculas, minúsculas, números e símbolos" />
          {erros.senha && <span className="campo-erro">{erros.senha}</span>}
        </div>

        <div className="campo">
          <label htmlFor="plano">Plano</label>
          <select id="plano" name="plano" value={formData.plano} onChange={handleChange}>
            <option value="">Selecione um plano...</option>
            <option value="Basico">Basico - R$ 9,90/mes</option>
            <option value="Padrao">Padrao - R$ 19,90/mes</option>
            <option value="Premium">Premium - R$ 29,90/mes</option>
          </select>
          {erros.plano && <span className="campo-erro">{erros.plano}</span>}
        </div>

        <div className="campo campo-checkbox">
          <input type="checkbox" id="aceitaTermos" name="aceitaTermos"
            checked={formData.aceitaTermos} onChange={handleChange} />
          <label htmlFor="aceitaTermos">Aceito os termos de uso</label>
        </div>
        {erros.aceitaTermos && (
          <span className="campo-erro" style={{ marginTop: "-1rem", display: "block" }}>
            {erros.aceitaTermos}
          </span>
        )}

        <button type="submit" disabled={carregando}>
          {carregando ? "Salvando..." : "Criar conta"}
        </button>

      </form>
    </div>
  );
}