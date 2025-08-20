const expressionOrganizer = (expression) => {
    let currentNumber = ""
    let expressionToCalculate = [];
    let i = 0;

    while (i < expression.length) {
        let char = expression[i]
        if (char === "(") {
            let parenContent = "";
            i++;
            while (i < expression.length && expression[i] !== ")") {
                parenContent += expression[i];
                i++;
            }
            expressionToCalculate.push(`(${parenContent})`);
        }
        else if (!isNaN(char) || char === "." || char === ",") {
            currentNumber += char
        } else {
            if (currentNumber) {
                expressionToCalculate.push(currentNumber.replace(",", "."));
                currentNumber = "";
            }
            expressionToCalculate.push(char);
        }
        i++
    }
    if (currentNumber) {
        expressionToCalculate.push(currentNumber.replace(",", "."));
    }
    return expressionToCalculate
}
export default expressionOrganizer;