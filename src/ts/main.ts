let newValue: string = "";
let result: string = "";
let error: string | null = null;
let history: boolean = false;

const variables: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
};

const displayEl = document.getElementById("display") as HTMLDivElement;
const expressionEl = document.getElementById("expression") as HTMLDivElement;
const errorEl = document.getElementById("error") as HTMLDivElement;
const historyUlEl = document.getElementById("history-ul") as HTMLUListElement;

function inputText(value: string) {
  newValue += value;
  displayEl.textContent = newValue;
  expressionEl.textContent = newValue;
}
function inputFunc(value: string) {
  newValue = value;
  displayEl.textContent = newValue;
}

function replaceValue(expression: string, variables: Record<string, any>) {
  const escape = (s: any) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    Object.keys(variables)
      .map((k) => `\\b${escape(k)}\\b`)
      .join("|"),
    "g",
  );
  return expression.replace(pattern, (match: any) => variables[match]);
}

function factorial(value: string) {
  const num = value.split("!").find((val) => val !== '');  
  // console.log(value.split("!"),num);
  
  let result = 1;
  for (let i = 1; i <= Number(num); i++) {
    result *= i;
  }
  return String(result);
}

function calculate() {
  if (!newValue) return;
  try {
    let resValue: string = newValue;
    
    if (resValue.includes("!")) {
      resValue = factorial(resValue);
    } else {
      if (resValue.includes("^")) resValue = resValue.replace("^", "**");
      resValue = replaceValue(resValue, variables);
    }
    result = eval(resValue);
    displayEl.textContent = Number(result).toFixed(4).toString();
    expressionEl.textContent = newValue + "=";
    addInHistory(newValue);
    newValue = "";
    if (error) {
      error = null;
      errorEl.textContent = error;
    }
  } catch (err: any) {
    // console.log(err.stack);
    error = err.message;
    errorEl.textContent = error;
  }
}

function clearAll() {
  error = null;
  errorEl.textContent = error;
  result = "";
  newValue = "0";
  displayEl.textContent = newValue;
  newValue = "";
}

function backspace() {
  if (newValue.length === 0) return;
  if (newValue.length === 1) {
    newValue = "0";
    displayEl.textContent = newValue;
    expressionEl.textContent = newValue;
    newValue = "";
  } else {
    const arr = newValue.split("");
    arr.pop();
    newValue = arr.join("");
    displayEl.textContent = newValue;
    expressionEl.textContent = newValue;
  }
}

function addInHistory(value: string) {
  if (!history) {
    historyUlEl.innerHTML = "";
  }
  const realValue = value;
  if (value.includes("!")) {
    value = factorial(value);
  } else {
    value = replaceValue(value, variables);
    if (value.includes("^")) value = value.replace("^", "**");
  }
  value = realValue + " = " + Number(eval(value)).toFixed(4).toString();
  const li = document.createElement("li");
  li.textContent = value;
  historyUlEl.appendChild(li);
  history = true;
}

historyUlEl.addEventListener("click", (e) => {
  const target = e.target;
  if (target instanceof HTMLElement) {
    if (target.classList.contains("text-center")) {
      return;
    }
    let value: string[] = target.innerText.split("=");
    newValue = value[0]!.replace(" ", "");
    displayEl.textContent = newValue;
  }
});

document.addEventListener("keydown", (e) => {
  // console.log(Object.keys(variables).join(""));

  if (e.key >= "0" && e.key <= "9") inputText(e.key);
  else if (e.key === ".") inputText(".");
  else if (["+", "-", "*", "(", ")"].includes(e.key)) inputText(e.key);
  else if (Object.keys(variables).join("").includes(e.key)) inputText(e.key);
  else if (e.key === "/") {
    e.preventDefault();
    inputText("/");
  } else if (e.key === "^") inputText("^");
  else if (e.key === "!") inputText("!");
  else if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    calculate();
  } else if (e.key === "Backspace") backspace();
  else if (e.key === "Escape") clearAll();
});

function addVariable() {
  const varName = prompt("Enter variable name: ");
  if (Object.keys(variables).includes(varName!)) {
    alert("Variable already exist!");
    return;
  }
  const varValue = Number(prompt("Enter variable value: "));
  variables[varName!] = varValue;
}

function clearAllHistory() {
  if (history) {
    historyUlEl.innerHTML = "";
    const li = document.createElement("li");
    li.innerText = "History Not available!";
    li.classList.add("text-sm", "text-gray-500", "text-center");
    historyUlEl.appendChild(li);
    history = false;
  }
}

(window as any).inputText = inputText;
(window as any).calculate = calculate;
(window as any).clearAll = clearAll;
(window as any).backspace = backspace;
(window as any).inputFunc = inputFunc;
(window as any).addVariable = addVariable;
(window as any).clearAllHistory = clearAllHistory;
