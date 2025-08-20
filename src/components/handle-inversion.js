import expressionOrganizer from "./organize-expression";

const handleInversion = ({ expression, setExpression }) => {
  const parts = expressionOrganizer(expression);
  let last = parts[parts.length - 1];

  if (last.startsWith("(-") && last.endsWith(")")) { //se está entre parênteses e com sinal de menos remove
    last = last.slice(2, -1);
  }
  else {  //Se não tiver parênteses coloca entre parênteses e adiciona o sinal de menos
    last = `(-${last})`;
  }

  // substitui o último index da expressão
  parts[parts.length - 1] = last;

  const newExpression = parts.join("");
  return setExpression(newExpression);
};

export default handleInversion;