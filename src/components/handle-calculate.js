import expressionOrganizer from "./organize-expression";
const handleCalculate = ({ expression, setExpression }) => {
    const calculate = (expressionToCalculate) => {
        let calculateExpression = expressionToCalculate.map(index => {
            if (typeof index === "string" && index.startsWith("(-") && index.endsWith(")")) {
                return (-parseFloat(index.slice(2, -1))).toString()
            }
            return index
        })

        let i = 0;
        let number1
        let number2
        while (i < calculateExpression.length) {
            let result
            let op = calculateExpression[i]

            if (op === "*") {
                number1 = parseFloat(calculateExpression[i - 1])
                number2 = parseFloat(calculateExpression[i + 1])
                result = number1 * number2
                calculateExpression.splice(i - 1, 3, result)

            } else if (op === "/") {
                number1 = parseFloat(calculateExpression[i - 1])
                number2 = parseFloat(calculateExpression[i + 1])
                result = number1 / number2
                calculateExpression.splice(i - 1, 3, result)

            } else if (op === "%") {                              //Feito ajuste, testar
                number1 = parseFloat(calculateExpression[i - 3]);
                number2 = parseFloat(calculateExpression[i - 1]);

                if (isNaN(number1)) number1 = 1; 
                if (isNaN(number2)) number2 = 0; 

                result = number1 * (number2 / 100);

                if (!isNaN(result)) {                            //Confere se tem resultado "valido", se não sai do loop
                    calculateExpression.splice(i - 1, 2, result);
                } else {
                    i++;                                         
                }
            } else {
                i++
            }
        }
        i = 0
        while (i < calculateExpression.length) {
            let result
            let op = calculateExpression[i]

            if (op === "+") {
                number1 = parseFloat(calculateExpression[i - 1])
                number2 = parseFloat(calculateExpression[i + 1])
                result = number1 + number2
                calculateExpression.splice(i - 1, 3, result)

            } else if (op === "-") {
                number1 = parseFloat(calculateExpression[i - 1])
                number2 = parseFloat(calculateExpression[i + 1])
                result = number1 - number2
                calculateExpression.splice(i - 1, 3, result)

            } else {
                i++
            }
        }
        return calculateExpression.toString()

    }
    const result = calculate(expressionOrganizer(expression))
    setExpression(result)
    return result
}

export default handleCalculate