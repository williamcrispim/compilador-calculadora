const parser = require('./gramatica');  // Importa o parser gerado pelo PEG.js
let variaveis = {};  // Armazena os valores das variáveis

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
    if (Array.isArray(element)) resultado.push(...element.filter(element => element.hasOwnProperty("type") && element.hasOwnProperty("variable") && element.hasOwnProperty("value")))
    else return element
  })
  resultado.forEach(statement => {
    if (statement.type === 'assignment') {
      // Armazena os resultados das atribuições no objeto de variáveis
      variaveis[statement.variable] = avaliarExpressao(statement.value);
    } else {
      // Calcula e imprime os resultados de expressões livres
      console.log(`Resultado: ${avaliarExpressao(statement)}`);
    }
  });
}

// Exemplo de uso da função de processamento
const entrada = `
  a := 5.2 + 3
  b := 5 + 3
  c := a + b
`;

processarEntrada(entrada);
console.log(variaveis);  // Exibe os valores finais das variáveis
