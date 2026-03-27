const display = document.querySelector(".display");
const digits = document.querySelectorAll(".digit");
const decimal = document.querySelector(".decimal");
const operators = document.querySelectorAll(".operator");
const clearBtn = document.querySelector(".clear");
const undoBtn = document.querySelector(".backspace");
const equalBtn = document.querySelector(".equal");

let isResultDisplayed = false;

digits.forEach(digit => {
    digit.addEventListener("click", () => {
        if (isResultDisplayed) {
            display.textContent = "";
            isResultDisplayed = false;
        }

        display.textContent += digit.textContent;
    });
});

decimal.addEventListener("click", () => {
    const exp = display.textContent.trim().split(" ");
    const lastChunk = exp[exp.length - 1];
    const isLastCharOp = ["+", "−", "×", "÷"].includes(lastChunk);

    if (lastChunk.includes(".")) return;

    lastChunk === "" || isLastCharOp
        ? display.textContent += "0." 
        : display.textContent += decimal.textContent;
});

operators.forEach(operator => {
    operator.addEventListener("click", () => {
        const currentContent = display.textContent.trim()
        const opChar = operator.textContent;

        if (currentContent === "") {
            if (opChar === "−" || opChar === "+") {
                display.textContent = opChar;
            }
            
            return;
        }

        const endsWithBinOp = currentContent.endsWith(" +") || currentContent.endsWith(" −") || currentContent.endsWith(" ×") || currentContent.endsWith(" ÷");

        if (endsWithBinOp) {
            if (opChar === "−" || opChar === "+") {
                display.textContent += opChar;
            } else {
                handleInvalidExpression();
            }
            
            return;
        }

        const separatedParts = currentContent.split(" ");

        if (separatedParts.length === 3) {
            operate();
        }

        display.textContent += " " + opChar + " ";
        isResultDisplayed = false;
    });
});

clearBtn.addEventListener("click", () => {
    digits.forEach(digit => digit.disabled = false);
    decimal.disabled = false;
    operators.forEach(operator => operator.disabled = false);
    undoBtn.disabled = false;

    display.style.color = "#fff";
    display.style.fontSize = "32px";
    display.textContent = "";
});

undoBtn.addEventListener("click", () => {
    if (display.textContent.endsWith(" ")) {
        display.textContent = display.textContent.slice(0, -3);
    } else {
        display.textContent = display.textContent.slice(0, -1);
    }
});

equalBtn.addEventListener("click", () => {
    const exp = display.textContent.trim().split(" ");
    const isLastCharOpMD = ["×", "÷"].includes(display.textContent.trim().slice(-1));

    if (exp[0] === "×" || exp[0] === "÷" || isLastCharOpMD || isExpressionIncomplete()) {
        handleInvalidExpression();
        return;
    } else {
        operate();
    }
});

function operate() {
    const content = display.textContent.trim();
    const opMatch = content.slice(1).match(/[÷×−+]/);

    if (!opMatch) return;

    const op = opMatch[0];
    const opIndex = content.indexOf(op, 1);

    const n1 = parseFloat(content.substring(0, opIndex).replace("−", "-"));
    const n2 = parseFloat(content.substring(opIndex + 1).replace("−", "-"));

    let result;

    switch (op) {
        case "+":
            result = n1 + n2;
            break;
        case "−":
            result = n1 - n2;
            break;
        case "×":
            result = n1 * n2;
            break;
        case "÷":
            if (n2 === 0) {
                handleDivisionByZero();
                return;
            } else {
                result = n1 / n2;
                break;
            }
        default:
            break;
    }
    
    display.textContent = Math.round(result * 100) / 100;
    isResultDisplayed = true;
}

function isExpressionIncomplete() {
    const content = display.textContent.trim();
    const parts = content.split(" ");
    const lastPart = parts[parts.length - 1];

    return ["+", "−", "×", "÷"].includes(lastPart) || lastPart === "−";
}

function handleInvalidExpression() {
    display.style.fontSize = "24px";
    display.style.color = "#ff2600";
    display.textContent = "Malformed expression";
    disableButtons();
}

function handleDivisionByZero() {
    display.style.fontSize = "24px";
    display.style.color = "#ff9500";
    display.textContent = "Cannot divide by zero";
    disableButtons();
}

function disableButtons() {
    digits.forEach(digit => digit.disabled = true);
    operators.forEach(operator => operator.disabled = true);
    undoBtn.disabled = true;
}