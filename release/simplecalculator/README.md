# Simple Calculator

A lightweight Foundry VTT module that evaluates arithmetic expressions directly from the chat using the `/calc` command.

Repository: [https://github.com/DouglasLimeira/simpleCalculator](https://github.com/DouglasLimeira/simpleCalculator)

## Overview

Simple Calculator is designed for quick mathematical checks during gameplay, without leaving the chat interface. It accepts a restricted expression language, evaluates it safely, and returns the result in chat.

This module targets Foundry Virtual Tabletop v14 and follows the current public API conventions for chat hooks and message creation. The calculation engine is intentionally isolated from raw `eval` execution, reducing the risk of unsafe code execution.

## Features

- Evaluate expressions in chat with `/calc`
- Support for operator precedence and parentheses
- Decimal input using either `.` or `,`
- Unary `+` and `-` support
- Validation for invalid expressions and arithmetic errors
- Safe parser without direct `eval`
- Compatible with Foundry VTT v14

## Installation

1. Download or clone this repository.
2. Copy the folder into your Foundry data modules directory:

```text
Data/modules/simplecalculator
```

3. Start or reload your Foundry world.
4. Open the **Add-on Modules** panel.
5. Enable **Simple Calculator** for the current world.

## Quick Start

Use this command in chat:

```text
/calc (2 + 3) * 4
```

The module will post the result back into the chat.

## Supported Syntax

The calculator supports:

- Integers and decimals: `10`, `3.14`, `2,5`
- Addition: `+`
- Subtraction: `-`
- Multiplication: `*`
- Division: `/`
- Modulo: `%`
- Exponentiation: `^`
- Parentheses: `(` and `)`
- Unary signs: `-2`, `+5`

Operator precedence follows standard mathematics:

```text
Parentheses > Exponentiation > Multiplication / Division / Modulo > Addition / Subtraction
```

## Usage Examples

```text
/calc 12 / 3 + 5
```

Result:

```text
9
```

```text
/calc (10 + 2) ^ 2
```

Result:

```text
144
```

```text
/calc -5 * (3 + 4)
```

Result:

```text
-35
```

```text
/calc 2,5 * 4
```

Result:

```text
10
```

## Validation Rules

The parser accepts only the mathematical syntax implemented by the module. Unsupported characters and malformed expressions are rejected.

Examples of invalid input:

```text
/calc 2 + alerta
/calc (2 + 3
/calc 10 / 0
```

These are handled as validation errors instead of executing unsafe code.

## Troubleshooting

### Unsupported character error

The expression contains a symbol not included in the supported math grammar.

### Unbalanced parentheses

Verify that every opening `(` has a matching closing `)`.

### Division by zero

The module rejects invalid arithmetic such as division by zero.

### Non-finite result

If the calculation produces a non-finite numeric value, it is rejected.

## Local Testing

With Node.js installed, run:

```bash
npm test
```

This checks:

- operator precedence
- parentheses handling
- decimal parsing
- unary operators
- invalid expression validation

## Development Notes

The implementation converts the expression into tokens, transforms it to postfix notation, and evaluates it with controlled arithmetic operations. This keeps the evaluation deterministic and safer than executing raw input directly.

## License

This project is distributed under the repository license included in the project files.

## Support

For updates and source access, visit the repository:

[GitHub Repository](https://github.com/DouglasLimeira/simpleCalculator)

