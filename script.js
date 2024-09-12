function roundNumber(num, scale) {
  if (!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale) + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = "";

    if (+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(
      Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) +
      "e-" +
      scale
    );
  }
}

function add(num1, num2) {
  return num1 + num2;
}

function subtract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  return roundNumber(num1 / num2, 15);
}

let num1;
let operator;
let num2;

function operate(num1, operator, num2) {
  switch (operator) {
    case "+":
      return add(num1, num2);
    case "-":
      return subtract(num1, num2);
    case "*":
      return multiply(num1, num2);
    case "/":
      return divide(num1, num2);
  }
}

const numberButtons = document.querySelectorAll(".number-button");
const operatorButtons = document.querySelectorAll(".operator-button");
const equalsButton = document.querySelector(".equals-button");
const decimalButton = document.querySelector(".decimal-button");
const percentButton = document.querySelector(".percent-button");

const operatorButtonsArray = Array.from(operatorButtons);

function operatorActivated(arr) {
  let activatedOperators = arr.filter(
    (btn) => btn.className === "operator-button activated"
  );

  if (activatedOperators[0] !== undefined) {
    return true;
  } else {
    return false;
  }
}

let displayNumberArray = [];
let displayValue = 0;
let expression = {};

const displayText = document.querySelector(".display-text");
const smallTextContainer = document.querySelector(
  ".display-small-text-container"
);

function selectNumber(e) {
  if (displayText.textContent === "0" && e.target.textContent === "0") {
    return;
  } else {
    if (
      operatorActivated(operatorButtonsArray) ||
      equalsButton.className === "equals-button activated" ||
      percentButton.className === "percent-button activated"
    ) {
      if (equalsButton.className === "equals-button activated") {
        expression = {};
        smallTextContainer.textContent = "";
      }

      for (const btn of operatorButtons) {
        btn.classList.remove("activated");
      }

      equalsButton.classList.remove("activated");
      percentButton.classList.remove("activated");
      displayNumberArray = [];
    }

    displayNumberArray.push(e.target.textContent);
    let displayNumberString = displayNumberArray.join("");
    displayText.textContent = displayNumberString;
    displayValue = Number(displayNumberString);
  }
}

numberButtons.forEach((button) => {
  button.addEventListener("click", selectNumber);
});

function selectOperator(e) {
  if (equalsButton.className === "equals-button activated") {
    equalsButton.classList.remove("activated");
  } else if (
    expression.firstNumber !== undefined &&
    expression.operator !== undefined
  ) {
    decimalButton.classList.remove("activated");
    percentButton.classList.remove("activated");
    num2 = displayValue;
    expression.secondNumber = num2;
    if (expression.operator === "/" && expression.secondNumber === 0) {
      displayText.textContent = "plz dnt";
    } else {
      let solution = operate(
        expression.firstNumber,
        expression.operator,
        expression.secondNumber
      );
      displayText.textContent = solution.toString();
      displayValue = solution;
    }
  }

  decimalButton.classList.remove("activated");
  percentButton.classList.remove("activated");
  num1 = displayValue;

  switch (e.target.textContent) {
    case "+":
      operator = "+";
      break;
    case "−":
      operator = "-";
      break;
    case "×":
      operator = "*";
      break;
    case "÷":
      operator = "/";
      break;
  }

  e.target.classList.add("activated");
  expression.firstNumber = num1;
  expression.operator = operator;
  smallTextContainer.textContent = `${expression.firstNumber} ${e.target.textContent}`;
}

operatorButtons.forEach((button) => {
  button.addEventListener("click", selectOperator);
});

