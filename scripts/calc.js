const MAX_EXPRESSION_LENGTH = 200;
const COMMAND = "/calc";

const OPERATORS = {
  "+": { precedence: 1, associativity: "left", arity: 2, apply: (left, right) => left + right },
  "-": { precedence: 1, associativity: "left", arity: 2, apply: (left, right) => left - right },
  "*": { precedence: 2, associativity: "left", arity: 2, apply: (left, right) => left * right },
  "/": { precedence: 2, associativity: "left", arity: 2, apply: (left, right) => left / right },
  "%": { precedence: 2, associativity: "left", arity: 2, apply: (left, right) => left % right },
  "^": { precedence: 3, associativity: "right", arity: 2, apply: (left, right) => left ** right },
  "u+": { precedence: 4, associativity: "right", arity: 1, apply: (value) => value },
  "u-": { precedence: 4, associativity: "right", arity: 1, apply: (value) => -value }
};

export function calculate(expression) {
  const normalizedExpression = expression.trim().replaceAll(",", ".");
  if (!normalizedExpression) throw new Error("Informe uma equação.");
  if (normalizedExpression.length > MAX_EXPRESSION_LENGTH) {
    throw new Error("A equação é muito longa.");
  }

  const tokens = tokenize(normalizedExpression);
  const output = toPostfix(tokens);
  const values = [];

  for (const token of output) {
    if (typeof token === "number") {
      values.push(token);
      continue;
    }

    const operator = OPERATORS[token];
    if (values.length < operator.arity) throw new Error("Equação inválida.");
    const right = values.pop();
    const left = operator.arity === 2 ? values.pop() : undefined;
    const value = operator.arity === 1 ? operator.apply(right) : operator.apply(left, right);
    if (!Number.isFinite(value)) throw new Error("O resultado não é um número finito.");
    values.push(value);
  }

  if (values.length !== 1) throw new Error("Equação inválida.");
  return values[0];
}

function tokenize(expression) {
  const tokens = [];
  let position = 0;

  while (position < expression.length) {
    const character = expression[position];
    if (/\s/.test(character)) {
      position += 1;
      continue;
    }

    const numberMatch = expression.slice(position).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);
    if (numberMatch) {
      tokens.push(Number(numberMatch[0]));
      position += numberMatch[0].length;
      continue;
    }

    if ("+-*/%^()".includes(character)) {
      tokens.push(character);
      position += 1;
      continue;
    }

    throw new Error(`Caractere inválido: ${character}`);
  }

  return tokens;
}

function toPostfix(tokens) {
  const output = [];
  const operators = [];
  let expectsValue = true;

  for (const token of tokens) {
    if (typeof token === "number") {
      output.push(token);
      expectsValue = false;
      continue;
    }

    if (token === "(") {
      operators.push(token);
      expectsValue = true;
      continue;
    }

    if (token === ")") {
      while (operators.length && operators.at(-1) !== "(") output.push(operators.pop());
      if (operators.pop() !== "(") throw new Error("Parênteses desbalanceados.");
      expectsValue = false;
      continue;
    }

    const operatorToken = expectsValue && (token === "+" || token === "-") ? `u${token}` : token;
    const operator = OPERATORS[operatorToken];
    if (!operator || (expectsValue && operator.arity === 2)) throw new Error("Equação inválida.");

    while (operators.length && operators.at(-1) !== "(") {
      const top = OPERATORS[operators.at(-1)];
      const shouldPop = operator.associativity === "left"
        ? operator.precedence <= top.precedence
        : operator.precedence < top.precedence;
      if (!shouldPop) break;
      output.push(operators.pop());
    }

    operators.push(operatorToken);
    expectsValue = operator.arity !== 1;
  }

  if (expectsValue) throw new Error("Equação inválida.");
  while (operators.length) {
    const operator = operators.pop();
    if (operator === "(") throw new Error("Parênteses desbalanceados.");
    output.push(operator);
  }
  return output;
}

function formatResult(value) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(10)));
}

function escapeHtml(value) {
  const stringValue = String(value);
  if (typeof foundry !== "undefined" && foundry.utils && typeof foundry.utils.escapeHTML === "function") {
    return foundry.utils.escapeHTML(stringValue);
  }

  return stringValue.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[character]));
}

function sendResult(expression) {
  try {
    const result = calculate(expression);
    ChatMessage.create({
      content: `<strong>Resultado:</strong> ${escapeHtml(expression)} = <strong>${formatResult(result)}</strong>`
    });
  } catch (error) {
    ChatMessage.create({
      content: `<strong>Calculadora:</strong> ${escapeHtml(error.message)}`
    });
  }
}

if (typeof Hooks !== "undefined") {
  Hooks.on("chatMessage", (_chatLog, messageText) => {
    const message = messageText.trim();
    const commandMatch = message.match(/^\/calc(?:\s+|$)/i);
    if (!commandMatch) return;
    const expression = message.slice(commandMatch[0].length).trim();
    sendResult(expression);
    return false;
  });
}
