const STORAGE_USUARIOS = "blackblaster_usuarios";
const STORAGE_CARRINHO = "blackblaster_carrinho";
const STORAGE_ALUGADOS = "blackblaster_alugados";

async function cadastrarUsuarios(dados) {
  validarDados(dados);

  const usuarios = obterUsuarios();
  const emailExistente = usuarios.some((usuario) => usuario.email === dados.email);
  const cpfExistente = usuarios.some((usuario) => usuario.cpf === dados.cpf);

  if (emailExistente) {
    throw new Error("Já existe um usuário cadastrado com esse e-mail.");
  }

  if (cpfExistente) {
    throw new Error("Já existe um usuário cadastrado com esse CPF.");
  }

  const novoUsuario = {
    id: Math.random().toString(36).slice(2, 9),
    nome: dados.nome,
    email: dados.email,
    cpf: dados.cpf,
    plano: dados.plano,
  };

  usuarios.push(novoUsuario);
  salvarUsuarios(usuarios);

  await new Promise((res) => setTimeout(res, 800));

  return {
    sucesso: true,
    id: novoUsuario.id,
    mensagem: `Usuário ${dados.nome} cadastrado com sucesso!`,
  };
}

function obterUsuarios() {
  return JSON.parse(localStorage.getItem(STORAGE_USUARIOS) || "[]");
}

function salvarUsuarios(usuarios) {
  localStorage.setItem(STORAGE_USUARIOS, JSON.stringify(usuarios));
}

function autenticarUsuario({ email, cpf }) {
  const usuarios = obterUsuarios();

  if (!usuarios.length) {
    throw new Error("Nenhum usuário cadastrado. Faça o cadastro primeiro.");
  }

  const usuario = usuarios.find(
    (item) => item.email === email && item.cpf === cpf
  );

  if (!usuario) {
    throw new Error("E-mail ou CPF inválido. Verifique seus dados.");
  }

  return usuario;
}

function carregarCarrinhoUsuario(email) {
  const dados = JSON.parse(localStorage.getItem(STORAGE_CARRINHO) || "{}");
  return dados[email] || [];
}

function salvarCarrinhoUsuario(email, carrinho) {
  const dados = JSON.parse(localStorage.getItem(STORAGE_CARRINHO) || "{}");
  dados[email] = carrinho;
  localStorage.setItem(STORAGE_CARRINHO, JSON.stringify(dados));
}

function obterFilmesAlugados(email) {
  const dados = JSON.parse(localStorage.getItem(STORAGE_ALUGADOS) || "{}");
  return dados[email] || [];
}

function salvarFilmesAlugados(email, filmes) {
  const dados = JSON.parse(localStorage.getItem(STORAGE_ALUGADOS) || "{}");
  const existentes = dados[email] || [];
  const todosFilmes = [...existentes, ...filmes];
  const filmesUnicos = Array.from(
    new Map(todosFilmes.map((filme) => [filme.titulo, filme])).values()
  );
  dados[email] = filmesUnicos;
  localStorage.setItem(STORAGE_ALUGADOS, JSON.stringify(dados));
}

function validarCPF(cpf) {
  const numeros = cpf.replace(/\D/g, "");

  if (numeros.length !== 11) return false;
  if (/^(\d)\1+$/.test(numeros)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(numeros[i]) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(numeros[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(numeros[i]) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(numeros[10])) return false;

  return true;
}

function validarDados(dados) {
  const erros = [];

  if (!dados.nome?.trim()) erros.push("Nome é obrigatório");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) erros.push("E-mail inválido");
  if (!validarCPF(dados.cpf)) erros.push("CPF inválido");
  if (dados.idade && (dados.idade < 1 || dados.idade > 120)) erros.push("Idade fora do intervalo válido");
  if (!dados.plano) erros.push("Você deve selecionar um plano");
  if (!dados.aceitaTermos) erros.push("Você deve aceitar os termos de uso");

  if (erros.length > 0) {
    throw new Error(erros.join(",\n"));
  }
}

export {
  cadastrarUsuarios,
  autenticarUsuario,
  carregarCarrinhoUsuario,
  salvarCarrinhoUsuario,
  obterFilmesAlugados,
  salvarFilmesAlugados,
};
