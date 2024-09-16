const parser = require('./gramatica');
let variaveis = {};

function avaliarExpressao(expr) {
  if (typeof expr === 'number') {
    return expr;
  } else if (typeof expr === 'string') {
    if (variaveis.hasOwnProperty(expr)) {
      return variaveis[expr];
    } else {
      throw new Error(`Variável não definida: ${expr}`);
    }
  } else if (expr.type === 'expression') {
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

function processarEntrada(entrada) {
  const resultadoAux = parser.parse(entrada.trim());
  const resultado = [];
  resultadoAux.forEach(element => {
    if (Array.isArray(element)) resultado.push(...element.filter(element => element.hasOwnProperty("type") && element.hasOwnProperty("variable") && element.hasOwnProperty("value")))
    else return element
  })
  resultado.forEach(statement => {
    // console.log(statement)
    if (statement.type === 'assignment') {
      variaveis[statement.variable] = avaliarExpressao(statement.value);
    } else {
      console.log(`Resultado: ${avaliarExpressao(statement)}`);
    }
  });
}

const entrada = `
  a := 5.2 + 3
  b := 5 + 3
  c := a + b
`;

processarEntrada(entrada);
console.log(variaveis);  // Deve mostrar que 'c' é 14
