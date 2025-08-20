import { useState, useEffect, useRef, useCallback } from "react";
import Buttons from "./buttons";
import handleCalculate from "./handle-calculate"
import ShowDisplay from "./display";
import SystemButton from "./system-options";
import { History } from "lucide-react";
import handleInversion from './handle-inversion';
import addHistory from './history-utils'

import "./Display.css";
import "./Buttons.css";

export const handleButtonClick = ({ //Manipula os cliques dos botões, adiciona o histórico 
  value,
  type,
  expression,
  setExpression,
  setShowSystem,
  addHistory,
  setHistory
}) => {
  const operators = ['+', '-', '*', '/'];
  const regexOperators = /[\+\-\*\/]/

  if (type === "number") {
    if (value === ",") {
      const parts = expression.split(regexOperators);    //quebra a expressão entre os operadores
      const lastNumber = parts[parts.length - 1];

      if (!lastNumber.includes(",")) {             //verifica se o último índice contem alguma vírgula
        setExpression(expression + value);
      }
    } else {
      setExpression(expression + value);
    }
  }else if (type === "operator") {
    if (operators.includes(value)) {
      const lastChar = expression.slice(-1);
      if (operators.includes(lastChar)) {
        setExpression(expression.slice(0, -1) + value);
        return;
      } else {
        setExpression(expression + value);
      }
    }

  } else if (type === "control") {
    if (value === "=") {
      const result = handleCalculate({ expression, setExpression });
      addHistory(setHistory, expression, result)

    } else if (value === "+/-") {
      handleInversion({ expression, setExpression });

    } else if (value === "%") {
      setExpression(expression + value);

    }
  } else if (type === "system") {
    if (value === "AC") {
      setExpression("0");
      currentLastOpState.lastResult = null;
      currentLastOpState._justEvaluated = false;

    } else if (value === "option") {
      window.alert("Oops! This part is still in progress.")
      setShowSystem((prev) => !prev);
      return;
    }
  }
};

const HandleOperations = () => {
  const [expression, setExpression] = useState("0");
  const systemButtonRef = useRef(null);
  const holdTimer = useRef(null);
  const [history, setHistory] = useState([])
  const [showSystem, setShowSystem] = useState(false);

  const [showFullHistory, setShowFullHistory] = useState(false);

  const handleKeyDown = useCallback((event) => {       //Manipula cliques do teclado, modificado para usar o useCallback
    const key = event.key;
    if ((/[\d]/.test(key)) || key === ",") {            //(/[\d]/.test(key)) testa todas as teclas, mas usa apenas os input corretos para calculadora
      handleClick(key, "number");
    } else if (["+", "-", "*", "/"].includes(key)) {
      handleClick(key, "operator");
    } else if (key === "x") {
      handleClick("x", "operator");
    } else if (key === "Enter" || key === "=") {
      handleClick("=", "control");
    } else if (key === "%") {
      handleClick("%", "control");
    } else if (key === "Backspace") {
      if (expression.length > 1) {
        setExpression(expression.slice(0, -1));
      } else {
        setExpression("0");
      }
    } else {
      setExpression(prevExpression = () => {
        if (expression.length > 1) {

          expression.slice(0, -1);
        } else {
          setExpression("0");
        }

      })
    }
  }, [expression])

  const handleClickOutside = useCallback((event) => {
    if (
      systemButtonRef.current &&
      !systemButtonRef.current.contains(event.target)
    ) {
      setShowSystem(false);
    }
  }, [systemButtonRef, showSystem])


  useEffect(() => {                                //Manipula o clique do mouse

    if (showSystem) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleACMouseDown = () => {            //Apaga tudo
    holdTimer.current = setTimeout(() => {
      setExpression("0");
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
      setShowSystem,
      addHistory,
      setHistory
    });
  };

  return (
    <>
      <div className="display-header">
        <button onClick={() => setShowFullHistory(prev => !prev)}>
          <History size={20} />
        </button>
      </div>

      {history.length > 0 && (
        <div className="last-history-item">
          {history.length > 0 && <li>{history[history.length - 1]}</li>}
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
              {history.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <button className="clear-history-button" onClick={() => {
              setHistory([]);
              setShowFullHistory(false);
            }}>clear</button>
          </div>
        </div>
      )}

    </>
  );

};

export default HandleOperations;