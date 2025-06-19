function calculate(operation, a, b) {
    if(!isValidNumber(a) || !isValidNumber(b)){
        return "Not a number";
    }
    let new_op = operation.toLowerCase();
    let result;
    function formatResult() {
        let new_result = Math.round(result * 100) / 100;
        return new_result;
    }
    function add() {
        return a + b;
    }
    function subtract() {
        return a - b;
    }
    function multiply() {
        return a * b;
    }
    function divide() {
        if (b == 0) {
            return "Can't divide by zero";
        }
        return a / b;
    }
    switch (new_op) {
        case "add":
        case "+":
            result = add();
            break;
        case "subtract":
        case "-":
            result = subtract();
            break;
        case "multiply":
        case "*":
            result = multiply(a, b);
            break;
        case "divide":
        case "/":
            result = divide(a, b);
            break;
        default:
            return "Invalid operation";
    }
    return formatResult();
}
function isValidNumber(n) {
    return Number.isNaN(n);
}
