// Define a regra inicial que captura uma ou mais instruções
start
  = statement+

// Uma instrução pode ser uma atribuição ou uma expressão livre
statement
  = _ (assignment / expression) _

// Atribuição de valores a variáveis
assignment
  = variableName:variable _ ":=" _ expr:expression {
      // Retorna um objeto representando uma atribuição
      return { type: "assignment", variable: variableName, value: expr };
    }

// Expressão que pode envolver adição ou subtração
expression
  = head:term tail:(_ ("+" / "-") _ term)* {
      // Retorna um objeto expressão com a cabeça e a cauda da expressão
      return { type: "expression", value: head, tail: tail };
    }

// Termo que pode envolver multiplicação ou divisão
term
  = head:factor tail:(_ ("*" / "/") _ factor)* {
      // Retorna um objeto termo com a cabeça e a cauda do termo
      return { type: "term", value: head, tail: tail };
    }

// Fator que pode ser um número, uma variável ou uma expressão entre parênteses
factor
  = "(" _ expr:expression _ ")" { return expr; }  // Expressão entre parênteses
  / number  // Um número literal
  / variable  // Uma variável

// Define como números são capturados e convertidos para float
number
  = [0-9]+ ("." [0-9]+)? {
      return parseFloat(text());  // Converte a string capturada para número
    }

// Define como variáveis são capturadas
variable
  = [a-zA-Z_][a-zA-Z0-9_]* {
      return text();  // Retorna a string capturada como nome da variável
    }

// Ignora espaços em branco em qualquer lugar onde esta regra é aplicada
_ "whitespace"
  = [ \t\n\r]*  // Captura espaços, tabulações e novas linhas
