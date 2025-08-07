import { useState, useEffect, useRef } from "react";
import Buttons from "./Buttons";
import HandleCalculate from "./handle-calculate";
import ShowDisplay from "./show-display";
import SystemButton from "./system-options";
import { History } from "lucide-react";
import HandleInversion from './handle-inversion';

import "./Display.css";
import "./Buttons.css";

function canInsertOperator(expression, newOperator) { //Verifica se pode adicionar operador 
  const normalize = (op) => op === 'x' ? '*' : op; 

  const lastChar = normalize(expression.slice(-1));
  const newOp = normalize(newOperator);
  
  const isLastOperator = ['+', '-', '*', '/'].includes(lastChar); 
  const isNewOperator = ['+', '-', '*', '/'].includes(newOp);

  if (isLastOperator && isNewOperator) { //Bloqueia em caso de operador duplo
    return false;
  }
  return true;
}

export function formatDisplay(expression) { //Formada o display 
  if (!expression || expression === "") {
    return "0";
  }

  const parts = expression.split(/([+\-*x/%])/);
  const formattedParts = parts.map((part) => {
    if (/[+\-*x/%]/.test(part)) return part;

    let [intPart, decimalPart] = part.replace(",", ".").split(".");

    if (!/^-?\d*(\.\d*)?$/.test(part.replace(",", "."))) {
      return part;
    }

    if (intPart.length > 1 && intPart.startsWith("0") && intPart !== "0") {
      intPart = intPart.replace(/^0+/, "");
      if (intPart === "") {
        intPart = "0";
      }
    }

    if (intPart === "-0") {
      intPart = "0";
    }

    if (part.startsWith("-") && intPart === "0" && decimalPart !== undefined) {
      intPart = "-0";
    }

    if (                         //Adiciona o ponto de milhar
      !isNaN(intPart) &&
      intPart !== "" &&
      intPart !== "-" &&
      intPart !== "-0"
    ) {
      intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return decimalPart !== undefined ? `${intPart},${decimalPart}` : intPart;
  });

  const finalResult = formattedParts.join("");
  return finalResult === "" ? "0" : finalResult;
}

export const handleButtonClick = ({ //Manipula os cliques dos botões
  value,
  type,
  expression,
  setExpression,
  lastOperation,
  setShowSystem,
  historyRef
}) => {
  const operators = ["+", "-", "x", "/"];
  const lastChar = expression.slice(-1);
  const currentLastOpState = lastOperation.current;

  if (type === "number" || value === ",") {
  const lastNumberMatch = expression.match(/([+\-x/*])?([^+\-x/*]*)$/);
  const lastNumber = lastNumberMatch ? lastNumberMatch[2] : "";

  if (value === "," && lastNumber.includes(",")) {
    return; 
  }

  const justEvaluated = currentLastOpState._justEvaluated;
  currentLastOpState._justEvaluated = false;

  const shouldInsertLeadingZero = value === "," && (
    expression === "" ||
    expression === "0" ||
    /[+\-*/(]$/.test(expression)
  );

  if (shouldInsertLeadingZero) {
    setExpression(prev => prev + "0,");
  } else if (justEvaluated && !/[+\-*/]/.test(value)) {
    setExpression(value === "," ? "0," : value);
  } else if (expression === "0" && value !== ",") {
    setExpression(value);
  } else {
    setExpression(expression + value);
  }
}
 else if (type === "operator") {
  const normalizedValue = value === 'x' ? '*' : value;

  if (!canInsertOperator(expression, normalizedValue)) return;

  setExpression(expression + normalizedValue);
  currentLastOpState._justEvaluated = false;

  } else if (type === "control") {
    if (value === "=") {
    const {
      lastResult,
      _justEvaluated,
      lastOperator,
      lastOperand,
    } = lastOperation.current;

    let expressionToEvaluate = expression;

    if (_justEvaluated && lastOperator && lastOperand) {
      expressionToEvaluate = `${lastResult}${lastOperator}${lastOperand}`;
    }

    HandleCalculate({
      variables: { expression: expressionToEvaluate, setExpression },
      lastOperationStateRef: lastOperation,
      historyRef
    });
    } else if (value === "+/-") {
      const newExpression = HandleInversion(expression);
      setExpression(newExpression);

    } else if (value === "%") {
      if (!operators.includes(lastChar) && lastChar !== "%") {
        setExpression(expression + "%");
      }
    }
  } else if (type === "system") {
    if (value === "AC") {
      setExpression("0");
      currentLastOpState.lastResult = null;
      currentLastOpState._justEvaluated = false;

    }else if(value === "option") {
      window.alert("Oops! This part is still in progress.")
       setShowSystem((prev) => !prev); 
        return;
    }
  }
};

const HandleOperations = () => { //Controla a calculadora
  const [expression, setExpression] = useState("0");
  const lastOperation = useRef({
  lastResult: null,
  _justEvaluated: false,
  lastOperator: null,
  lastOperand: null,
});
  const systemButtonRef = useRef(null);
  const [showSystem, setShowSystem] = useState(false);
  const holdTimer = useRef(null);
  const history = useRef([]);
  const [showFullHistory, setShowFullHistory] = useState(false);
  
  const handleKeyDown = (event) => {       //Manipula cliques do teclado
  const key = event.key;

  if ((/[\d]/.test(key)) || key === ",") {
    handleClick(key, "number");
  } else if (["+", "-", "*", "/"].includes(key)) {
    handleClick(key, "operator");
  } else if (key === "x") {
  handleClick("x", "operator");
  }else if (key === "Enter" || key === "=") {
    handleClick("=", "control");
  } else if (key === "%") {
    handleClick("%", "control");
  } else if (key === "Backspace") {
    if (expression.length > 1) {
      setExpression(expression.slice(0, -1));
    } else {
      setExpression("0");
    }
  }
};
  
  useEffect(() => {                                //Manipula o clique do mouse
    const handleClickOutside = (event) => {
      if (
        systemButtonRef.current &&
        !systemButtonRef.current.contains(event.target)
      ) {
        setShowSystem(false);
      }
    };

    if (showSystem) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSystem]);

  useEffect(() => {                                  //Manipula o clique do teclado
  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [expression]);

const handleACMouseDown = () => {            //Apaga tudo
  holdTimer.current = setTimeout(() => {
    setExpression("0");
    lastOperation.current.lastResult = null;
    lastOperation.current._justEvaluated = false;
  }, 600); 
};

const handleACMouseUp = () => {               //Apaga o último
  if (holdTimer.current) {
    clearTimeout(holdTimer.current);
    holdTimer.current = null;

    if (expression.length > 1) {
      setExpression(expression.slice(0, -1));
    } else {
      setExpression("0");
    }
  }
};

  const handleClick = (value, type) => {        //Callback dos botões
    handleButtonClick({
      value,
      type,
      expression,
      setExpression,
      lastOperation,
      setShowSystem,
      historyRef: history
    });
  };

  return (
  <>
    <div className="display-header">
      <button onClick={() => setShowFullHistory(prev => !prev)}>
        <History size={20} />
      </button>
    </div>
    
    {history.current.length > 0 && (
  <div className="last-history-item">
    {history.current[history.current.length - 1]}
  </div>
)}

    <ShowDisplay expression={expression} />
    {showSystem && <SystemButton />}

    <div className="buttons-grid">
      <Buttons
        onButtonClick={handleClick}
        onACMouseDown={handleACMouseDown}
        onACMouseUp={handleACMouseUp}
        systemButtonRef={systemButtonRef}
      />
    </div>
    {showFullHistory && (
      <div className="history-menu-overlay" onClick={() => setShowFullHistory(false)}>
        <div className="history-menu" onClick={(e) => e.stopPropagation()}>
        <ul>
          {history.current.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <button className="clear-history-button" onClick={() => {
        history.current = [];
        setShowFullHistory(false);
      }}>clear</button>
    </div>
  </div>
    )}

  </>
);

};
export default HandleOperations;