function selectEquals() {
  if (
    expression.firstNumber === undefined &&
    expression.secondNumber === undefined
  ) {
    equalsButton.classList.add("activated");
    smallTextContainer.textContent = `${displayValue} =`;
  } else if (equalsButton.className === "equals-button activated") {
    expression.firstNumber = displayValue;
    let solution = operate(
      expression.firstNumber,
      expression.operator,
      expression.secondNumber
    );
    displayText.textContent = solution.toString();
    let smallTextArray = smallTextContainer.textContent.split(" ");
    smallTextArray.splice(0, 1, `${expression.firstNumber}`);
    smallTextContainer.textContent = smallTextArray.join(" ");
    displayValue = solution;
  } else {
    equalsButton.classList.add("activated");
    decimalButton.classList.remove("activated");
    percentButton.classList.remove("activated");
    num2 = displayValue;
    expression.secondNumber = num2;
    if (expression.operator === "/" && expression.secondNumber === 0) {
      smallTextContainer.textContent = "";
      displayText.textContent = "plz dnt";
    } else {
      let solution = operate(
        expression.firstNumber,
        expression.operator,
        expression.secondNumber
      );
      displayText.textContent = solution.toString();
      let smallTextArray = smallTextContainer.textContent.split(" ");
      smallTextArray.splice(
        smallTextArray.length,
        0,
        `${expression.secondNumber}`,
        "="
      );
      smallTextContainer.textContent = smallTextArray.join(" ");
      displayValue = solution;
    }
  }
}

equalsButton.addEventListener("click", selectEquals);

function selectDecimal() {
  if (decimalButton.className === "decimal-button activated") {
    return;
  } else if (
    displayText.textContent === "0" ||
    operatorActivated(operatorButtonsArray) ||
    equalsButton.className === "equals-button activated" ||
    percentButton.className === "percent-button activated"
  ) {
    if (equalsButton.className === "equals-button activated") {
      expression = {};
      smallTextContainer.textContent = "";
    }

    for (const btn of operatorButtons) {
      btn.classList.remove("activated");
    }
    equalsButton.classList.remove("activated");
    percentButton.classList.remove("activated");
    decimalButton.classList.add("activated");
    displayNumberArray = ["0", "."];
    displayText.textContent = "0.";
    displayValue = 0;
  } else {
    decimalButton.classList.add("activated");
    displayNumberArray.push(".");
    let displayNumberString = displayNumberArray.join("");
    displayText.textContent = displayNumberString;
    displayValue = Number(displayNumberString);
  }
}

decimalButton.addEventListener("click", selectDecimal);

function selectPercent() {
  if (equalsButton.className === "equals-button activated") {
    expression = {};
  }

  decimalButton.classList.remove("activated");
  equalsButton.classList.remove("activated");

  for (const btn of operatorButtons) {
    btn.classList.remove("activated");
  }

  if (expression.firstNumber === undefined) {
    percentButton.classList.add("activated");
    let percentage = displayValue / 100;
    displayText.textContent = percentage.toString();
    displayNumberArray = percentage.toString().split("");
    displayValue = percentage;
  } else {
    percentButton.classList.add("activated");
    let percentage = displayValue / 100;
    let firstNumberPercentage = expression.firstNumber * percentage;
    displayText.textContent = firstNumberPercentage.toString();
    displayNumberArray = percentage.toString().split("");
    displayValue = firstNumberPercentage;
  }
}

percentButton.addEventListener("click", selectPercent);

const acButton = document.querySelector(".ac-button");

function selectAC() {
  displayNumberArray = [];
  expression = {};
  displayValue = 0;
  const buttons = document.querySelectorAll("button");

  for (const btn of buttons) {
    btn.classList.remove("activated");
  }

  displayText.textContent = "0";
  smallTextContainer.textContent = "";
}

acButton.addEventListener("click", selectAC);

const backspaceButton = document.querySelector(".backspace-button");

