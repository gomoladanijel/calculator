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
        isResultDisplayed = false;
        const exp = display.textContent.trim().split(" ");
        const isLastCharOp = ["+", "−", "×", "÷"].includes(display.textContent.trim().slice(-1));

        if (exp[0] === "×" || exp[0] === "÷" || isLastCharOp) {
            display.style.fontSize = "24px";
            display.style.color = "#ff2600";
            display.textContent = "Malformed expression";
            disableButtons();
            return;
        }

        if (exp[0] === "+" || exp[0] === "−") operate();

        if (exp[1] === "÷" && exp[2] === "0") operate();

        if (exp.length === 3) {
            operate();
            isResultDisplayed = false;
            display.textContent += " " + operator.textContent + " ";
        } else {
            display.textContent += " " + operator.textContent + " ";
        }
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

equalBtn.addEventListener("click", operate);

function operate() {
    const nums = display.textContent.split(/[÷×−+]/);
    const n1 = +nums[0];
    const n2 = +nums[1];
    const op = display.textContent.match(/[÷×−+]/).toString();

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
                display.style.fontSize = "24px";
                display.style.color = "#ff9500";
                display.textContent = "Cannot divide by zero";
                disableButtons();
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

function disableButtons() {
    digits.forEach(digit => digit.disabled = true);
    operators.forEach(operator => operator.disabled = true);
    undoBtn.disabled = true;
}