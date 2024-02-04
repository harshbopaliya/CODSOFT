const keys = document.querySelectorAll(".key");
const displayInput = document.querySelector(".display .input");
const displayOutput = document.querySelector(".display .output");

let input = "";

keys.forEach((key) => {
  key.addEventListener("click", () => {
    const value = key.dataset.key;

    if (value === "clear") {
      clearInput();
    } else if (value === "del") {
      deleteLastInput();
    } else if (value === "=") {
      calculateResult();
    } else if (value === "brackets") {
      toggleBrackets();
    } else {
      handleDefault(value);
    }

    updateDisplay();
  });
});

function handleDefault(value) {
  if (input.includes("=")) {
    clearInput();
  }
  appendToInput(value);
}

function clearInput() {
  input = "";
}

function deleteLastInput() {
  input = input.slice(0, -1);
}

function calculateResult() {
  try {
    const result = eval(PrepareInput(input));
    input = cleanOutput(result);
  } catch (error) {
    input = "Error";
  }
}

function toggleBrackets() {
  const openBracketIndex = input.lastIndexOf("(");
  const closeBracketIndex = input.lastIndexOf(")");

  if (
    openBracketIndex == -1 ||
    (openBracketIndex != -1 &&
      closeBracketIndex != -1 &&
      openBracketIndex < closeBracketIndex)
  ) {
    input += "(";
  } else if (
    (openBracketIndex != -1 && closeBracketIndex == -1) ||
    (openBracketIndex != -1 &&
      closeBracketIndex != -1 &&
      openBracketIndex > closeBracketIndex)
  ) {
    input += ")";
  }
}

function appendToInput(value) {
  if (ValidateInput(value)) {
    input += value;
  }
}

function updateDisplay() {
  displayInput.innerHTML = cleanInput(input);
  displayOutput.innerHTML = input;
}

function cleanInput(input) {
  return input.replace(/([*\/+\-%()])/g, (match) => {
    const replacements = {
      "*": '<span class="operator">x</span>',
      "/": '<span class="operator">/</span>',
      "+": '<span class="operator">+</span>',
      "-": '<span class="operator">-</span>',
      "(": '<span class="brackets">(</span>',
      ")": '<span class="brackets">)</span>',
      "%": '<span class="percent">%</span>',
    };
    return replacements[match] || match;
  });
}

function ValidateInput(value) {
  const lastInput = input.slice(-1);
  const operators = ["+", "-", "*", "/"];

  if (value === "." && lastInput === ".") {
    return false;
  }

  return !(operators.includes(value) && operators.includes(lastInput));
}

function PrepareInput(input) {
  return input.replace(/%/g, "/100");
}

function cleanOutput(output) {
  const formattedOutput = Number(output).toLocaleString("en-US", {
    maximumFractionDigits: 10,
  });

  return formattedOutput;
}
