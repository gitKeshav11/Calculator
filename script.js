const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');
const body = document.body;
const buttons = document.querySelectorAll("button");

let expression = "";
let history = [];

// Update display
function updateDisplay() {
    expressionEl.textContent = expression;
    try {
        let value = calculate(expression);
        resultEl.textContent = value;
    } catch {
        resultEl.textContent = "Error";
    }
}

// Append value
function appendValue(value) {
    expression += value;
    updateDisplay();
}

// Clear all
function clearAll() {
    expression = "";
    updateDisplay();
}

// Backspace
function backspace() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

// Equals
function calculateResult() {
    try {
        let value = calculate(expression);
        addToHistory(expression, value);
        expression = value.toString();
        updateDisplay();
    } catch {
        resultEl.textContent = "Error";
    }
}

// Safe calculation
function calculate(exp) {
    if (!exp) return 0;
    let safeExp = exp.replace(/×/g, "*").replace(/÷/g, "/");
    safeExp = safeExp.replace(/(\\d+(\\.\\d+)?)%/g, "($1/100)");
    return Function("return " + safeExp)();
}

// Add to history
function addToHistory(exp, result) {
    const historyContainer = document.getElementById("history");
    if (!historyContainer) return;

    const item = document.createElement("div");
    item.classList.add("history-item");
    item.textContent = `${exp} = ${result}`;
    historyContainer.prepend(item);

    history.push({ exp, result });
}

// Event Listeners for buttons
buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;
        const action = button.dataset.action;

        // Add click animation
        button.classList.add("active");
        setTimeout(() => button.classList.remove("active"), 150);

        if (action === "clear") clearAll();
        else if (action === "back") backspace();
        else if (action === "equals") calculateResult();
        else if (action === "theme") toggleTheme();
        else if (value) appendValue(value);
    });
});

// Keyboard Support
window.addEventListener("keydown", e => {
    if ((e.key >= "0" && e.key <= "9") || ["+", "-", "*", "/", ".", "%"].includes(e.key)) {
        appendValue(e.key);
    } else if (e.key === "Enter") {
        calculateResult();
    } else if (e.key === "Backspace") {
        backspace();
    }
});

// Dark/Light Mode Toggle
function toggleTheme() {
    body.classList.toggle("dark-mode");
}
