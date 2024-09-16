// Gramática PEG.js para uma calculadora simples com suporte a variáveis

start
  = statement+

statement
  = _ (assignment / expression) _

assignment
  = variableName:variable _ ":=" _ expr:expression {
      return { type: "assignment", variable: variableName, value: expr };
    }

expression
  = head:term tail:(_ ("+" / "-") _ term)* {
      return { type: "expression", value: head, tail: tail };
    }

term
  = head:factor tail:(_ ("*" / "/") _ factor)* {
      return { type: "term", value: head, tail: tail };
    }

factor
  = "(" _ expr:expression _ ")" { return expr; }
  / number
  / variable

number
  = [0-9]+ ("." [0-9]+)? {
      return parseFloat(text());
    }

variable
  = [a-zA-Z_][a-zA-Z0-9_]* {
      return text();  // Retorna diretamente a string capturada
    }

_ "whitespace"
  = [ \t\n\r]*  // Ignora espaços em branco
