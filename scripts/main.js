document
  .querySelectorAll(".numpad-button:not(.numpad-button-dummy)")
  .forEach((numpadButton) => {
    numpadButton.addEventListener("click", calculate);
  });

const numbers = "1234567890.";
function isNumber(text) {
  return numbers.includes(text);
}

const operators = "+-x/";
function isOperator(text) {
  return operators.includes(text);
}

const commands = ["AC", "del", "="];
function isCommand(text) {
  return commands.includes(text);
}

let number1 = "";
let number2 = "";
let currentOperator = "";
const displayPanel = document.querySelector("#display-panel");

function calculate(event) {
  const userInput = event.target.dataset.name;
  if (userInput === "" || userInput === undefined || userInput === null) {
    return;
  }

  if (isNumber(userInput)) {
    if (currentOperator === "") {
      // operator is not yet set, so this input should be part of number1
      let tempNumber = number1 + userInput;
      try {
        tempNumber = `${parseInt(tempNumber)}`;
        number1 = tempNumber;
      } catch (error) {
        alert("Invalid number", tempNumber);
        return;
      }
    } else {
      // operator is already set, so this input should be part of number2
      let tempNumber = number2 + userInput;
      try {
        tempNumber = `${parseInt(tempNumber)}`;
        number2 = tempNumber;
      } catch (error) {
        alert("Invalid number", tempNumber);
        return;
      }
    }
  } else if (isOperator(userInput)) {
    if (currentOperator === "") {
      // operator is not yet set, so this must be first operator after number1
      if (number1 === "") {
        alert("Expected Number, Found Operator!");
        return;
      }
      currentOperator = userInput;
    } else {
      // operator is already set, so this should be the second operator after number2
      if (number2 === "") {
        alert("Expected Number, Found Operator!");
        return;
      }
      number1 = operate(parseInt(number1), parseInt(number2), currentOperator);
      currentOperator = userInput;
      number2 = "";
    }
  } else if (isCommand(userInput)) {
    switch (userInput) {
      case "=":
        number1 = operate(
          parseInt(number1),
          parseInt(number2),
          currentOperator
        );
        currentOperator = "";
        number2 = "";
        break;

      case "AC":
        number1 = "";
        number2 = "";
        currentOperator = "";
        break;

      case "del":
        function backspace(text) {
          return text
            .split("")
            .slice(0, text.length - 1)
            .join("");
        }
        if (number2 !== "") {
          number2 = backspace(number2);
        } else if (currentOperator !== "") {
          currentOperator = "";
        } else if (number1 !== "") {
          number1 = backspace(number1);
        }
        break;

      default:
        break;
    }
  }

  displayPanel.textContent = `${number1} ${currentOperator} ${number2}`;
}

function operate(number1, number2, currentOperator) {
  let result = "";
  switch (currentOperator) {
    case "+":
      result = number1 + number2;
      break;

    case "-":
      result = number1 - number2;
      break;

    case "x":
      result = number1 * number2;
      break;

    case "/":
      result = number1 / number2;
      break;

    default:
      break;
  }
  return Math.floor(result * 100) / 100;
}
