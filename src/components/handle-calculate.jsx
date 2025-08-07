import * as math from 'mathjs';

const sanitizeExpression = (expr) => {
  return expr
    .replace(/\+\+/g, '+')           
    .replace(/--/g, '+')             
    .replace(/\+\-/g, '-')           
    .replace(/(?<![-+*/])(\d)\(/g, '$1*(')
    .replace(/\)(\d)/g, ')*$1')      
    .replace(/\)\(/g, ')*(');        
};

const processCustomOperators = (expression) => {
  const tokens = expression.match(/(-?\d+(?:\.\d+)?%?)|[+\-*/()]/g);
  if (!tokens) return expression;

  let resultExpr = '';
  let percentBase = null;
  let lastOperator = null;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.endsWith('%')) {
  const percent = parseFloat(token.replace('%', '')) / 100;
  const base = percentBase !== null ? percentBase : 0;
  const applied = base * percent;

  if (lastOperator === '-') {
    resultExpr += ` - ${applied}`;
  } else if (lastOperator === '+') {
    resultExpr += ` + ${applied}`;
  } else if (lastOperator === '*') {
    resultExpr += ` * ${percent}`;
  } else if (lastOperator === '/') {
    resultExpr += ` / ${percent}`;
  } else {
    resultExpr += `${applied}`;
  }

  lastOperator = null;
}
 else if (!isNaN(token)) {
      const num = parseFloat(token);
      resultExpr += num;
      percentBase = num;
    } else {
      const nextToken = tokens[i + 1];
      const isNextPercent = nextToken && nextToken.endsWith('%');

      if (!(isNextPercent && ['/', '*'].includes(token))) {
        resultExpr += token;
      }

      if (['+', '-', '*', '/'].includes(token)) {
        lastOperator = token;
      } else {
        lastOperator = null;
      }
    }
  }

  resultExpr = resultExpr.replace(/\+\+/g, '+');
  resultExpr = resultExpr.replace(/--/g, '+');
  resultExpr = resultExpr.replace(/\+\-/g, '-');
  resultExpr = resultExpr.replace(/\*\*/g, '*');
  resultExpr = resultExpr.replace(/\/\*/g, '/');

  return resultExpr;
};


export const HandleCalculate = ({ 
  variables, 
  lastOperationStateRef,
  historyRef 
}) => {
  const { expression, setExpression } = variables;

  let expressionToCalculate = expression.replace(/x/g, '*').replace(/,/g, '.');

  expressionToCalculate = processCustomOperators(expressionToCalculate);

  if (expressionToCalculate === '+/-') {
    setExpression('0');
    return;
  }

  expressionToCalculate = sanitizeExpression(expressionToCalculate);
  
  if (/[+\-*/]$/.test(expressionToCalculate)) {
    setExpression("Error");
    return;
  }

  try {
    const result = math.evaluate(expressionToCalculate);
    if (historyRef) {
      const cleanExpression = expression.replace(/\s+/g, '');
      historyRef.current = [...historyRef.current, `${cleanExpression} = ${result}`];
    }
    lastOperationStateRef.current.lastResult = result;
    lastOperationStateRef.current._justEvaluated = true;

    const cleanExpression = expression.replace(/\s+/g, '');
    const parts = cleanExpression.match(/(.+)([+\-*/])(-?\d+(?:[.,]\d+)?|\d+)$/);
    
    if (parts) {
      lastOperationStateRef.current.lastOperator = parts[2];
      lastOperationStateRef.current.lastOperand = parts[3].replace(',', '.');
    }

    setExpression(result.toString().replace('.', ','));
  } catch (e) {
    console.error("Erro ao calcular:", e.message);
    setExpression("Error");
  }
};
export default HandleCalculate;