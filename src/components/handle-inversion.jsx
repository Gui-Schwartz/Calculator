export default function HandleInversion(expression) {
  if (!expression) return "";

  const regex = /([-+*/])?(\(?-?\d+(?:,\d*)?%?\)?$)/;
  const match = expression.match(regex);             
  
  if (!match) return expression;                

  let operator = match[1] || "";       
  let number = match[2];               
  let updatedExpression = expression.slice(0, -number.length);         

  updatedExpression = updatedExpression.replace(/([-+*/])\1+$/, "$1"); 

  const isBetweenParens = str => str.startsWith('(') && str.endsWith(')');    

  const isNegativeParens = number.startsWith('(-') && isBetweenParens(number);

  if (operator === "-" && !number.startsWith("-")) {
    updatedExpression = updatedExpression.slice(0, -1) + "+";
    updatedExpression += number;

  } else if (operator === "+" && !number.startsWith("-") && !isNegativeParens) {
    updatedExpression += `(-${number})`;

  } else if (operator === "+" && isNegativeParens) {
    let innerNum = number.slice(2, -1);
    updatedExpression += innerNum;

  } else if (operator === "-" && isNegativeParens) {
    let innerNum = number.slice(2, -1);
    updatedExpression = updatedExpression.slice(0, -1) + "-";
    updatedExpression += innerNum;

  } else {
    if (isNegativeParens) {
      number = number.slice(2, -1);
      updatedExpression += operator + number;
    } else {
      updatedExpression += `(-${number})`;
    }
  }

  return updatedExpression;
}