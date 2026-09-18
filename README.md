# Simple Calculator

Perform math calculations directly in your session chat with a simple command.

## What this module does

This module lets you type expressions in chat and get the result back instantly using `/calc`.

It is useful for quick arithmetic during sessions without leaving the conversation.

## Installation

Install using the manifest URL:

```text
https://github.com/DouglasLimeira/simpleCalculator/releases/latest/download/module.json
```

Then enable the module in your Foundry world.

## Quick Start

Use the command in chat:

```text
/calc (2 + 3) * 4
```

The result will appear in the chat.

## Support syntax

The calculator supports:

- Addition: `+`
- Subtraction: `-`
- Multiplication: `*`
- Division: `/`
- Modulo: `%`
- Exponentiation: `^`
- Parentheses: `(` and `)`
- Decimal values: `2,5` or `2.5`
- Unary values: `-2`, `+5`

Operator precedence follows standard math rules:

```text
Parentheses > Exponentiation > Multiplication / Division / Modulo > Addition / Subtraction
```

## Support

For updates and source access, visit:

[GitHub Repository](https://github.com/DouglasLimeira/simpleCalculator)

