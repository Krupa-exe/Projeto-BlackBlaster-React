async function cadastrarUsuarios(dados) {
    validarDados(dados);

    await new Promise((res => setTimeout(res, 800)));

    return {
        sucesso: true,
        id: Math.random().toString(36).slice(2, 9),
        mensagem: `Usuário ${dados.nome} cadastrado com sucesso!`
    };
}

// Valida o CPF pela fórmula do Módulo 11
  // Essa fórmula verifica se os dois últimos dígitos do CPF são matematicamente corretos
  function validarCPF(cpf) {
    // Remove pontos e traço, deixando só os números
    const numeros = cpf.replace(/\D/g, "");

    // CPF precisa ter exatamente 11 dígitos
    if (numeros.length !== 11) return false;

    // Rejeita CPFs com todos os dígitos iguais (ex: 111.111.111-11)
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

    if (!dados.nome?.trim())
        erros.push("Nome é obrigatório");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email))
        erros.push("E-mail inválido");

    if (!validarCPF(dados.cpf))
        erros.push("CPF inválido")

    if (dados.idade && (dados.idade < 1 || dados.idade > 120))
        erros.push("Idade fora do intervalo válido");

    if (!dados.plano)
        erros.push("Você deve selecionar um plano")

    if (!dados.aceitaTermos)
        erros.push("Você deve aceitar os termos de uso");

    if (erros.length > 0)
        throw new Error(erros.join(",\n"));
}

export {cadastrarUsuarios};