function selectBackspace() {
  percentButton.classList.remove("activated");
  if (
    displayText.textContent === "0" ||
    operatorActivated(operatorButtonsArray) ||
    equalsButton.className === "equals-button activated"
  ) {
    return;
  } else if (displayNumberArray.length === 1) {
    displayNumberArray = [];
    displayText.textContent = "0";
    displayValue = 0;
  } else if (
    displayNumberArray[displayNumberArray.length - 1] === "." &&
    displayNumberArray[0] !== "-"
  ) {
    if (displayNumberArray[0] === "0") {
      decimalButton.classList.remove("activated");
      displayNumberArray = [];
      displayText.textContent = "0";
      displayValue = 0;
    } else {
      displayNumberArray.pop();
      decimalButton.classList.remove("activated");
      let displayNumberString = displayNumberArray.join("");
      displayText.textContent = displayNumberString;
      displayValue = Number(displayNumberString);
    }
  } else if (displayNumberArray[0] === "-") {
    if (
      displayNumberArray.length === 2 ||
      (displayNumberArray[1] === "0" &&
        displayNumberArray[displayNumberArray.length - 1] === ".")
    ) {
      decimalButton.classList.remove("activated");
      displayNumberArray = [];
      displayText.textContent = "0";
      displayValue = 0;
    } else {
      displayNumberArray.pop();
      let displayNumberString = displayNumberArray.join("");
      displayText.textContent = displayNumberString;
      displayValue = Number(displayNumberString);
    }
  } else {
    displayNumberArray.pop();
    let displayNumberString = displayNumberArray.join("");
    displayText.textContent = displayNumberString;
    displayValue = Number(displayNumberString);
  }
}

backspaceButton.addEventListener("click", selectBackspace);

const plusMinusButton = document.querySelector(".plus-minus-button");

function selectPlusMinus() {
  if (
    displayValue === 0 ||
    operatorActivated(operatorButtonsArray) ||
    equalsButton.className === "equals-button activated"
  ) {
    return;
  } else if (displayNumberArray[0] !== "-") {
    displayNumberArray.unshift("-");
    let displayNumberString = displayNumberArray.join("");
    displayText.textContent = displayNumberString;
    displayValue = Number(displayNumberString);
  } else {
    displayNumberArray.shift();
    let displayNumberString = displayNumberArray.join("");
    displayText.textContent = displayNumberString;
    displayValue = Number(displayNumberString);
  }
}

plusMinusButton.addEventListener("click", selectPlusMinus);

let clickEvent = new MouseEvent("click");

window.addEventListener("keypress", (e) => {
  switch (e.key) {
    case "Enter":
      equalsButton.dispatchEvent(clickEvent);
      e.preventDefault();
      break;
    case "=":
      equalsButton.dispatchEvent(clickEvent);
      break;
    case ".":
      decimalButton.dispatchEvent(clickEvent);
      break;
    case "%":
      percentButton.dispatchEvent(clickEvent);
      break;
    case "c":
      acButton.dispatchEvent(clickEvent);
      break;
    case "C":
      acButton.dispatchEvent(clickEvent);
      break;
    case "+":
      let additionOperatorArray = operatorButtonsArray.filter(
        (btn) => btn.textContent === "+"
      );
      let additionOperator = additionOperatorArray[0];
      additionOperator.dispatchEvent(clickEvent);
      break;
    case "-":
      let subtractionOperatorArray = operatorButtonsArray.filter(
        (btn) => btn.textContent === "−"
      );
      let subtractionOperator = subtractionOperatorArray[0];
      subtractionOperator.dispatchEvent(clickEvent);
      break;
    case "*":
      let multiplicationOperatorArray = operatorButtonsArray.filter(
        (btn) => btn.textContent === "×"
      );
      let multiplicationOperator = multiplicationOperatorArray[0];
      multiplicationOperator.dispatchEvent(clickEvent);
      break;
    case "/":
      let divisionOperatorArray = operatorButtonsArray.filter(
        (btn) => btn.textContent === "÷"
      );
      let divisionOperator = divisionOperatorArray[0];
      divisionOperator.dispatchEvent(clickEvent);
      break;
  }
  let numberOptions = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  function isNumber(key) {
    if (numberOptions.includes(key)) {
      return true;
    } else {
      return false;
    }
  }
  if (isNumber(e.key)) {
    const numberButtonsArray = Array.from(numberButtons);
    let keyedNumberArray = numberButtonsArray.filter(
      (btn) => btn.textContent === e.key
    );
    let keyedNumber = keyedNumberArray[0];
    keyedNumber.dispatchEvent(clickEvent);
  }
});

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "Backspace":
      backspaceButton.dispatchEvent(clickEvent);
      break;
    case "Delete":
      backspaceButton.dispatchEvent(clickEvent);
      break;
  }
});
