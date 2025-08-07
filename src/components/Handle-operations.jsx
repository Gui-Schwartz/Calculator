import React, { useState, useEffect, useRef } from "react";
import Buttons from "./Buttons";
import HandleCalculate from "./handle-calculate";
import ShowDisplay from "./show-display";
import SystemButton from "./system-options";
import * as math from 'mathjs';

import "./Display.css";
import "./Buttons.css";

function canInsertOperator(expression, newOperator) {
  const normalize = (op) => op === 'x' ? '*' : op; 


  const lastChar = normalize(expression.slice(-1));
  const newOp = normalize(newOperator);
  
  const isLastOperator = ['+', '-', '*', '/'].includes(lastChar); 
  const isNewOperator = ['+', '-', '*', '/'].includes(newOp);

  if (isLastOperator && isNewOperator) {
    
    return false;
  }
  return true;
}


export function formatDisplay(expression) {
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

    if (
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

export const handleButtonClick = ({
  value,
  type,
  expression,
  setExpression,
  lastOperation,
  setShowSystem
}) => {
  const operators = ["+", "-", "x", "/"];
  const lastChar = expression.slice(-1);
  const currentLastOpState = lastOperation.current;

  if (type === "number" || value === ",") {
    if (currentLastOpState._justEvaluated) {
      setExpression(value);
      currentLastOpState._justEvaluated = false;
    } else if (expression === "0" && value !== ",") {
      setExpression(value);
    } else {
      setExpression(expression + value);
    }
  } else if (type === "operator") {
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
    });
    } else if (value === "+/-") {
      const percentRegex = /(-?\d+(?:,\d*)?)%$/;
      const matchPercent = expression.match(percentRegex);

      if (matchPercent) {
        const original = matchPercent[1];
        const parsed = parseFloat(original.replace(',', '.'));
        const inverted = (-parsed).toString().replace('.', ',');
        const newExpression = expression.slice(0, -original.length - 1) + inverted + "%";
        setExpression(newExpression);
        return;
      }

      const lastNumberRegex = /(-?\d+(?:,\d*)?)$/;
      const match = expression.match(lastNumberRegex);

      if (match) {
          const original = match[1];
          const parsed = parseFloat(original.replace(',', '.'));
          const inverted = (-parsed).toString().replace('.', ',');

          const newExpression = expression.slice(0, -original.length) + inverted;
          setExpression(newExpression);
      } else if (expression.endsWith("0")) {
          setExpression("-0");
      }
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
const HandleOperations = () => {
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
  useEffect(() => {
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

const handleACMouseDown = () => { 
  holdTimer.current = setTimeout(() => {
    setExpression("0");
    lastOperation.current.lastResult = null;
    lastOperation.current._justEvaluated = false;
  }, 600); 
};

const handleACMouseUp = () => { 
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


  const handleClick = (value, type) => {
    handleButtonClick({
      value,
      type,
      expression,
      setExpression,
      lastOperation,
      setShowSystem
    });
  };

  return (
    <>
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
    </>
  );
};
export default HandleOperations;