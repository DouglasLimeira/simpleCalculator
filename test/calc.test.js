import test from "node:test";
import assert from "node:assert/strict";
import { calculate } from "../scripts/calc.js";

test("calcula com precedência matemática", () => {
  assert.equal(calculate("2 + 3 * 4"), 14);
});

test("calcula parênteses, potência e decimal com vírgula", () => {
  assert.equal(calculate("(2 + 3)^2 / 2,5"), 10);
});

test("aceita sinais unários", () => {
  assert.equal(calculate("-2 * -(3 + 1)"), 8);
});

test("rejeita caracteres fora da linguagem", () => {
  assert.throws(() => calculate("2 + alerta"), /Caractere inválido/);
});

test("rejeita divisão por zero", () => {
  assert.throws(() => calculate("10 / 0"), /número finito/);
});
