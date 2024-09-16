const readline = require('readline')
const parser = require('./gramatica');  // Importa o parser gerado pelo PEG.js
let variaveis = {};  // Armazena os valores das variáveis

// Configura o readline para aceitar entradas do terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Digite uma expressão ou pressione ENTER para processar: '
});

let entradas = [];

rl.prompt();

rl.on('line', (line) => {
  if (line.trim() === '') {
    // Quando uma linha vazia é inserida, processa todas as entradas
    console.log('Processando as entradas...');
    processarEntrada(entradas.join('\n'));
    const variaveisKeys = Object.keys(variaveis);
    if (variaveisKeys.length > 0) {
      variaveisKeys.forEach(key => console.log(`A variável ${key} tem um valor final de: ${variaveis[key]}.`));
    }
    rl.close();  // Fecha o readline após o processamento
  } else {
    // Adiciona a entrada atual ao array de entradas
    entradas.push(line);
    rl.prompt();  // Solicita nova entrada
  }
}).on('close', () => {
  console.log('Fim do programa.');
  process.exit(0);
});

// Avalia uma expressão com base em sua estrutura
function avaliarExpressao(expr) {
  if (typeof expr === 'number') {
    return expr;  // Retorna o número diretamente se for um literal
  } else if (typeof expr === 'string') {
    // Se for uma variável, retorna o valor correspondente do armazenamento
    if (variaveis.hasOwnProperty(expr)) {
      return variaveis[expr];
    } else {
      throw new Error(`Variável não definida: ${expr}`);
    }
  } else if (expr.type === 'expression') {
    // Avalia expressões e termos recursivamente
    let resultado = avaliarExpressao(expr.value);
    expr.tail.forEach(element => {
      const valor = avaliarExpressao(element[3]);
      if (element[1] === '+') resultado += valor;
      else if (element[1] === '-') resultado -= valor;
    });
    return resultado;
  } else if (expr.type === 'term') {
    let resultado = avaliarExpressao(expr.value);
    expr.tail.forEach(element => {
      const valor = avaliarExpressao(element[3]);
      if (element[1] === '*') resultado *= valor;
      else if (element[1] === '/') resultado /= valor;
    });
    return resultado;
  }
}

// Processa a entrada, avalia cada instrução e executa atribuições ou cálculos
function processarEntrada(entrada) {
  const resultadoAux = parser.parse(entrada.trim());
  const resultado = [];
  resultadoAux.forEach(element => {
    if (Array.isArray(element)) resultado.push(
      ...element.filter(element => {
        return element.hasOwnProperty("type") && element.hasOwnProperty("value") && (element.hasOwnProperty("variable") || element.hasOwnProperty("tail"))
      })
    )
      else return element
  })
  resultado.forEach(statement => {
    if (statement.type === 'assignment') {
      // Armazena os resultados das atribuições no objeto de variáveis
      variaveis[statement.variable] = avaliarExpressao(statement.value);
    } else {
      // Calcula e imprime os resultados de expressões livres
      console.log(`O resultado da expressão livre digitada é: ${avaliarExpressao(statement)}.`);
    }
  });
}
